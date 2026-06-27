from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class Task:
    id: str
    name: str
    priority: str
    assigned_agent: str
    complexity: str
    objective: str
    background: str
    functional_requirements: List[str] = field(default_factory=list)
    non_functional_requirements: Dict[str, str] = field(default_factory=dict)
    constraints: List[str] = field(default_factory=list)
    acceptance_criteria: List[str] = field(default_factory=list)
    deliverables: List[str] = field(default_factory=list)
    validation_steps: List[str] = field(default_factory=list)
    dependencies: List[str] = field(default_factory=list)
    completed: bool = False
    raw_markdown: str = ""

@dataclass
class Agent:
    name: str
    role: str
    responsibilities: List[str] = field(default_factory=list)
    rules: List[str] = field(default_factory=list)
    raw_markdown: str = ""

@dataclass
class ReviewResult:
    status: str  # PASS or FAIL
    feedback: str
    raw_response: str
