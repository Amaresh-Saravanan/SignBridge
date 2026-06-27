import re
from typing import Optional
from orchestrator.agent_runner import AgentRunner
from orchestrator.models import Task, ReviewResult

class ReviewerAgent:
    def __init__(self, runner: AgentRunner):
        self.runner = runner

    def review_output(self, task: Task, agent_output: str) -> ReviewResult:
        # Load reviewer instructions
        reviewer = self.runner.load_agent("Reviewer")
        context = self.runner.load_context_for_agent("Reviewer")

        system_instruction = f"""
{reviewer.role}

--- SHARED PROJECT CONTEXT ---
{context}
"""

        user_prompt = f"""
You are reviewing the work completed for the following task:

Task Name: {task.name}
Assigned Agent: {task.assigned_agent}

--- TASK OBJECTIVE ---
{task.objective}

--- AGENT OUTPUT ---
{agent_output}

--- VERIFICATION CHECKLIST ---
{chr(10).join(f"- {ac}" for ac in task.acceptance_criteria)}

Please review the agent output against the objective and acceptance criteria.
You MUST conclude your review with either:
STATUS: PASS
or
STATUS: FAIL

If STATUS is FAIL, list every failure and suggest required fixes.
"""

        # Retrieve mapped reviewer model
        from orchestrator.config import get_model_for_agent
        model_name = get_model_for_agent("Reviewer")

        raw_response = self.runner.call_llm(system_instruction, user_prompt, model_name)

        # Parse PASS or FAIL status
        status = "FAIL"
        if "STATUS: PASS" in raw_response or "PASS" in raw_response.split()[-10:]:
            status = "PASS"
        elif "STATUS: FAIL" in raw_response:
            status = "FAIL"
        elif re.search(r"\bPASS\b", raw_response, re.IGNORECASE) and not re.search(r"\bFAIL\b", raw_response, re.IGNORECASE):
            status = "PASS"

        return ReviewResult(
            status=status,
            feedback=raw_response,
            raw_response=raw_response
        )
