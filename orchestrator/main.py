import os
import sys
from pathlib import Path

# Add root folder to sys.path to resolve orchestrator modules correctly
sys.path.append(str(Path(__file__).resolve().parent.parent))

from orchestrator.config import GEMINI_API_KEY, OPENAI_API_KEY, API_PROVIDER
from orchestrator.planner import PlannerOrchestrator

def main():
    print("=" * 60)
    print("SignBridge Multi-Agent System Core Pipeline Orchestrator")
    print("=" * 60)
    
    # Inform about environment configuration
    if API_PROVIDER == "gemini" and not GEMINI_API_KEY:
        print("[Notice] GEMINI_API_KEY environment variable is not set.")
        print("         Orchestrator will run in SIMULATED execution mode.")
        print("         To enable live API calls, run: $env:GEMINI_API_KEY='your-key'")
        print("-" * 60)
    elif API_PROVIDER == "openai" and not OPENAI_API_KEY:
        print("[Notice] OPENAI_API_KEY environment variable is not set.")
        print("         Orchestrator will run in SIMULATED execution mode.")
        print("         To enable live API calls, run: $env:OPENAI_API_KEY='your-key'")
        print("-" * 60)
    else:
        print(f"[Active] Live API pipeline initialized using provider: {API_PROVIDER.upper()}")
        print("-" * 60)

    try:
        orchestrator = PlannerOrchestrator()
        orchestrator.run_pipeline()
    except KeyboardInterrupt:
        print("\n[Halt] Orchestration terminated by user command.")
        sys.exit(0)

if __name__ == "__main__":
    main()
