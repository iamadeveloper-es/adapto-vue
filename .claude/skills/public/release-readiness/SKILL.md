---
name: release-readiness
description: Produces a read-only go/no-go checklist for one or more adpt-* components — code quality, unit test coverage, documentation, and theme token integrity — by reusing the component-review, component-docs, component-test-writer and core-tokens-review agents instead of re-auditing anything itself.
---

# Release readiness orchestration

This skill answers "is this component ready to ship?" by fanning out to the domain-specific
agents/skills that already own each concern, then handing their raw output to
`release-readiness-report` for a single consolidated checklist. It never audits anything itself.

**This is a read-only gate by default**: it reports gaps, it does not fill them. Running it must
never surprise the user with a wave of new commits — closing a gap it finds (missing tests,
stale docs) is a separate, explicit follow-up request.

## 1. Resolve scope

- If the user named a component, normalize it to its folder as in `component-review`.
- If no component was named, the scope is **all components**.

## 2. Run the checks in parallel

Invoke these as **foreground** Agent/skill calls in a single message, all against the resolved
scope, each explicitly instructed this is a **verification/audit pass only — do not create or
edit any files**:

- The `component-review` skill orchestration (quality: types, props, a11y — already
  consolidated by `component-review-report`, so its output is used as-is, not re-run agent by
  agent).
- `component-test-writer`, in audit mode: report which components lack `__tests__/index.spec.ts`
  coverage or whose tests look stale versus current props/emits — don't write any.
- The `component-docs` skill orchestration, in audit mode: report which components lack a
  `docs/components/adpt-*.md` page or whose page looks out of date — don't write any.
- `core-tokens-review` — always whole-theme scoped (it audits `Atlas.ts` as a unit, not
  per-component), so run it once regardless of how many components are in scope.

## 3. Compile the report

Invoke `release-readiness-report` (foreground, single call) with the scope and the four raw
outputs from step 2, labeled by source.

## 4. Present the result

Relay the reporting agent's output as-is. If the checklist surfaces gaps the user wants closed,
say so and offer to run `component-test-writer` / `component-docs` for real (not in audit mode)
as a separate, explicit next step — don't do it automatically.

## Scaling notes

- Fixed number of calls per run (4 checks + 1 report) regardless of how many components are in
  scope, same shape as `component-review`.
- To run outside a slash-command context: "Run the release-readiness orchestration (see
  `.claude/skills/public/release-readiness/SKILL.md`) for `<component-name-or-'all components'>`."
