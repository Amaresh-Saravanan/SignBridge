import re
from pathlib import Path
from typing import List, Optional
from orchestrator.config import TASKS_DIR
from orchestrator.models import Task

class TaskManager:
    @staticmethod
    def parse_task_file(file_path: Path) -> Task:
        content = file_path.read_text(encoding="utf-8")
        
        # Regex extraction helpers
        task_id = re.search(r"-\s*\*\*Task ID\*\*:\s*(.*)", content)
        task_name = re.search(r"-\s*\*\*Task Name\*\*:\s*(.*)", content)
        priority = re.search(r"-\s*\*\*Priority\*\*:\s*(.*)", content)
        assigned_agent = re.search(r"-\s*\*\*Assigned Agent\*\*:\s*(.*)", content)
        complexity = re.search(r"-\s*\*\*Estimated Complexity\*\*:\s*(.*)", content)
        
        objective_match = re.search(r"# Objective\n(.*?)(?=\n#|$)", content, re.DOTALL)
        background_match = re.search(r"# Background\n(.*?)(?=\n#|$)", content, re.DOTALL)
        
        functional_reqs = re.findall(r"-\s*(.*?)\n", re.search(r"# Functional Requirements\n(.*?)(?=\n#|$)", content, re.DOTALL).group(1) if re.search(r"# Functional Requirements\n", content) else "")
        constraints = re.findall(r"-\s*(.*?)\n", re.search(r"# Constraints\n(.*?)(?=\n#|$)", content, re.DOTALL).group(1) if re.search(r"# Constraints\n", content) else "")
        deliverables = re.findall(r"-\s*(.*?)\n", re.search(r"# Deliverables\n(.*?)(?=\n#|$)", content, re.DOTALL).group(1) if re.search(r"# Deliverables\n", content) else "")
        
        # Check overall completion (e.g. check standard box in Definition of Done or the files general state)
        completed = False
        # If definition of done checkboxes are all checked
        dod_sec = re.search(r"# Definition of Done\n(.*?)(?=\n#|$)", content, re.DOTALL)
        if dod_sec:
            unchecked = re.findall(r"-\s*\[\s*\]", dod_sec.group(1))
            checked = re.findall(r"-\s*\[[xX]\]", dod_sec.group(1))
            if checked and not unchecked:
                completed = True

        # Extract acceptance criteria list
        ac_match = re.search(r"# Acceptance Criteria\n(.*?)(?=\n#|$)", content, re.DOTALL)
        acceptance_criteria = []
        if ac_match:
            acceptance_criteria = re.findall(r"-\s*\[\s*[ xX]*\s*\]\s*(.*)", ac_match.group(1))

        # Extract dependencies
        dep_match = re.search(r"-\s*\*\*This task depends on\*\*:\s*(.*)", content)
        if not dep_match:
            dep_match = re.search(r"This task depends on:\s*(.*)", content)
            
        dependencies = []
        if dep_match:
            dep_str = dep_match.group(1).strip()
            if "None" not in dep_str and dep_str:
                raw_deps = re.split(r",|\band\b", dep_str)
                for d in raw_deps:
                    d_clean = re.sub(r"[Tt]ask\s*", "", d).strip()
                    if d_clean:
                        if d_clean.isdigit() and len(d_clean) == 1:
                            d_clean = f"0{d_clean}"
                        dependencies.append(d_clean)

        return Task(
            id=task_id.group(1).strip() if task_id else "",
            name=task_name.group(1).strip() if task_name else file_path.stem,
            priority=priority.group(1).strip() if priority else "Medium",
            assigned_agent=assigned_agent.group(1).strip() if assigned_agent else "React Agent",
            complexity=complexity.group(1).strip() if complexity else "Low",
            objective=objective_match.group(1).strip() if objective_match else "",
            background=background_match.group(1).strip() if background_match else "",
            functional_requirements=[x.strip() for x in functional_reqs if x.strip()],
            constraints=[x.strip() for x in constraints if x.strip()],
            acceptance_criteria=acceptance_criteria,
            deliverables=[x.strip() for x in deliverables if x.strip()],
            dependencies=dependencies,
            completed=completed,
            raw_markdown=content
        )

    def load_all_tasks(self) -> List[Task]:
        tasks = []
        if not TASKS_DIR.exists():
            return tasks
        
        for file_path in sorted(TASKS_DIR.glob("*.md")):
            tasks.append(self.parse_task_file(file_path))
        return tasks

    def get_current_task(self) -> Optional[Task]:
        import json
        from orchestrator.config import STATE_JSON_PATH
        
        # Check for state file
        saved_task_id = None
        if STATE_JSON_PATH.exists():
            try:
                with open(STATE_JSON_PATH, "r", encoding="utf-8") as f:
                    state = json.load(f)
                    if state.get("status") == "running":
                        saved_task_id = state.get("task")
            except Exception as e:
                print(f"[Warning] Failed to read state.json: {e}")

        tasks = self.load_all_tasks()
        
        # If there is a saved task in progress, try to resume from it
        if saved_task_id:
            for task in tasks:
                if task.id == saved_task_id and not task.completed:
                    print(f"[Resume] Found crash recovery state. Resuming from Task {saved_task_id}")
                    return task

        for task in tasks:
            if not task.completed:
                return task
        return None

    def save_state(self, task_id: str, status: str) -> None:
        import json
        from orchestrator.config import STATE_JSON_PATH
        try:
            with open(STATE_JSON_PATH, "w", encoding="utf-8") as f:
                json.dump({"task": task_id, "status": status}, f, indent=2)
        except Exception as e:
            print(f"[Warning] Failed to write state.json: {e}")

    def mark_task_complete(self, task_id: str) -> bool:
        for file_path in TASKS_DIR.glob("*.md"):
            task = self.parse_task_file(file_path)
            if task.id == task_id:
                content = file_path.read_text(encoding="utf-8")
                # Check definition of done boxes
                updated_content = re.sub(r"-\s*\[\s*\]", "- [x]", content)
                file_path.write_text(updated_content, encoding="utf-8")
                # Save task as complete in state
                self.save_state(task_id, "completed")
                # Update progress tracking memory file
                self.update_progress_memory(task_id)
                return True
        return False

    def update_progress_memory(self, task_id: str) -> None:
        import json
        from orchestrator.config import WORKSPACE_DIR
        progress_path = WORKSPACE_DIR / "memory" / "progress.json"
        if progress_path.exists():
            try:
                with open(progress_path, "r", encoding="utf-8") as f:
                    progress_data = json.load(f)
                
                completed = progress_data.get("completed_tasks", [])
                if task_id not in completed:
                    completed.append(task_id)
                progress_data["completed_tasks"] = completed
                
                # Determine next task ID
                tasks = self.load_all_tasks()
                next_task_id = None
                for t in tasks:
                    if t.id not in completed and not t.completed:
                        next_task_id = t.id
                        break
                
                progress_data["current_task"] = next_task_id if next_task_id else "All Completed"
                
                with open(progress_path, "w", encoding="utf-8") as f:
                    json.dump(progress_data, f, indent=2)
            except Exception as e:
                print(f"[Warning] Failed to update progress.json memory: {e}")


