# Memory

## Purpose

This file is the durable memory of the project. It exists because chat context is not reliable across accounts, devices, or sessions.

## Rules

- Keep this file short and current.
- Update it after any important product or strategy decision.
- Store facts, not long discussions.
- If something changes, overwrite the outdated part.
- If a session can resume without chat history, this file is doing its job.

## Current Product Memory

- Product type: interactive and gamified execution guide
- Initial target user: the owner
- Current goal: use the system personally until first revenue is achieved
- Go-to-market status: do not optimize for selling yet
- Core need: portable continuity across different PCs/accounts
- Required solution: file-based checkpoints and explicit memory inside the repo
- Active track by default: Influencer IA (Fanvue)
- First revenue definition by default: first paying subscriber or first paid unlock
- Mandatory operating rule: document every file edit in a persistent repo log

## Current Strategic Interpretation

- The repo currently behaves like a dashboard plus operational guides for several business models.
- The next evolution is to turn it into a guided companion with an active mission, state, and recovery flow.
- The platform should optimize for execution and accountability, not only for information display.

## Active Assumptions

- First revenue matters more than broad polish.
- The owner may restart sessions frequently.
- Each business track should eventually have its own guided path, but only one should be active at a time.
- Written checkpoints are mandatory.

## Open Questions

- Should the default active track remain Influencer IA (Fanvue) or switch to another track later?
- Is the first revenue threshold enough, or should the next milestone be 100 EUR?
- How much manual work is acceptable in the first version?
- Which legal/compliance boundaries apply to the chosen track?

## Current Priorities

1. Make the system resumable from any session.
2. Convert the active track into a guided first-revenue sprint.
3. Convert static steps into guided missions.
4. Add evidence, validation, and checkpoint logic.
5. Only later package it for sale.

## Latest Decision

### Decision
- What changed: the default active track is now `Influencer IA (Fanvue)`
- Why: it is the most developed track in the repo, has the strongest existing guidance, and offers the shortest path to a first monetization event inside the current project structure

### State
- Active track: `Influencer IA (Fanvue)`
- Active mission: launch a first-revenue sprint with clear steps, proof, and checkpoints
- Revenue goal: first paying subscriber or first paid unlock

### Risks
- Blockers: legal and platform policy limits must be respected
- Assumptions: the owner prefers the shortest path supported by current project assets

### Next
- Next concrete action: follow the first-revenue sprint in `checkpoints/first_revenue_sprint.md`

## Latest User Rule

### Decision
- What changed: every future file edit must be documented persistently
- Why: any chat on the current account may be the last available session, so edit history must remain inside the repo

### State
- Active track: `Influencer IA (Fanvue)`
- Active mission: launch a first-revenue sprint with clear steps, proof, and checkpoints
- Revenue goal: first paying subscriber or first paid unlock

### Risks
- Blockers: if edit documentation is skipped, continuity across accounts/devices breaks
- Assumptions: `checkpoints/edit_log.md` will be treated as mandatory for all future file edits

### Next
- Next concrete action: create and maintain `checkpoints/edit_log.md` as the canonical edit trace

## Latest Product Update

### Decision
- What changed: the web UI now includes a visible mission layer for the active track with sprint progress, current day, next action, blocker capture, and restart prompt copy
- Why: the product needs to behave like a guided companion, not only like a task dashboard

### State
- Active track: `Influencer IA (Fanvue)`
- Active mission: execute the first-revenue sprint through the UI, not only through markdown files
- Revenue goal: first paying subscriber or first paid unlock

### Risks
- Blockers: mission state is currently stored in local browser storage, so cross-device continuity still depends on manual checkpoints
- Assumptions: the current UI layer is a first operational version and will later need sync with durable backend state

### Next
- Next concrete action: start Day 1 from the UI and define arquetipo, nombre, bio, tono y promesa

## Latest Product Update 2

### Decision
- What changed: Day 1 is now a real guided workflow inside the UI with editable fields, validation, summary generation, and completion gating
- Why: the mission needs executable product flows, not only informational sprint cards

### State
- Active track: `Influencer IA (Fanvue)`
- Active mission: complete Day 1 from the product itself and use the saved character definition as the base for Day 2
- Revenue goal: first paying subscriber or first paid unlock

### Risks
- Blockers: Day 1 data still lives in browser local storage until a more portable sync layer is added
- Assumptions: completing the profile base in-app reduces friction enough to make the sprint usable session to session

### Next
- Next concrete action: fill the Day 1 profile in the UI and close the day only after archetype, name, bio, tone, promise, and content angle are complete

### Decision
- What changed: Persona "Elena" (Girl Next Door / Fitness) is confirmed as the active character for the Influencer IA track.
- Why: It is a high-converting archetype with a detailed definition and pre-written prompts already available in the repo.

### State
- Active track: `Influencer IA (Fanvue)`
- Active mission: complete Day 1 and start Day 2 (image generation)
- Revenue goal: first paying subscriber or first paid unlock

### Risks
- Blockers: maintaining facial consistency across the first 30 images is critical for the LoRA training phase.
- Assumptions: the user will use Nano Banana Pro as suggested in the guides.

### Next
- Next concrete action: Input Elena's data into the UI and generate the first batch of images.
- Revenue Focus: Set up the first "Unlockable" (PPV) content strategy for Elena (Day 4 target).

### Decision
- What changed: The system has been rebranded to **DilesZ AI** with a **Z-Rank Execution System** theme (Dragon Ball Z inspired).
- Why: To personalize the experience for the owner ("DilesZ") and gamify the execution process with a "Power Level" system.

### State
- Active track: `Influencer IA (Fanvue)`
- Active mission: Sprint de 7 días hacia la primera facturación.
- Revenue goal: 1 suscriptor de pago o 1 unlock de pago.
- UI State: Navegación libre entre días habilitada; Power Level dinámico (base 9,000) integrado.

### Risks
- Blockers: Browser local storage is still the primary state container; cross-device sync relies on manual file checkpoints.
- Assumptions: The owner will follow the "Revenue First" approach to trigger the first payment event by Day 7.

### Next
- Next concrete action: Complete Day 1 in the UI and begin generating the Master Face for Elena in Day 2.

## Update Template

Use this format when updating memory:

### Decision
- What changed:
- Why:

### State
- Active track:
- Active mission:
- Revenue goal:

### Risks
- Blockers:
- Assumptions:

### Next
- Next concrete action:
