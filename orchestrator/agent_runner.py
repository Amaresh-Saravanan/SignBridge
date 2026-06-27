import os
import json
import requests
from pathlib import Path
from typing import Optional, List
from orchestrator.config import WORKSPACE_DIR, AGENTS_DIR, CONTEXT_DIR, API_PROVIDER, GEMINI_API_KEY, OPENAI_API_KEY, OPENAI_BASE_URL, get_model_for_agent
from orchestrator.models import Task, Agent

CONTEXT_MAPPINGS = {
    "planner": ["project.md", "architecture.md"],
    "researcher": ["project.md", "tech-stack.md", "isl-guidelines.md"],
    "avatar": ["project.md", "avatar-guidelines.md", "material-guidelines.md"],
    "blender": ["project.md", "avatar-guidelines.md", "blender-guidelines.md", "material-guidelines.md"],
    "animation": ["project.md", "animation-guidelines.md", "isl-guidelines.md"],
    "react": ["project.md", "architecture.md", "coding-standards.md", "react-guidelines.md"],
    "backend": ["project.md", "architecture.md", "coding-standards.md", "backend-guidelines.md"],
    "reviewer": ["project.md", "review-rules.md"],
    "debugger": ["project.md", "coding-standards.md"],
    "tester": ["project.md", "coding-standards.md"]
}

class AgentRunner:
    @staticmethod
    def load_agent(agent_name: str) -> Agent:
        clean_name = agent_name.lower().replace("agent", "").replace("designer", "").strip()
        file_path = AGENTS_DIR / f"{clean_name}.md"
        if not file_path.exists():
            matches = list(AGENTS_DIR.glob(f"*{clean_name}*"))
            if matches:
                file_path = matches[0]
            else:
                raise FileNotFoundError(f"Agent instruction file not found for: {agent_name} in {AGENTS_DIR}")

        content = file_path.read_text(encoding="utf-8")
        return Agent(
            name=agent_name,
            role=content,
            raw_markdown=content
        )

    @staticmethod
    def load_context_for_agent(agent_name: str) -> str:
        key = agent_name.lower().replace("agent", "").replace("designer", "").strip()
        allowed_files = CONTEXT_MAPPINGS.get(key, ["project.md"])
        
        context_str = ""
        for file_name in allowed_files:
            file_path = CONTEXT_DIR / file_name
            if file_path.exists():
                context_str += f"\n\n--- Context File: {file_name} ---\n"
                context_str += file_path.read_text(encoding="utf-8")
        return context_str

    def run_agent(self, agent_name: str, task: Task, feedback: Optional[str] = None) -> str:
        agent = self.load_agent(agent_name)
        context = self.load_context_for_agent(agent_name)
        model_name = get_model_for_agent(agent_name)

        # Load Planner Memory parameters to enforce standard guidelines and prevent repeated bugs
        memory_str = ""
        try:
            project_mem = WORKSPACE_DIR / "memory" / "project.json"
            bugs_mem = WORKSPACE_DIR / "memory" / "bugs.json"
            arch_mem = WORKSPACE_DIR / "memory" / "architecture.md"

            if project_mem.exists():
                with open(project_mem, "r", encoding="utf-8") as f:
                    proj_data = json.load(f)
                    memory_str += f"\nCoding Style Guideline: {proj_data.get('coding_style', '')}\n"
                    memory_str += f"Animation Guideline: {proj_data.get('animation_style', '')}\n"

            if arch_mem.exists():
                memory_str += f"\n--- Architecture Reference ---\n{arch_mem.read_text(encoding='utf-8')}\n"

            if bugs_mem.exists():
                with open(bugs_mem, "r", encoding="utf-8") as f:
                    bugs_list = json.load(f)
                    if bugs_list:
                        memory_str += "\n--- PREVENT REPEATING PAST BUGS & MISTAKES ---\n"
                        for bug in bugs_list:
                            memory_str += f"- Bug ID: {bug.get('bug_id')}\n"
                            memory_str += f"  Description: {bug.get('description')}\n"
                            memory_str += f"  Root Cause: {bug.get('root_cause')}\n"
                            memory_str += f"  Fix Recommendation: {bug.get('fix')}\n"
                            memory_str += f"  Avoidance Rule: {bug.get('avoidance_rule')}\n"
        except Exception as e:
            print(f"[Warning] Failed to load memory files: {e}")

        system_instruction = f"""
{agent.role}

--- MAPPED RUNNING MODEL ---
Model Assigned: {model_name}

--- PLANNER PERSISTENT MEMORY ---
{memory_str}

--- SHARED PROJECT CONTEXT ---
{context}
"""

        user_prompt = f"""
You are assigned to complete the following task:

Task Name: {task.name}
Priority: {task.priority}
Complexity: {task.complexity}

--- OBJECTIVE ---
{task.objective}

--- BACKGROUND ---
{task.background}

--- FUNCTIONAL REQUIREMENTS ---
{chr(10).join(f"- {req}" for req in task.functional_requirements)}

--- CONSTRAINTS ---
{chr(10).join(f"- {con}" for con in task.constraints)}

--- EXPECTED DELIVERABLES ---
{chr(10).join(f"- {deliv}" for deliv in task.deliverables)}
"""
        if feedback:
            user_prompt += f"\n\n--- PREVIOUS REVIEW FEEDBACK (FAIL) ---\n{feedback}\nPlease fix the issues mentioned in the feedback."

        user_prompt += "\n\nProvide your detailed completion report, code output, or configuration specifications."

        return self.call_llm(system_instruction, user_prompt, model_name)

    def call_llm(self, system_instruction: str, user_prompt: str, model_name: str) -> str:
        # Check if keys are set, if not, use mock simulation mode
        if API_PROVIDER == "gemini" and not GEMINI_API_KEY:
            return self._mock_simulation(user_prompt, model_name)
        elif API_PROVIDER == "openai" and not OPENAI_API_KEY:
            return self._mock_simulation(user_prompt, model_name)

        try:
            if API_PROVIDER == "gemini":
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={GEMINI_API_KEY}"
                headers = {"Content-Type": "application/json"}
                payload = {
                    "contents": [{"parts": [{"text": user_prompt}]}],
                    "systemInstruction": {"parts": [{"text": system_instruction}]}
                }
                res = requests.post(url, json=payload, headers=headers, timeout=30)
                res.raise_for_status()
                data = res.json()
                return data["candidates"][0]["content"]["parts"][0]["text"]

            elif API_PROVIDER == "openai":
                url = f"{OPENAI_BASE_URL}/chat/completions"
                headers = {
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "model": model_name,
                    "messages": [
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": user_prompt}
                    ]
                }
                res = requests.post(url, json=payload, headers=headers, timeout=30)
                res.raise_for_status()
                data = res.json()
                return data["choices"][0]["message"]["content"]

            else:
                return self._mock_simulation(user_prompt, model_name)

        except Exception as e:
            print(f"[Warning] LLM Call failed for model '{model_name}': {e}. Falling back to simulation mode.")
            return self._mock_simulation(user_prompt, model_name)

    def _mock_simulation(self, user_prompt: str, model_name: str) -> str:
        return f"""[SIMULATED AGENT RESPONSE - Model: {model_name}]
The agent completed the requested operations successfully.
All constraints are respected. 
Code modifications and structural elements are generated in the corresponding directory pathways.
(Note: To perform real API calls, configure your GEMINI_API_KEY or OPENAI_API_KEY environment variables.)"""
