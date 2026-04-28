# YIKAT Landing — Project Conventions for Claude

This is the YIKAT landing page redesign (`feat/landing-redesign` branch). Worktree-based development from `.worktrees/feat-landing-redesign-2`. The page is shipped to production at yikat.tech.

**Stack:** Next.js 15 App Router, React 19, Tailwind v4, framer-motion v11, lucide-react, TypeScript.

**Read on session start:**
- `docs/superpowers/notes/2026-04-27-emil-review.md` — design quality bar, strengths to preserve, resolutions
- `docs/superpowers/plans/2026-04-27-polish-phase.md` — current task sequencing
- `MEMORY.md` (auto-loaded from `~/.claude/projects/-Users-kaanevrensel-v0-yikat-landing-page/memory/`) — workflow patterns and gotchas

---

## Model rules — non-negotiable

- **Implementer agents: Opus 4.7 ALWAYS.**
- **Spec reviewer agents: Opus 4.7 ALWAYS.**
- **Code quality reviewer agents: Opus 4.7 ALWAYS.**
- **Orchestrator (planning, summarizing, routing, plan file authoring): Opus 4.7 ALWAYS.**
- **NEVER Haiku 4.5** for any role.
- **NEVER Sonnet (any version)** for any role.
- **Surface the model used in every final report** so the user can verify compliance at a glance.

When dispatching via `Agent` tool, always include `model: "opus"` for every subagent. If a dispatch prompt does not specify, default to Opus 4.7.

**Rationale:** Sonnet was acceptable for non-code orchestration in earlier drafts. Reverted: orchestrator decisions (plan structure, math verification, candidate scoring) directly steer implementer behavior. Quality of plans determines quality of code that follows. Opus across all roles, no exceptions.

---

## Skills — when to engage

Each task type has a mandatory skill. Invoke the skill via the `Skill` tool BEFORE taking action.

| Task type | Skill |
|---|---|
| Brainstorming approaches, comparing candidates | `superpowers:brainstorming` |
| Writing/updating a plan or dispatch sequence | `superpowers:writing-plans` |
| Spawning ≥2 parallel agents | `superpowers:dispatching-parallel-agents` |
| Implementer + reviewer pipeline | `superpowers:subagent-driven-development` |
| Dispatching a code review agent | `superpowers:requesting-code-review` |
| Incorporating reviewer findings | `superpowers:receiving-code-review` |
| Pre-completion verification (before declaring task done) | `superpowers:verification-before-completion` |
| Closing out the feature branch for merge | `superpowers:finishing-a-development-branch` |
| Worktree management (creating, syncing, cleaning) | `superpowers:using-git-worktrees` |
| Bug investigation | `superpowers:systematic-debugging` |
| Writing tests / refactoring with safety net | `superpowers:test-driven-development` |
| Creating/editing skill files | `superpowers:writing-skills` |
| Discovering whether a skill exists for a task | `find-skills` |
| **Any design/UI/motion/spacing/color/animation decision** | **`emil-design-eng`** |

If a task spans multiple categories, engage all applicable skills sequentially.

The `emil-design-eng` skill is mandatory for: any new component, any animation parameter change, any color/spacing/typography decision, any review of UI work (REVIEW MODE).

---

## Workflow contract — sequential dispatch pattern

This is the pattern used throughout the polish phase and master plan execution.

1. **Read the task block from the active plan** (e.g., `docs/superpowers/plans/2026-04-27-polish-phase.md`).
2. **Read the affected source files** before dispatching the implementer.
3. **Dispatch ONE Opus 4.7 implementer agent** with: exact spec, file paths, before/after code blocks, commit message, "do not push" instruction.
4. **After implementer commits, dispatch TWO Opus 4.7 reviewer agents IN PARALLEL** in a single message with two `Agent` tool calls:
   - Spec reviewer — verifies the implementation matches the spec line-by-line
   - Code quality reviewer — checks for orphan code, type cleanliness, no scope creep
5. **If reviewers flag Important findings, fix inline via Edit tool, then commit** with a follow-up commit (`fix(<scope>): <description>`). Do not re-dispatch the implementer.
6. **Push to `origin/feat/landing-redesign`** only after reviewers approve and inline fixes are committed.
7. **Deliver structured report** in English with: model used, files changed, reviewer outcomes, commit SHA(s).
8. **Add Turkish summary line** at the end with: what to test in browser + next task name.
9. **STOP.** Wait for user to type `next`. Do NOT auto-advance.

---

## Language

- **Brainstorm summaries, visual companion content, end-of-task user-facing summaries:** Turkish
- **All durable artifacts (plan files, notes, specs, state files, commit messages, reviewer reports, code comments):** English
- **Code identifiers (variable names, function names):** English
- **User-facing copy in the product itself:** Turkish (verbatim, content fidelity locked)

---

## Content fidelity — do not paraphrase

- **KVKK page text** (`app/kvkk/page.tsx`): all 9 maddeler verbatim. No edits to Turkish legal text. Verbatim source: production yikat.tech/kvkk.
- **Mesafeli Satış Sözleşmesi** (`app/mesafeli-satis-sozlesmesi/page.tsx`): same lock.
- **Customer reviews** (`components/sections/ReviewsSection.tsx`): verbatim quotes including Turkish diacritics (ğ, ş, ı, ü, ç, ö). Author names per KVKK ("Firstname L." format).
- **FAQ schema** (`app/layout.tsx` FAQPage structured data): if you change FAQ question text in `components/sections/FAQSection.tsx`, update the schema in `app/layout.tsx` to match. Google penalises schema/content drift.
- **Brand color:** `#2798ff` is the only blue. Hover variant: `#1a7de8`. No other blues.
- **Brand name casing:** Always `YIKAT` (all caps). Never `Yıkat`, `yikat`, etc.

---

## Don't (durable rules — do not relitigate)

- **Don't auto-advance** between tasks. After each task report, STOP and wait for user `next`.
- **Don't narrate skill loads** ("I'll use the X skill to..."). Just engage them.
- **Don't `git revert` design changes.** Hand-edit the affected files for clean history.
- **Don't run `pnpm build` / `npm run build` without instruction.** Build is the user's call.
- **Don't deploy** (push to production, run deploy scripts, hit Vercel) without explicit instruction.
- **Don't use `git add -A` or `git add .`** — stage by file name to avoid pulling in `next-env.d.ts` and `tsconfig.tsbuildinfo` build artifacts.
- **Don't skip pre-commit hooks** (`--no-verify`). Fix the underlying issue.
- **Don't add `// removed X` comments or unused re-exports** when deleting code. If unused, delete completely.
- **Don't use `transition-all`.** Specify exact properties (`transition-[box-shadow,transform]` etc).
- **Don't animate from `scale(0)`.** Start from `scale(0.95)` minimum.
- **Don't use ease-in for UI exits.** Always ease-out (`[0.23, 1, 0.32, 1]` or `[0.16, 1, 0.3, 1]`).
- **Don't touch the knob morph geometry, label ring depth, fiyat 10rem typography, or One Beat 380→220→500ms rhythm** — these are validated and locked. See `docs/superpowers/notes/2026-04-27-emil-review.md` § Strengths to preserve.

---

## File locations

- **Plans:** `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`
- **Notes (reviews, audits, postmortems):** `docs/superpowers/notes/YYYY-MM-DD-<topic>.md`
- **State (handoffs between sessions):** `docs/superpowers/state/YYYY-MM-DD-<topic>.md`
- **Specs (design docs from brainstorming):** `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
- **Skills (user):** `~/.claude/skills/<skill-name>/SKILL.md`
- **Auto-memory:** `~/.claude/projects/-Users-kaanevrensel-v0-yikat-landing-page/memory/`

Always use absolute dates (`2026-04-28`), never relative (`today`, `yesterday`).

---

## Strengths to preserve — do not regress

These design decisions have been validated by the Emil review (commit `34286d5`). Touching them requires explicit user approval.

- **Knob morph** — geometry, timing, RM handling
- **Label ring depth-of-field** — piecewise opacity (1.0→0.55→0) and scale (1.0→0.78), 3-label window
- **Fiyat display typography** — `10rem` desktop price, no pulling back
- **One Beat choreography** — container 380ms → 220ms `delayChildren` → children 500ms `staggerChildren`
- **`active:scale-[0.97]` on CTA buttons** — both nav and hero CTA
- **Background rhythm** — `#FAFAF7` → `#F5F5F2` → `#FAFAF7` (pricing section break)
- **SectionEyebrow format** — number · label rule with `max-w-[240px]` cap
- **Glass navbar blur** — always-on `backdropFilter`, only background/border/shadow transitions

---

## Maintenance

- **Created:** 2026-04-28 (audit at `docs/superpowers/notes/2026-04-28-claude-md-audit.md`, commit `b3bef51`)
- **Source rules:** Distilled from 37+ tasks of polish phase + master plan execution; Emil review at commit `34286d5`; KVKK plan at commit `43f46bf`.
- **Update triggers:** End of each major phase (master plan close, polish phase close), when a "Strengths to preserve" item is intentionally redesigned, when a new content fidelity lock is added, when a workflow rule changes.
