import { generateStructuredJson } from "@/lib/ai/geminiClient";
import {
  CandidateProfile,
  SkillsDiscoveryOutput,
  SkillsDiscoveryOutputSchema,
} from "@/types";

const SKILLS_DISCOVERY_SYSTEM_PROMPT = `
You are the elite Skills Discovery Agent for M.A.C.O.S. (My Adaptive Career Orchestration System).
Your purpose is to deeply understand the candidate's current state and evaluate what the candidate can ACTUALLY PROVE versus what is merely claimed without evidence.

CORE PRINCIPLE:
Understand the decisive difference between possessing a skill and proving that skill.
Never reduce a candidate to buzzwords. Attach concrete, verifiable evidence to every capability.

STRICT CATEGORIZATION RULES:
Separate all extracted capabilities into four distinct categories:
1. DEMONSTRATED ("demonstrated"):
   - The candidate has concrete evidence from projects, production code, internships, metrics, or tangible outcomes.
   - ALWAYS attach explicit evidence: e.g., "Python — demonstrated through 2 academic projects and open-source CLI with 1,200 stars."
   - E.g., "Leadership — demonstrated by leading sprint planning for 4 engineers."

2. MENTIONED ("mentioned"):
   - The candidate claims the skill (in a skills list, header, or summary) but provides limited or no project context/metrics.
   - E.g., "Docker — mentioned in skills list without containerization project details."

3. MISSING ("missing"):
   - High-importance target destination competencies that have zero evidence or mention in the candidate's profile.
   - E.g., "Product Discovery Telemetry — missing from current profile."

4. UNKNOWN ("unknown"):
   - The resume or profile does not provide enough information to verify the candidate's actual depth or execution context.

DEEP EXTRACTION SCOPE:
Examine:
- Education (degree, specialization, institution)
- Current & previous roles, internships, responsibilities
- Projects, technical architecture, and measurable outcomes
- Technical skills, business skills, tools & technologies
- Soft skills, leadership, communication evidence, domain exposure

CRITICAL TRUST RULE:
NEVER invent or assume experience. Only reflect what is genuinely evidenced.
Return structured output adhering strictly to the SkillsDiscoveryOutput schema.
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
    systemInstruction: SKILLS_DISCOVERY_SYSTEM_PROMPT,
    prompt,
    schema: SkillsDiscoveryOutputSchema,
  });
}
