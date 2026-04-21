# YIKAT Project Rules (Permanent)

These rules apply to ALL Superpowers sessions on this repository — planning, execution, brainstorming, polish phases, future iterations. Any plan document created for this project must reference and respect these rules.

## Model Tier Policy

- **PRIMARY:** Opus 4.7 for all code-writing subagents (implementer, spec compliance reviewer, code quality reviewer, and any future review stages)
- **FALLBACK:** Sonnet 4.6 only when Opus is unavailable OR when the user explicitly approves a downgrade for a specific task
- **NEVER:** Haiku 4.5 — do not use Haiku for ANY task on this project, regardless of whether it appears mechanical
- This policy OVERRIDES any per-task model hints in plan documents
- The controller must ASK before any downgrade and receive explicit user approval
- When dispatching a subagent, announce which tier is being used

## How to apply

- At the start of every session (planning or execution), the controller reads this file first
- Plan documents created for this repo must include a reference line: "Model tier: see docs/superpowers/project-rules.md"
- If a user request seems to conflict with these rules, the controller stops and asks for clarification
