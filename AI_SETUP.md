# Microsoft Azure AI Foundry Setup Guide for Placey (M.A.C.O.S.)

This guide details the Azure AI Foundry configuration, API key setup, and cloud-hosted agent architecture for Placey, built for **Course AI-103: Azure AI Apps and Agents Developer**.

---

## 1. Cloud Infrastructure & Active Model

- **Platform:** Microsoft Azure AI Foundry (`ai.azure.com`)
- **Resource Name:** `yashplacey-resource`
- **Project Name:** `yashplacey`
- **Active Model:** `gpt-4o`
- **Deployment Endpoint:** `https://yashplacey-resource.services.ai.azure.com/openai/v1`
- **Project Endpoint:** `https://yashplacey-resource.services.ai.azure.com/api/projects/yashplacey`

---

## 2. Cloud Agent Catalog (AI-103)

Placey executes an explicit, modular multi-agent pipeline where each agent is registered and runs on Microsoft Azure AI Foundry:

| Agent | Registered Name | Version | Cloud Agent ID | Role |
| :--- | :--- | :---: | :--- | :--- |
| **1. Skills Discovery** | `SkillsDiscoveryAgent` | `4` | `20799820-18dc-4f50-9571-2dd73c2c251c` | Evaluates demonstrated capabilities vs unevidenced claims |
| **2. Market Intelligence** | `marketIntelligenceAgent` | `2` | `8d3095f3-b568-4252-b92a-7efd308674f8` | Analyzes live market expectations & competitive differentiators |
| **3. Career Trajectory** | `careerTrajectoryIntelligenceAgent` | `2` | `c8166b1b-5cf8-4621-909f-c96e6a943577` | Mines transitions of real professionals & identifies closest route |
| **4. Gap Analysis** | `gapAnalysisSpecialist` | `2` | `1ff16921-114c-4335-96b9-0cd5da8958c8` | Triple triangulation across profile, market & trajectories |
| **5. Pathway Architect** | `pathwayArchitectAgent` | `2` | `6c1a05e7-fe9b-4d7c-b1a9-93c0913832e1` | Generates 4-phase career pathway (Learn, Build, Demonstrate, Reassess) |

---

## 3. Environment Variables Configuration (`.env.local`)

```env
# AI Provider: Microsoft Azure AI Foundry (AI-103)
AI_PROVIDER=azure_foundry
AZURE_AI_FOUNDRY_ENDPOINT=https://yashplacey-resource.services.ai.azure.com/openai/v1
AZURE_OPENAI_ENDPOINT=https://yashplacey-resource.openai.azure.com/openai/v1
AZURE_AI_FOUNDRY_API_KEY=your_key_here
AZURE_AI_FOUNDRY_MODEL=gpt-4o

# Azure AI Foundry Project Endpoint & Registered Cloud Agents
AZURE_AI_PROJECT_ENDPOINT=https://yashplacey-resource.services.ai.azure.com/api/projects/yashplacey
AZURE_AGENT_SKILLS_NAME=SkillsDiscoveryAgent
AZURE_AGENT_SKILLS_VERSION=4
AZURE_AGENT_SKILLS_ID=20799820-18dc-4f50-9571-2dd73c2c251c

AZURE_AGENT_MARKET_NAME=marketIntelligenceAgent
AZURE_AGENT_MARKET_VERSION=2
AZURE_AGENT_MARKET_ID=8d3095f3-b568-4252-b92a-7efd308674f8

AZURE_AGENT_TRAJECTORY_NAME=careerTrajectoryIntelligenceAgent
AZURE_AGENT_TRAJECTORY_VERSION=2
AZURE_AGENT_TRAJECTORY_ID=c8166b1b-5cf8-4621-909f-c96e6a943577

AZURE_AGENT_GAP_NAME=gapAnalysisSpecialist
AZURE_AGENT_GAP_VERSION=2
AZURE_AGENT_GAP_ID=1ff16921-114c-4335-96b9-0cd5da8958c8

AZURE_AGENT_PATHWAY_NAME=pathwayArchitectAgent
AZURE_AGENT_PATHWAY_VERSION=2
AZURE_AGENT_PATHWAY_ID=6c1a05e7-fe9b-4d7c-b1a9-93c0913832e1
```

---

## 4. Verification & Diagnostics

1. **AI Health Endpoint:**
   👉 Visit `http://localhost:3000/api/health/ai`
   Returns real-time status and registered agent metadata:
   ```json
   {
     "configured": true,
     "provider": "Azure AI Foundry (AI-103)",
     "status": "ok",
     "model": "gpt-4o",
     "latencyMs": 420,
     "agents": { ... }
   }
   ```

2. **System Diagnostics Showcase:**
   👉 Visit `http://localhost:3000/debug`
   Inspect the live status cards and the **Azure AI Foundry Cloud Agent Hub** displaying all 5 agents, their versions, and IDs.
