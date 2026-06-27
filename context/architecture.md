# System Architecture & Agent Flows

## Architecture Diagram
```
                     +---------------------------------+
                     |         Planner Agent           |
                     |   (Project Orchestrator & PM)   |
                     +---------------+-----------------+
                                     |
             +-----------------------+-----------------------+
             |                       |                       |
             v                       v                       v
  +--------------------+   +--------------------+   +--------------------+
  |  Research Agent    |   |  Avatar Designer   |   |    React Agent     |
  | (Linguistic/Tech)  |   | (Visual Guidelines)|   | (Frontend Developer|
  +----------+---------+   +----------+---------+   +----------+---------+
             |                        |                        |
             |                        v                        v
             |             +--------------------+   +--------------------+
             |             |   Blender Agent    |   |   Backend Agent    |
             |             | (Armature/Rigging) |   | (Translation APIs) |
             |             +----------+---------+   +----------+---------+
             |                        |                        
             +------------------------+                        
                                      v                        
                           +--------------------+              
                           |  Animation Agent   |              
                           | (Pose Synthesis)   |              
                           +----------+---------+              
                                      |                        
                                      v                        
                           +--------------------+              
                           |   Reviewer Agent   |              
                           | (Quality Assurance)|              
                           +----------+---------+              
                                      |                        
                                      |                        
                           +----------+----------+             
                           |                     |             
                           v                     v             
                       [ PASS ]              [ FAIL ]          
                           |                     |             
                           v                     v             
                   +---------------+     +---------------+     
                   | Tester Agent  |     |Debugger Agent |     
                   | (Verification)|     | (Code Fixes)  |     
                   +-------+-------+     +-------+-------+     
                           |                     |             
                           |                     v             
                           v                  [ Retry ]        
                    [ Completion ]               |             
                           |                     v             
                           +-------------------->+             
```

## Agent Communication Protocol
1. **Milestone Assignment**: The Planner Agent reads the milestone task from the `tasks/` directory.
2. **Specialist Tasking**: The Planner directs tasks to the required specialist.
3. **Execution**: The developer agents (React, Blender, Animation, Backend) execute edits.
4. **Verification Loop**:
   - The developer agent notifies the Planner.
   - The Planner forwards the output to the **Reviewer Agent**.
   - If the Reviewer outputs `FAIL`, the task moves to the **Debugger Agent** for repairs.
   - If the Reviewer outputs `PASS`, the task moves to the **Tester Agent** for integration testing.
   - Once the Tester approves `PASS`, the Planner marks the task complete.
