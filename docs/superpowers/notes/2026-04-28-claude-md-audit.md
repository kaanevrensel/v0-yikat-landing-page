# CLAUDE.md Audit — Gap Analysis Against Emil + Superpowers Requirements

**Date:** 2026-04-28
**Model:** Opus 4.7
**Worktree:** `/Users/kaanevrensel/v0-yikat-landing-page/.worktrees/feat-landing-redesign-2`
**Branch:** `feat/landing-redesign`

---

## Section 1 — Current CLAUDE.md Status

**Status: MISSING**

Glob and direct stat both confirm:
- No `CLAUDE.md` at worktree root (`/Users/kaanevrensel/v0-yikat-landing-page/.worktrees/feat-landing-redesign-2/CLAUDE.md`)
- No `CLAUDE.md` at main repo root (`/Users/kaanevrensel/v0-yikat-landing-page/CLAUDE.md`)
- No `.claude/` directory inside the project
- No `CLAUDE.md` anywhere in the worktree tree (recursive glob returned 0 hits)
- No `CLAUDE.md` anywhere in the main repo tree (recursive glob returned 0 hits)

The project relies entirely on:
- Auto-memory at `~/.claude/projects/-Users-kaanevrensel-v0-yikat-landing-page/memory/MEMORY.md` (3 entries: subagent workflow, branch state, framer-motion gotcha)
- User-provided instructions in each `/dispatch` prompt
- Skill auto-loading at session start (using-superpowers system reminder)

This means EVERY session starts cold on project conventions. The dispatcher patterns, model rules, language preferences, and content fidelity locks have to be re-stated by the user in each prompt. That works (it's been working for 37+ tasks) but it's costly: each prompt is ~30–80 lines of repeated boilerplate, and the rules drift if the user forgets one in a given prompt.

---

## Section 2 — Skills Inventory

### Currently loaded (visible in active session)
- **superpowers:using-superpowers** — auto-loaded via SessionStart hook (full content embedded in system reminder)
- **superpowers:brainstorming** — invoked earlier this session, content present
- **emil-design-eng** (user skill) — invoked earlier this session, content present

### Available but not currently engaged
Per the user's stated inventory:
- superpowers:dispatching-parallel-agents
- superpowers:executing-plans
- superpowers:finishing-a-development-branch
- superpowers:receiving-code-review
- superpowers:requesting-code-review
- superpowers:subagent-driven-development
- superpowers:systematic-debugging
- superpowers:test-driven-development
- superpowers:using-git-worktrees
- superpowers:verification-before-completion
- superpowers:writing-plans
- superpowers:writing-skills
- find-skills (user skill)

### Loaded vs available
- **Loaded:** 3 (using-superpowers, brainstorming, emil-design-eng)
- **Available, not loaded:** 13 (the rest)

The available skills are reachable via the `Skill` tool but Claude does not auto-engage them — they must be explicitly invoked when their domain applies. The using-superpowers skill itself enforces "if 1% chance a skill applies, invoke it." But without a CLAUDE.md mapping task types → skill names, that 1% gate is being judged ad-hoc per-prompt.

---

## Section 3 — Gap Analysis

### Requirement 1: "Emil Kowalski felsefesine uygun çalışmalı"

| Sub-requirement | Status | Notes |
|---|---|---|
| Instruct Claude to engage `emil-design-eng` skill for design/UI/motion decisions | **MISSING** | No CLAUDE.md exists; skill engagement currently relies on user typing `/emil-design-eng` |
| State when `emil-design-eng` is mandatory vs optional | **MISSING** | No documented trigger conditions |
| Preserve "strengths to preserve" from `docs/superpowers/notes/2026-04-27-emil-review.md` | **PARTIAL** | The review document captures these (knob morph, label ring depth-of-field, fiyat 10rem typography, One Beat 380→220→500ms rhythm, active:scale-[0.97], background rhythm, SectionEyebrow format, glass navbar blur). The list exists in the notes file but is not surfaced as durable rules — every dispatch reminds Claude not to regress, but a future Claude starting fresh has to discover the review file by chance |

### Requirement 2: "Superpowers'ın her skillini kullanmalı"

| Skill | Mapped to task type? | Status |
|---|---|---|
| writing-plans | Should engage when: writing/updating dispatch plans, polish phase, master plans | **MISSING** |
| brainstorming | Should engage when: NEW project requests with multiple approaches; required gate before EnterPlanMode | **MISSING** |
| dispatching-parallel-agents | Should engage when: spawning ≥2 parallel agents (e.g., spec + code-quality reviewers in parallel) | **MISSING** |
| subagent-driven-development | Should engage when: implementer + reviewer pipeline (this entire polish phase!) | **MISSING** |
| requesting-code-review | Should engage when: dispatching reviewer agents | **MISSING** |
| receiving-code-review | Should engage when: incorporating reviewer findings, especially Important inline-fixes | **MISSING** |
| verification-before-completion | Should engage when: declaring task done before user browser test | **MISSING** |
| finishing-a-development-branch | Should engage when: closing out `feat/landing-redesign` for merge | **MISSING** |
| using-git-worktrees | Should engage when: managing the `.worktrees/feat-landing-redesign-2` workflow | **MISSING** |
| systematic-debugging | Should engage when: investigating bugs (e.g., hero blank under RM, navbar glass timing) | **MISSING** |
| test-driven-development | Should engage when: writing tests, refactoring with safety net | **MISSING (low relevance — this project has no test suite)** |
| writing-skills | Should engage when: creating/editing skill files | **MISSING** |
| using-superpowers | Auto-loaded each session | **PRESENT (system-level)** |
| find-skills | Should engage when: user asks "is there a skill for X?" | **MISSING** |

**Net:** 13 of 14 superpowers skills have no CLAUDE.md trigger documentation. Engagement is currently driven by the user typing the skill name in each prompt, not by Claude auto-invoking when the task matches.

### Requirement 3: Project-specific rules from this redesign

| Rule | Status | Notes |
|---|---|---|
| Model rule: Opus 4.7 always for code; Haiku NEVER; Sonnet for orchestration only | **MISSING** | Captured in MEMORY.md as part of `feedback_subagent_workflow.md`, but not at the session-load level |
| Workflow contract: implementer → parallel reviewers → Important findings inline-committed → English report → STOP between tasks | **MISSING** | Same — in MEMORY.md, but each dispatch still re-states it |
| Language: brainstorm/visual-companion summaries in Turkish, all artifacts (plans, notes, commit messages, reviewer reports) in English | **MISSING** | This rule has been honored consistently but is not codified outside conversation history |
| Content fidelity locks: KVKK page text verbatim, customer reviews verbatim including Turkish diacritics, brand color `#2798ff` | **MISSING** | KVKK lock noted in `docs/superpowers/plans/2026-04-27-kvkk-page.md` resolution; reviews lock implicit in Task 2 spec; brand color implicit |
| Standing don'ts: no auto-advance between tasks, no narrated skill loads, no `git revert` for design reverts (hand-edit instead), no `pnpm build` without instruction, no deployment without instruction | **MISSING** | The `git revert` rule was a Task 5 revert decision, not a standing rule until now — but the pattern (clean history > noisy revert commits) is worth codifying. The "no auto-advance" and "no skill load narration" are observed but undocumented |
| File location conventions: plans → `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`, notes → `docs/superpowers/notes/YYYY-MM-DD-<topic>.md`, state → `docs/superpowers/state/YYYY-MM-DD-<topic>.md`, specs → `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` | **MISSING** | Convention is followed consistently in the file tree but not documented as a rule |

**Summary counts:**
- **MISSING:** 17 (everything in this section, plus most of section 1 + 2)
- **PARTIAL:** 1 (strengths-to-preserve exists in a notes file but not surfaced as session rule)
- **PRESENT:** 1 (using-superpowers auto-loads)

---

## Section 4 — Proposed Additions (Concrete Text Blocks)

The following blocks are organized as a draft CLAUDE.md ready to paste. Each block is independent — user can accept some and reject others.

### Block A: Header + project orientation

```markdown
# YIKAT Landing — Project Conventions for Claude

This is the YIKAT landing page redesign (`feat/landing-redesign` branch). Worktree-based development from `.worktrees/feat-landing-redesign-2`. The page is shipped to production at yikat.tech.

**Stack:** Next.js 15 App Router, React 19, Tailwind v4, framer-motion v11, lucide-react, TypeScript.

**Read on session start:**
- `docs/superpowers/notes/2026-04-27-emil-review.md` — design quality bar, strengths to preserve, resolutions
- `docs/superpowers/plans/2026-04-27-polish-phase.md` — current task sequencing
- `MEMORY.md` (auto-loaded) — workflow patterns and gotchas
```

### Block B: Model rules (rigid)

```markdown
## Model rules — non-negotiable

- **Implementer agents: Opus 4.7.** Never Haiku 4.5. Sonnet only with explicit user approval per dispatch.
- **Reviewer agents: Opus 4.7.** Same rule.
- **Orchestrator (top-level chat): Sonnet 4.6 default; Opus 4.7 when user invokes `/effort` or `/model`.**

When dispatching via `Agent` tool, always include `model: "opus"` for both implementer and reviewer subagents. If a dispatch prompt does not specify, default to Opus 4.7.
```

### Block C: Skill engagement matrix

```markdown
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
```

### Block D: Workflow contract (sequential dispatch)

```markdown
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
```

### Block E: Language preferences

```markdown
## Language

- **Brainstorm summaries, visual companion content, end-of-task user-facing summaries:** Turkish
- **All durable artifacts (plan files, notes, specs, state files, commit messages, reviewer reports, code comments):** English
- **Code identifiers (variable names, function names):** English
- **User-facing copy in the product itself:** Turkish (verbatim, content fidelity locked)
```

### Block F: Content fidelity locks

```markdown
## Content fidelity — do not paraphrase

- **KVKK page text** (`app/kvkk/page.tsx`): all 9 maddeler verbatim. No edits to Turkish legal text. Verbatim source: production yikat.tech/kvkk.
- **Mesafeli Satış Sözleşmesi** (`app/mesafeli-satis-sozlesmesi/page.tsx`): same lock.
- **Customer reviews** (`components/sections/ReviewsSection.tsx`): verbatim quotes including Turkish diacritics (ğ, ş, ı, ü, ç, ö). Author names per KVKK ("Firstname L." format).
- **FAQ schema** (`app/layout.tsx` FAQPage structured data): if you change FAQ question text in `components/sections/FAQSection.tsx`, update the schema in `app/layout.tsx` to match. Google penalises schema/content drift.
- **Brand color:** `#2798ff` is the only blue. Hover variant: `#1a7de8`. No other blues.
- **Brand name casing:** Always `YIKAT` (all caps). Never `Yıkat`, `yikat`, etc.
```

### Block G: Standing don'ts

```markdown
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
```

### Block H: File location conventions

```markdown
## File locations

- **Plans:** `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`
- **Notes (reviews, audits, postmortems):** `docs/superpowers/notes/YYYY-MM-DD-<topic>.md`
- **State (handoffs between sessions):** `docs/superpowers/state/YYYY-MM-DD-<topic>.md`
- **Specs (design docs from brainstorming):** `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
- **Skills (user):** `~/.claude/skills/<skill-name>/SKILL.md`
- **Auto-memory:** `~/.claude/projects/-Users-kaanevrensel-v0-yikat-landing-page/memory/`

Always use absolute dates (`2026-04-28`), never relative (`today`, `yesterday`).
```

### Block I: Strengths to preserve (Emil-validated)

```markdown
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
```

---

## Section 5 — Risk Note

Since CLAUDE.md does not exist, there is **no existing content to remove or supersede**. Adoption is purely additive.

**Risk if CLAUDE.md is added:**
- Some blocks (esp. Block G "Don't" list) overlap with rules already in `~/.claude/skills/emil-design-eng/SKILL.md` and the global system prompt. Repetition is intentional (project-level binding) but worth flagging — if the user later edits the emil skill or global prompt, they should remember to keep CLAUDE.md in sync.
- The strengths-to-preserve list (Block I) is a snapshot at commit `34286d5`. If subsequent design changes alter these (e.g., user explicitly redesigns the knob), CLAUDE.md must be updated or it becomes stale and will mislead future Claude.
- The skill engagement matrix (Block C) presumes the user keeps the superpowers plugin installed and named consistently. If the plugin is renamed or removed, CLAUDE.md instructions fail silently.

**Mitigations:**
- Add a `## Maintenance` block at the end of CLAUDE.md noting last-updated date and the commits that established each rule, so future audits can verify staleness.
- Treat CLAUDE.md as a living doc — update it at the end of each major phase (master plan close, polish phase close, etc.).

---

## Recommended adoption order (if user accepts the audit)

1. **Block B + Block G** first — model rules and don'ts are the highest-leverage gaps (single source of truth replaces 30+ lines of repeated dispatch boilerplate).
2. **Block D + Block C** next — workflow contract and skill matrix make the dispatch pattern self-documenting.
3. **Block F + Block I** — content/design locks prevent regressions.
4. **Block A + Block E + Block H** — orientation, language, file conventions (lower urgency, high clarity value).

Total estimated CLAUDE.md size if all blocks accepted: ~140 lines. Easily within the auto-loaded context budget.
