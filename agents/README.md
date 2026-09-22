# Placey (M.A.C.O.S.) — Azure AI Foundry Cloud Agents (AI-103)

In accordance with Microsoft AI-103 architecture, all 5 core specialized agents are hosted and managed in the cloud on **Microsoft Azure AI Foundry** (`ai.azure.com`):

- **Skills Discovery Agent**: `SkillsDiscoveryAgent` (v4 | ID: `20799820-18dc-4f50-9571-2dd73c2c251c`)
- **Market Intelligence Agent**: `marketIntelligenceAgent` (v2 | ID: `8d3095f3-b568-4252-b92a-7efd308674f8`)
- **Career Trajectory Agent**: `careerTrajectoryIntelligenceAgent` (v2 | ID: `c8166b1b-5cf8-4621-909f-c96e6a943577`)
- **Gap Analysis Specialist**: `gapAnalysisSpecialist` (v2 | ID: `1ff16921-114c-4335-96b9-0cd5da8958c8`)
- **Pathway Architect Agent**: `pathwayArchitectAgent` (v2 | ID: `6c1a05e7-fe9b-4d7c-b1a9-93c0913832e1`)

Multi-agent pipeline coordination is executed by `orchestrator/careerOrchestrator.ts` via `@/lib/ai/foundryAgentRunner.ts`.
