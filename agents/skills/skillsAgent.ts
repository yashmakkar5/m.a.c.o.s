import { generateStructuredJson, AZURE_FOUNDRY_AGENTS } from "@/lib/ai/foundryClient";

import {
  CandidateProfile,
  SkillsDiscoveryOutput,
  SkillsDiscoveryOutputSchema,
} from "@/types";

const SKILLS_DISCOVERY_SYSTEM_PROMPT = `
You are the elite Skills Discovery Agent for Placey (M.A.C.O.S.).
Your mission is to deeply evaluate the candidate's current capabilities, distinguishing what the candidate can ACTUALLY PROVE with code, systems, and metrics versus what is merely claimed without verifiable evidence.

CORE PRINCIPLE: EVIDENCE-FIRST EVALUATION & PROOF-OF-WORK:
- Possessing a keyword is not proving a skill. Attach concrete, verifiable evidence to every capability.
- For demonstrated skills, cite the exact projects, codebases, metrics, architectural components, or production deliverables.
- For mentioned or missing skills, provide concrete, resourceful advice on the exact project artifact that would prove this competency to a hiring team.

STRICT CATEGORIZATION RULES:
1. DEMONSTRATED ("demonstrated"):
   - The candidate has concrete evidence from projects, production code, internships, metrics, or tangible outcomes.
   - ALWAYS attach explicit evidence: e.g., "Python — demonstrated through 2 academic projects and open-source CLI with 1,200 stars."
   - E.g., "React / Next.js — demonstrated by building full-stack application with SSR and Tailwind styling."

2. MENTIONED ("mentioned"):
   - The candidate claims the skill (in a skills list, header, or summary) but provides limited or no project context/metrics.
   - Attach the exact proof artifact they should build to elevate it to "demonstrated".

3. MISSING ("missing"):
   - High-importance target destination competencies that have zero evidence or mention in the candidate's profile.
   - Detail why this matters in modern hiring benchmarks and what specific project bridges it.

4. UNKNOWN ("unknown"):
   - The resume or profile does not provide enough information to verify the candidate's actual depth or execution context.

STRICT DIRECTIVES:
- NO SAP: Absolutely do not mention, reference, or suggest SAP in any form. Focus strictly on modern web, cloud, software engineering, systems, and AI technologies.
- NEVER invent or assume experience. Only reflect what is genuinely evidenced.
- Return structured output adhering strictly to the SkillsDiscoveryOutput schema.
`.trim();

export async function runSkillsDiscoveryAgent(
  profile: CandidateProfile
): Promise<SkillsDiscoveryOutput> {
  const prompt = `
Perform a deep, evidence-backed skills discovery evaluation for the candidate targeting "${profile.targetRole}":

CANDIDATE TARGET:
- Destination Role: ${profile.targetRole}
- Destination Industry: ${profile.targetIndustry || "Technology"}
- Destination Company: ${profile.targetCompany || "General Market"}

CANDIDATE SUMMARY & HEADLINE:
- Full Name: ${profile.fullName}
- Headline: ${profile.headline || "Practitioner"}
- Summary: ${profile.summary || "No summary provided."}

EDUCATION & SPECIALIZATION:
${
  profile.education.length > 0
    ? profile.education
        .map((ed) => `- ${ed.degree} from ${ed.institution} (${ed.year || "Completed"})`)
        .join("\n")
    : "- No formal education listed."
}

WORK EXPERIENCE & RESPONSIBILITIES:
${
  profile.experience.length > 0
    ? profile.experience
        .map(
          (e) =>
            `- Role: ${e.role} at ${e.company} (${e.duration})\n  Description: ${e.description}\n  Skills used: ${e.skillsUsed.join(", ")}\n  Achievements & Outcomes: ${e.achievements.join("; ") || "None specified"}`
        )
        .join("\n\n")
    : "- No formal work experience listed."
}

PROJECTS & EVIDENCE ARTIFACTS:
${
  profile.projects.length > 0
    ? profile.projects
        .map(
          (p) =>
            `- Project: ${p.title}\n  Description: ${p.description}\n  Technologies: ${p.technologies.join(", ")}\n  Evidence/Artifact: ${p.link || p.evidence || "No public link"}`
        )
        .join("\n\n")
    : "- No individual projects listed."
}

STATED SKILLS, TOOLS & CERTIFICATIONS:
- Technical Skills: ${profile.skills.join(", ") || "None listed"}
- Tools & Technologies: ${profile.technologies.join(", ") || "None listed"}
- Certifications: ${profile.certifications.map((c) => `${c.name} (${c.issuer})`).join("; ") || "None listed"}

INSTRUCTIONS:
1. Rigorously evaluate and categorize each skill into:
   - "demonstratedList" (must include concrete evidence: e.g. "React — demonstrated by building high-concurrency checkout flow serving 250k daily active users")
   - "mentionedList" (skills listed without project depth)
   - "missingList" (critical target competencies lacking evidence)
   - "unknownList" (skills with ambiguous depth)
2. Populate "demonstratedSkills" and "uncertainSkills" for full system compatibility.
3. Write an empowering, honest "coreStrengthsSummary" highlighting the candidate's genuine demonstrated capabilities without pedigree bias.
`.trim();

  return await generateStructuredJson<SkillsDiscoveryOutput>({
    agent: AZURE_FOUNDRY_AGENTS.skills,
    systemInstruction: SKILLS_DISCOVERY_SYSTEM_PROMPT,
    prompt,
    schema: SkillsDiscoveryOutputSchema,
  });

}
