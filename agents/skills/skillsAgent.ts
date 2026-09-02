import { generateStructuredJson } from "@/lib/ai/geminiClient";
import {
  CandidateProfile,
  SkillsDiscoveryOutput,
  SkillsDiscoveryOutputSchema,
} from "@/types";

const SKILLS_DISCOVERY_SYSTEM_PROMPT = `
You are the Skills Discovery Agent for M.A.C.O.S. (My Adaptive Career Orchestration System).
Your purpose is to rigorously evaluate what a candidate can ACTUALLY DEMONSTRATE versus what is merely claimed without evidence.

STRICT PRINCIPLES:
1. "Demonstrated Skills" MUST be supported by concrete evidence from their projects, employment, or tangible contributions (e.g. "Built REST API in Next.js", "Reduced page load time by 32%").
2. "Uncertain Skills" are skills listed in a buzzword list or resume header without direct project or work evidence. Explain clearly why it is uncertain (e.g., "Listed in skills section but no project or work achievement demonstrates production use").
3. Assign confidence levels strictly:
   - "high": Clear tangible project, metrics, or production experience.
   - "medium": Used in academic/internship context or smaller hobby project.
   - "low": Mentioned briefly or without clear verification.
4. "missingInformation": Explicitly state what key evidence or metrics are lacking for their claimed competencies.
5. Provide an empowering, honest "coreStrengthsSummary" highlighting their genuine demonstrated capabilities without pedigree bias.
`.trim();

export async function runSkillsDiscoveryAgent(
  profile: CandidateProfile
): Promise<SkillsDiscoveryOutput> {
  const prompt = `
Analyze the demonstrated capabilities of the following candidate profile:

CANDIDATE TARGET:
- Role: ${profile.targetRole}
- Industry: ${profile.targetIndustry || "Technology"}

STATED SKILLS & TECHNOLOGIES:
- Skills: ${profile.skills.join(", ") || "None listed explicitly"}
- Technologies: ${profile.technologies.join(", ") || "None listed explicitly"}

WORK EXPERIENCE:
${
  profile.experience.length > 0
    ? profile.experience
        .map(
          (e) =>
            `- ${e.role} at ${e.company} (${e.duration}): ${e.description}\n  Skills used: ${e.skillsUsed.join(", ")}\n  Achievements: ${e.achievements.join("; ")}`
        )
        .join("\n")
    : "No formal work experience listed."
}

PROJECTS & EVIDENCE:
${
  profile.projects.length > 0
    ? profile.projects
        .map(
          (p) =>
            `- ${p.title}: ${p.description}\n  Tech: ${p.technologies.join(", ")}\n  Evidence/Link: ${p.link || p.evidence || "No link"}`
        )
        .join("\n")
    : "No projects listed."
}

EDUCATION & CERTIFICATIONS:
- Education: ${profile.education.map((ed) => `${ed.degree} from ${ed.institution} (${ed.year})`).join("; ") || "Not specified"}
- Certifications: ${profile.certifications.map((c) => `${c.name} (${c.issuer})`).join("; ") || "None"}

DEMONSTRATED CAPABILITIES ALREADY NOTED:
${profile.demonstratedCapabilities.join("\n") || "None extracted"}

Evaluate this profile and generate the structured SkillsDiscoveryOutput adhering strictly to the schema.
`.trim();

  return await generateStructuredJson<SkillsDiscoveryOutput>({
    systemInstruction: SKILLS_DISCOVERY_SYSTEM_PROMPT,
    prompt,
    schema: SkillsDiscoveryOutputSchema,
  });
}
