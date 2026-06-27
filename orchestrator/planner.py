import time
import json
import struct
import subprocess
import threading
from pathlib import Path
from typing import Optional, List
from concurrent.futures import ThreadPoolExecutor, as_completed
from orchestrator.config import LOGS_DIR, WORKSPACE_DIR
from orchestrator.models import Task, ReviewResult
from orchestrator.task_manager import TaskManager
from orchestrator.agent_runner import AgentRunner
from orchestrator.reviewer import ReviewerAgent

class PlannerOrchestrator:
    def __init__(self):
        self.task_manager = TaskManager()
        self.runner = AgentRunner()
        self.reviewer = ReviewerAgent(self.runner)
        self.file_lock = threading.RLock()
        self.planner_log_path = LOGS_DIR / "planner.log"
        self.review_log_path = LOGS_DIR / "review.log"
        self.build_log_path = LOGS_DIR / "build.log"
        self.animation_log_path = LOGS_DIR / "animation.log"

    def run_pipeline(self) -> None:
        print("=" * 60)
        print("          SIGNBRIDGE MULTI-AGENT ORCHESTRATOR           ")
        print("=" * 60)
        self._log_planner("--- Pipeline Execution Started ---")

        while True:
            # Reload tasks on each iteration to pick up completed checkbox changes
            with self.file_lock:
                all_tasks = self.task_manager.load_all_tasks()
                
            uncompleted_tasks = [t for t in all_tasks if not t.completed]
            if not uncompleted_tasks:
                print("\n[Success] All tasks in the roadmap have been completed successfully!")
                self._log_planner("Pipeline completed successfully. All tasks finished.")
                break

            # Calculate dependencies dynamically
            completed_ids = {t.id for t in all_tasks if t.completed}
            
            # Find tasks where all dependencies are satisfied
            ready_tasks = []
            for t in uncompleted_tasks:
                deps_satisfied = True
                for dep in t.dependencies:
                    if dep not in completed_ids:
                        deps_satisfied = False
                        break
                if deps_satisfied:
                    ready_tasks.append(t)

            if not ready_tasks:
                print("\n[Error] Dependency deadlock detected. Tasks remain but dependencies are not met.")
                self._log_planner("Halted due to unresolved dependency tree loops.")
                break

            print(f"\n[Parallel Run] Launching Batch of {len(ready_tasks)} Task(s) in Parallel:")
            for t in ready_tasks:
                print(f" -> Task {t.id}: {t.name} (Agent: {t.assigned_agent})")
            print("-" * 50)

            # Mark all ready tasks as running in state
            with self.file_lock:
                for t in ready_tasks:
                    self.task_manager.save_state(t.id, "running")
                    self._log_planner(f"Running Task {t.id} ({t.name}) on thread.")

            # Execute the batch concurrently
            batch_success = True
            with ThreadPoolExecutor(max_workers=len(ready_tasks)) as executor:
                futures = {executor.submit(self.execute_task_workflow, t): t for t in ready_tasks}
                
                for future in as_completed(futures):
                    task = futures[future]
                    try:
                        success = future.result()
                        if success:
                            print(f"[Success] Thread completed: Task {task.id} is verified!")
                            with self.file_lock:
                                self.task_manager.mark_task_complete(task.id)
                            self._log_planner(f"Task {task.id} finished successfully on thread.")
                        else:
                            print(f"[Error] Thread completed: Task {task.id} failed.")
                            batch_success = False
                    except Exception as e:
                        print(f"[Exception] Task {task.id} raised: {e}")
                        batch_success = False

            if not batch_success:
                print("\n[Error] Parallel batch execution encountered failure. Halting pipeline.")
                self._log_planner("Pipeline execution halted due to task failure in concurrent batch.")
                break
                
            time.sleep(1)

    def execute_task_workflow(self, task: Task) -> bool:
        prefix = f"[Task {task.id}]"
        retries = 3
        feedback = None
        attempt = 1

        while attempt <= retries:
            print(f"{prefix} Attempt {attempt} of {retries} for Task {task.id} ({task.assigned_agent})...")
            
            # Step 1: Run Assigned Agent
            agent_output = self.runner.run_agent(task.assigned_agent, task, feedback)
            self._save_log(task.id, task.assigned_agent, f"ATTEMPT_{attempt}_OUTPUT", agent_output)
            
            # Step 2.6: Save Output to output/task[ID]/ folder
            clean_agent = task.assigned_agent.lower()
            if "research" in clean_agent or "avatar" in clean_agent:
                self._save_output(task.id, "notes.txt", agent_output)
            else:
                self._save_output(task.id, "code.txt", agent_output)

            # Step 2: Run Reviewer
            print(f"{prefix} Forwarding output to Reviewer Agent...")
            review: ReviewResult = self.reviewer.review_output(task, agent_output)
            self._save_log(task.id, "Reviewer", f"ATTEMPT_{attempt}_REVIEW", review.raw_response)
            
            # Log reviews
            self._log_review(f"Task {task.id} Attempt {attempt} Review: {review.status}\n{review.feedback}")
            self._save_output(task.id, "review.txt", review.raw_response)

            print(f"{prefix} Review Status Result: {review.status}")
            
            if review.status == "PASS":
                # Step 3.1: Build Runner Checks
                print(f"{prefix} Running build checks (install, build, lint, test)...")
                build_success = self.run_build_checks(task.id)
                
                # Step 3.2: Blender/GLB Validation
                glb_success = True
                if any(x in clean_agent for x in ["blender", "rig", "avatar"]):
                    glb_path = WORKSPACE_DIR / "public" / "models" / "avatar.glb"
                    print(f"{prefix} Verifying GLB file at public/models/avatar.glb...")
                    glb_success = self.validate_glb_asset(glb_path)
                    print(f"{prefix} Blender Validation Result: {'PASS' if glb_success else 'FAIL'}")

                if build_success and glb_success:
                    # Step 3.3: Tester Agent validation
                    print(f"{prefix} Forwarding to Tester Agent for final verification...")
                    tester_output = self.runner.run_agent("Tester", task, agent_output)
                    self._save_log(task.id, "Tester", f"ATTEMPT_{attempt}_TEST", tester_output)
                    self._save_output(task.id, "test.txt", tester_output)

                    # Check if tester output is positive
                    if "FAIL" not in tester_output.upper():
                        print(f"{prefix} Tester verification: PASS")
                        return True
                    else:
                        print(f"{prefix} Tester verification: FAIL")
                        feedback = f"Tester failed with reports:\n{tester_output}"
                else:
                    feedback = "Validation runner checks failed (check logs/build.log or logs/animation.log)."
            else:
                # Step 4: Run Debugger Agent
                print(f"{prefix} Review failed. Initiating Debugger Agent...")
                debugger_output = self.runner.run_agent("Debugger", task, f"Agent output:\n{agent_output}\n\nReview feedback:\n{review.feedback}")
                self._save_log(task.id, "Debugger", f"ATTEMPT_{attempt}_DEBUG", debugger_output)
                self._save_output(task.id, "debug.txt", debugger_output)
                feedback = f"Review failed. Debugger recommended fixes:\n{debugger_output}"

            attempt += 1
            time.sleep(1)

        return False

    def run_build_checks(self, task_id: str) -> bool:
        """Executes terminal commands npm install, build, lint, and test automatically."""
        commands = [
            ("npm install", ["npm", "install"]),
            ("npm run build", ["npm", "run", "build"]),
            ("npm run lint", ["npm", "run", "lint"]),
            ("npm test", ["npm", "test"])
        ]
        
        log_content = f"--- Task {task_id} Build Run ---\n"
        overall_success = True
        
        for name, cmd in commands:
            log_content += f"\nCommand: {name}\n"
            try:
                result = subprocess.run(
                    cmd, 
                    cwd=str(WORKSPACE_DIR), 
                    stdout=subprocess.PIPE, 
                    stderr=subprocess.PIPE, 
                    text=True, 
                    shell=True,
                    timeout=60
                )
                log_content += result.stdout + "\n" + result.stderr + "\n"
                log_content += f"Exit code: {result.returncode}\n"
                
                if "test" not in name and result.returncode != 0:
                    overall_success = False
            except Exception as e:
                log_content += f"Execution Error: {e}\n"
                if "test" not in name:
                    overall_success = False
        
        with self.file_lock:
            with open(self.build_log_path, "a", encoding="utf-8") as f:
                f.write(log_content + "\n")
            
        return overall_success

    def validate_glb_asset(self, glb_path: Path) -> bool:
        """Validates GLB exports, parsing structures to verify bones, animations, and textures."""
        if not glb_path.exists():
            log_msg = f"[Error] GLB file does not exist at: {glb_path}\n"
            with self.file_lock:
                with open(self.animation_log_path, "a", encoding="utf-8") as f:
                    f.write(log_msg)
            return False

        try:
            with open(glb_path, "rb") as f:
                header = f.read(12)
                if len(header) < 12:
                    return False
                magic, version, length = struct.unpack("<III", header)
                if magic != 0x46546C67:
                    return False

                chunk_header = f.read(8)
                if len(chunk_header) < 8:
                    return False
                chunk_length, chunk_type = struct.unpack("<II", chunk_header)
                if chunk_type != 0x4E4F534A:
                    return False

                chunk_data = f.read(chunk_length)
                gltf_json = json.loads(chunk_data.decode("utf-8"))

                nodes = gltf_json.get("nodes", [])
                animations = gltf_json.get("animations", [])
                textures = gltf_json.get("textures", [])
                skins = gltf_json.get("skins", [])

                log_msg = f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] GLB Export Verification (Asset: {glb_path.name}):\n"
                log_msg += f"  - Bone/Joint Nodes: {len(nodes)} total nodes found.\n"
                log_msg += f"  - Animations tracks: {len(animations)} clips.\n"
                log_msg += f"  - Textures count: {len(textures)} textures.\n"
                log_msg += f"  - Skins configured: {len(skins)} skins.\n"

                validation_pass = len(nodes) > 0

                with self.file_lock:
                    with open(self.animation_log_path, "a", encoding="utf-8") as lf:
                        lf.write(log_msg + f"  - Status: {'PASS' if validation_pass else 'FAIL'}\n\n")

                return validation_pass

        except Exception as e:
            with self.file_lock:
                with open(self.animation_log_path, "a", encoding="utf-8") as lf:
                    lf.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Error parsing GLB file: {e}\n")
            return False

    def _save_log(self, task_id: str, agent_name: str, stage: str, content: str) -> None:
        log_file = LOGS_DIR / f"task_{task_id}_{agent_name}_{stage}.log"
        log_file.write_text(content, encoding="utf-8")

    def _save_output(self, task_id: str, filename: str, content: str) -> None:
        task_dir = WORKSPACE_DIR / "output" / f"task{task_id}"
        task_dir.mkdir(parents=True, exist_ok=True)
        out_file = task_dir / filename
        out_file.write_text(content, encoding="utf-8")

    def _log_planner(self, message: str) -> None:
        with self.file_lock:
            with open(self.planner_log_path, "a", encoding="utf-8") as f:
                f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")

    def _log_review(self, message: str) -> None:
        with self.file_lock:
            with open(self.review_log_path, "a", encoding="utf-8") as f:
                f.write(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {message}\n")
