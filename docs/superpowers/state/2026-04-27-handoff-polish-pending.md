# Handoff State — Polish Phase Pending

**Written:** 2026-04-27
**Reason:** User taking a break before polish phase begins. Resume when ready.

---

## Project Snapshot

- **Repo:** v0-yikat-landing-page
- **Worktree:** `/Users/kaanevrensel/v0-yikat-landing-page/.worktrees/feat-landing-redesign-2`
- **Branch:** `feat/landing-redesign`
- **Last commit:** `59dec0f plan(polish): sequential dispatch plan for emil review findings`
- **Pushed:** Yes — `feat/landing-redesign` is up to date with `origin/feat/landing-redesign`
- **Working tree:** `next-env.d.ts` and `tsconfig.tsbuildinfo` modified (Next.js build artifacts — not tracked, not committed, safe to ignore)

---

## Master Plan Status

- **Plan:** `docs/superpowers/plans/2026-04-25-launch-plan.md`
- **Status:** 8/8 ✅ COMPLETE (closeout commit `880b116`)
- All 8 items shipped to `feat/landing-redesign` branch

---

## Polish Phase Status

- **Review document:** `docs/superpowers/notes/2026-04-27-emil-review.md` (commit `34286d5`)
- **Polish plan:** `docs/superpowers/plans/2026-04-27-polish-phase.md` (commit `59dec0f`)
- **Total findings:** 11 (3 Critical, 4 Important, 4 Minor)
- **Compressed to:** 8 dispatch events (2 bundles: Tasks 3+4 share commit, Tasks 9+10+11 share commit)
- **READY:** 10 tasks
- **BLOCKED:** 1 task (Task 2 — C1 Reviews placeholder)

---

## Task 2 Blocker (must resolve before Task 2 dispatches)

User selected **Option C: real customer reviews**. User will supply 3 reviews in this format before Task 2 can run:

- Text (verbatim from customer)
- Name (full or "Firstname L." per KVKK)
- Star rating 1–5
- Source (WhatsApp / Google Maps / Instagram — optional metadata)

User is gathering these from WhatsApp Business, Google Maps reviews, and Instagram DMs. KVKK consideration: full names require customer consent; initials are legally safer fallback.

---

## Sequencing (per polish plan)

| # | Task | Finding | Status | Notes |
|---|------|---------|--------|-------|
| 1 | C2 — WashingMachine RM opacity | Critical (Bug) | READY | ~1 LOC, `WashingMachine.tsx:25` |
| 2 | C1 — Reviews real customer quotes | Critical | BLOCKED | Waiting on user content |
| 3+4 | C3 + I4 bundle — CTA transition-all + loader ease-in | Critical + Important | READY | Single commit, two files |
| 5 | I1 — Hero ChevronDown bounce | Important | READY | CSS float keyframe |
| 6 | I2 — SectionEyebrow knob indicator | Important | READY | SVG `<rect>` pointer |
| 7 | I3 — FAQ accordion hover | Important | READY | `hover:bg-[#F5F5F2]` on trigger |
| 8 | M4 — Hamburger icon transition | Minor | READY | Framer `motion.span` with `key` |
| 9+10+11 | M1 + M2 + M3 bundle — footer casing, pricing mt, step colors | Minor | READY | Single commit, three 1-line tweaks |

---

## Workflow Contract for Polish Phase

- One task at a time, sequential
- Each task: separate dispatch (or bundled per plan) → implementer commit → reviewer pass → browser test
- User says "next" between tasks
- **All implementer + reviewer work on Opus 4.7 — NEVER Haiku 4.5, NEVER Sonnet for code changes**
- Brainstorm/visual companion summaries to user **in Turkish** (standing preference)
- Plan files, commit messages, reviewer reports stay English

---

## Strengths to Preserve (from Emil review — do not regress during polish)

- **Knob morph** — geometry, timing, RM handling untouched
- **Label ring depth** — piecewise opacity + scale unchanged
- **Fiyat display typography** — `10rem` desktop price, no pulling back
- **One Beat section enter rhythm** — container 380ms → 220ms delay → children 500ms stagger

---

## Polish Backlog Still Open After This Phase

- **Navbar glass presence tuning** — logged at commit `28ce1d7`. Glass reads faint over white hero; fixed 40px threshold fires before knob crosses nav. Deferred during master plan. Decide whether to fold into polish phase or revisit after.

---

## Resume Actions

User returns from break. Most likely first messages:

**1. "Dispatch task 1"**
→ Task 1 prompt is already drafted in polish plan (`docs/superpowers/plans/2026-04-27-polish-phase.md` § Task 1). Dispatch C2 RM opacity fix. After landing, await user browser test.

**2. "Here are the reviews: [content]"**
→ User has gathered Yorumlar content. Save it in the chat, then dispatch Task 2.

**3. "Dispatch task 1 and I'll gather reviews in parallel"**
→ Task 1 dispatches now while user still gathers Task 2 content. Proceed; Task 2 stays blocked until content arrives.

**4. Anything else**
→ Ask before acting. Do NOT auto-advance to any task.

---

## Standing Rules on Resume

- Do **NOT** start Task 1 autonomously — wait for explicit "dispatch task 1"
- Do **NOT** skip the user content collection step for Task 2
- Do **NOT** bundle differently than the plan specifies
- Do **NOT** proceed to next task without user browser test confirmation
- Do **NOT** touch component files until dispatch is explicit
