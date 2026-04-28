# YIKAT Landing — Claude Code Instructions

## Project
- Next.js 14+ App Router, Tailwind, framer-motion v11, TypeScript
- Active branch: feat/landing-redesign
- Worktree: .worktrees/feat-landing-redesign-2
- Brand color #2798ff is locked content

## Model
All roles run on Opus 4.7. No Sonnet, no Haiku, ever. Persistent default lives in `.claude/settings.local.json`. If a session somehow starts on another model, switch via `/model` before any other action.

State the model used in every final report.

## Workflow contract — every code-changing task

Required pipeline:
1. Implementer (Opus 4.7) writes the change
2. Spec reviewer + code quality reviewer (both Opus 4.7) run in parallel after implementer commits
3. Important findings inline-committed by reviewers
4. Final report in English, structured
5. STOP — wait for user "next" before next task

This pipeline is non-negotiable for any task that modifies code. Markdown-only commits skip reviewers.

## Skill engagement — fire-when-condition rules

Engage automatically when the condition is met. Load silently — never narrate skill activation to the user.

| Condition | Skill |
|---|---|
| Designing or comparing 2+ approaches before implementation | superpowers:brainstorming |
| Writing or updating a plan file | superpowers:writing-plans |
| Dispatching implementer + reviewers in parallel | superpowers:dispatching-parallel-agents + superpowers:subagent-driven-development |
| Asking another agent for review | superpowers:requesting-code-review |
| Processing a review's findings | superpowers:receiving-code-review |
| Before declaring a task complete | superpowers:verification-before-completion |
| Closing a branch / merge readiness | superpowers:finishing-a-development-branch |
| Any worktree operation | superpowers:using-git-worktrees |
| Investigating a bug | superpowers:systematic-debugging |
| Designing test coverage | superpowers:test-driven-development |
| Discovering relevant skills | superpowers:using-superpowers + find-skills |
| Creating or editing a skill | superpowers:writing-skills |
| Any UI / typography / motion / component aesthetic decision | emil-design-eng (mandatory, not advisory) |

If two skills' conditions both fire, run both. Parallel skill engagement is normal, not exceptional.

## Stop discipline
- After every task: STOP. Never auto-advance.
- "next" from user is the only signal to begin the next task in an active plan.
- "dispatch task N" begins task N from the active plan.
- "mola" / "break" triggers handoff state file write before close.
- Ambiguous instruction: ASK, do not act.

## Language
- Brainstorm summaries to user: Turkish
- Visual companion explanations to user: Turkish
- Plan files, commit messages, reviewer reports, final reports, code, comments: English
- Site UI copy: Turkish (production language)

## Content fidelity locks
Two items require explicit user approval before any edit:
- KVKK page text (app/kvkk/page.tsx) — legal document, verbatim
- Brand color #2798ff — no substitutions, no "improvements"

Other content (reviews, hero copy, pricing) follows standard task workflow.

## Standing rules
- Never `git revert`. Hand-edit for cleaner history when reverting decisions.
- Never run `pnpm build` without explicit user instruction.
- Never trigger deployment.
- Never invent placeholder content (legal, reviews, prices).
- Never introduce new dependencies without surfacing the addition first.
- Never modify plan files, review docs, or audit notes without explicit user approval.

## Session start protocol
1. Confirm Opus 4.7
2. Read this file
3. Read most recent file in `docs/superpowers/state/` (handoff state)
4. Verify branch + worktree + clean tree
5. Report environment status before any task

## File conventions
- Plans: `docs/superpowers/plans/<YYYY-MM-DD>-<slug>.md`
- Notes (audits, reviews, inventories): `docs/superpowers/notes/<YYYY-MM-DD>-<slug>.md`
- Handoff state: `docs/superpowers/state/<YYYY-MM-DD>-handoff-<context>.md`
