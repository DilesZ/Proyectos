# System

## Mission

Convert this project into an interactive, gamified guide that helps the owner reach first revenue with one business model before trying to sell the platform to others.

## Primary Outcome

The system is successful only if it helps the owner move from idea -> setup -> execution -> first revenue with evidence.

## Product Positioning

- This is not yet a SaaS for third parties.
- This is first a personal operating system for execution.
- The app must behave like a guided companion, not just a static dashboard.
- Every screen should answer: what do I do now, why does it matter, how do I validate it, what is the next step.

## Core Principles

1. One user first.
2. One business model at a time.
3. One concrete revenue milestone at a time.
4. Guidance beats feature count.
5. Checkpoints beat chat memory.
6. Proof beats motivation.
7. Resume from any PC/account with files only.

## Execution Mode

The system must support broken sessions and stateless recovery:

- The owner may return from a different PC.
- The owner may use a different account.
- Chat history cannot be trusted as durable memory.
- Therefore the repo must contain enough written state to resume work.

## Required UX Behavior

The product should progressively evolve toward:

- Guided onboarding by goal.
- Selection of a single active business track.
- Step-by-step execution with time estimates.
- A visible "current mission".
- Clear definition of done for each step.
- Evidence capture for each step.
- Gamified momentum: points, streaks, unlocks, progress bars.
- Revenue-first milestones instead of abstract completion.

## Decision Rules

When there is a tradeoff, prefer:

- simpler implementation over flexible architecture
- manual verification over premature automation
- local files over hidden memory
- revenue checkpoints over vanity metrics
- one strong track over many weak tracks

## First Version Scope

The first version should help the owner:

1. Choose the best initial business model.
2. Follow a guided execution path.
3. Record decisions, assets, blockers, and outcomes.
4. Track progress toward first revenue.
5. Resume work without prior chat context.

## Out of Scope For Now

- Multi-tenant SaaS complexity
- Advanced team collaboration
- Marketplace features
- Billing for external users
- Full automation of every workflow

## Session Startup Protocol

Any new assistant or future session should:

1. Read `system.md`
2. Read `memory.md`
3. Read `agets.md`
4. Read `skills.md`
5. Read `checkpoints/current.md`
6. Continue from the active mission only

## Session Shutdown Protocol

Before ending a meaningful work session:

1. Update `memory.md`
2. Update `checkpoints/current.md`
3. Create or append a dated checkpoint note if needed
4. Record next action in plain language
5. Record blockers and assumptions

## Edit Documentation Protocol

Every time any file is edited:

1. Document the edit in `checkpoints/edit_log.md`
2. Record date, file path, change summary, and reason
3. If the edit changes strategy or active work, also update `memory.md`
4. If the edit changes execution state, also update `checkpoints/current.md`
5. Assume any session may be the last available session on the current account
