# Technical Architecture & System Layout

## File and Folder Blueprint
```text
SignBridge/
├── src/
│   ├── components/
│   │   ├── three/             # WebGL / Three.js components
│   │   │   ├── HubAvatar.jsx  # Main canvas integration
│   │   │   └── AvatarDemo.jsx # Base verification box
│   │   └── ui/                # UI design buttons & cards
│   ├── pages/                 # Routing pages (Hub, History)
│   ├── stores/                # Zustand global state hooks
│   └── main.jsx               # React DOM entry point
├── public/
│   └── models/
│       └── avatar.glb         # skinnable production 3D model
├── orchestrator/              # Python Agent Orchestrator
├── tasks/                     # Roadmap task files
├── context/                   # Technical guidelines
├── logs/                      # Execution and subprocess logs
└── memory/                    # Persistent planner memory
```

## System Workflow & Data Flow
1. **Input Triggers**: User talks (Speech Recognition API) or types in the text input box.
2. **Text translation**: Sentences are routed through the translation store, breaking them down into Subject-Object-Verb gloss tokens.
3. **Player Canvas**: The custom R3F Animation player reads the gloss list, loads target rotation offsets, and loops SLERP rotations on the `.glb` armature joints while sync'ing mouth visemes.
