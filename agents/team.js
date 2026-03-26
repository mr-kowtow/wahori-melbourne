import { query } from "@anthropic-ai/claude-agent-sdk";

const MODEL = "claude-sonnet-4-6";
const CWD = process.cwd();

/**
 * Agent A — Product Owner
 * Defines requirements, priorities, and success criteria.
 */
const productOwner = {
  description:
    "Product owner who defines requirements, user stories, and success criteria for the Melbourne housing platform.",
  prompt: `You are a Product Owner for a Melbourne rental housing platform called Wahori.
Your responsibilities:
- Define clear user stories and acceptance criteria
- Prioritise features based on business value and tenant/landlord needs
- Review deliverables against requirements
- The business model: $200 fee from tenants + 1 week rent from landlords per successful placement
- Write concise, actionable briefs for the team`,
  model: MODEL,
  tools: ["Read", "Glob"],
};

/**
 * Agent B — Tech Developer
 * Implements features, fixes bugs, writes clean code.
 */
const techDeveloper = {
  description:
    "Senior front-end developer who implements features for the Melbourne housing platform using HTML, TailwindCSS, and vanilla JavaScript.",
  prompt: `You are a Senior Front-End Developer for Wahori, a Melbourne rental housing platform.
Your responsibilities:
- Implement features using HTML, TailwindCSS, and vanilla JavaScript
- Ensure code is clean, accessible, and performant
- Fix bugs and improve existing code quality
- The stack: static HTML pages, TailwindCSS v3, no build frameworks
- Follow semantic HTML and WCAG accessibility guidelines`,
  model: MODEL,
  tools: ["Read", "Edit", "Write", "Glob", "Grep", "Bash"],
};

/**
 * Agent C — UI/UX Designer
 * Designs user flows, suggests layouts, and ensures visual consistency.
 */
const uiUxDesigner = {
  description:
    "UI/UX designer who reviews and improves the visual design, layout, and user experience of the Melbourne housing platform.",
  prompt: `You are a UI/UX Designer for Wahori, a Melbourne rental housing platform.
Your responsibilities:
- Review existing pages for UX issues and visual inconsistencies
- Suggest TailwindCSS class improvements for better layouts and spacing
- Define colour palettes, typography scales, and component patterns
- Ensure the bilingual (English/Japanese) content is well presented
- Design mobile-first, with clear calls to action for both tenants and landlords`,
  model: MODEL,
  tools: ["Read", "Glob"],
};

/**
 * Orchestrator — runs a prompt through the team.
 * Usage: node agents/team.js "your task here"
 */
async function runTeam(task) {
  console.log("=== Wahori Agent Team ===\n");
  console.log(`Task: ${task}\n`);

  for (const [role, agent] of [
    ["Product Owner", productOwner],
    ["Tech Developer", techDeveloper],
    ["UI/UX Designer", uiUxDesigner],
  ]) {
    console.log(`--- Agent: ${role} ---`);

    for await (const message of query({
      prompt: task,
      options: {
        cwd: CWD,
        allowedTools: agent.tools,
        model: agent.model,
        systemPrompt: agent.prompt,
        maxTurns: 10,
      },
    })) {
      if ("result" in message) {
        console.log(`\n[${role}]:\n${message.result}\n`);
      }
    }
  }

  console.log("=== Team session complete ===");
}

const task = process.argv.slice(2).join(" ") || "Review the project and provide your perspective from your role.";
runTeam(task).catch(console.error);
