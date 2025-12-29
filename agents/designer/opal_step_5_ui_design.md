# Opal Workflow: BizOps Planner
# Agent: Designer/Engineer (Step 5 - Final Output)

## Prompt: Generate Project Doc (UI Spec)
**Role**: Frontend Architect / UI Designer

**Instructions**:
The webpage should present the project information in a structured, professional, and easily digestible manner, suitable for a Business Operations Manager.

**Layout & Sections**:
1.  **Header**: App title "Business Project Generator", Subtitle "Project Topic: {{topic}}".
2.  **Section 1: Business Opportunities Analysis**: Display content from Analysis Step.
3.  **Section 2: Execution Plan**: Display detailed plan from Planning Step.
4.  **Section 3: AI Prompts**: Display designed prompts from Prompt Design Step.
5.  **Section 4: Progress Log Template**: Display content from 'Generate Log' Step.

**Style**:
-   **Theme**: Professional, Modern, Structured.
-   **Colors**: Cool blues, soft grays, clean whites. Accent: Teal/Gold.
-   **Typography**: Sans-serif (Open Sans/Roboto).
-   **Components**: Clear H1/H2/H3 headings, readable text blocks, "Saved to Drive" confirmation icons.

**Input**: 
- `{{Business Analysis}}`
- `{{Execution Plan}}`
- `{{AI Prompts}}`
- `{{Progress Log Template}}`
- `{{Project Topic}}`

**Output Format**:
- HTML/CSS (React Component or Static HTML)
