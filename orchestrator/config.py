import os
import yaml
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root
WORKSPACE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(WORKSPACE_DIR / ".env")

# Base Paths
AGENTS_DIR = WORKSPACE_DIR / "agents"
TASKS_DIR = WORKSPACE_DIR / "tasks"
CONTEXT_DIR = WORKSPACE_DIR / "context"
LOGS_DIR = WORKSPACE_DIR / "logs"
CONFIG_YAML_PATH = WORKSPACE_DIR / "config.yaml"

# Ensure directories exist
LOGS_DIR.mkdir(exist_ok=True)
STATE_JSON_PATH = WORKSPACE_DIR / "state.json"

# API Configurations
API_PROVIDER = os.getenv("API_PROVIDER", "gemini")  # Options: gemini, openai, custom
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

# Load config.yaml mappings
AGENT_MODEL_MAPPING = {}
if CONFIG_YAML_PATH.exists():
    try:
        with open(CONFIG_YAML_PATH, "r", encoding="utf-8") as f:
            yaml_content = yaml.safe_load(f)
            if yaml_content:
                for agent_key, cfg in yaml_content.items():
                    if isinstance(cfg, dict) and "model" in cfg:
                        AGENT_MODEL_MAPPING[agent_key] = cfg["model"]
                    elif isinstance(cfg, str):
                        AGENT_MODEL_MAPPING[agent_key] = cfg
    except Exception as e:
        print(f"[Warning] Failed to parse config.yaml: {e}")

def get_model_for_agent(agent_name: str) -> str:
    # Resolve standard agent key (e.g. 'React Agent' -> 'react', 'Avatar Designer' -> 'avatar')
    key = agent_name.lower().replace("agent", "").replace("designer", "").strip()
    return AGENT_MODEL_MAPPING.get(key, "gemini-2.5-flash")
