---
name: release-readiness
description: Produces a read-only go/no-go checklist for one or more adpt-* components — code quality, unit test coverage, documentation, and theme token integrity — by fanning out to the domain agents in audit mode instead of re-auditing anything itself.
disable-model-invocation: true
---

> **Scope:** Adapto UI-specific — depends on the adpt-* component convention and the Atlas token pipeline.

# Release readiness orchestration

This skill answers "is this component ready to ship?" by fanning out to the domain-specific
agents that already own each concern, then handing their raw output to
`release-readiness-report` for a single consolidated checklist. It never audits anything itself.

It calls the **agents** directly rather than reusing the `component-review` / `component-docs`
skill orchestrations. Invoking a skill expands its procedure into this context — it does not run
anything in isolation — so nesting those two here would serialize the run and pull in steps this
gate does not want (the intermediate `component-review-report` consolidation, and the docs
writers, whose output `release-readiness-report` aggregates anyway).

**This is a read-only gate by default**: it reports gaps, it does not fill them. Running it must
never surprise the user with a wave of new commits — closing a gap it finds (missing tests,
stale docs) is a separate, explicit follow-up request.

## 1. Resolve scope

- If the user named a component, normalize it to its folder as in `component-review`.
- If no component was named, the scope is **all components**.

## 2. Run the checks in parallel

Invoke these five agents as **foreground** Agent calls in a single message (so they run
concurrently and you block until all return), all against the resolved scope, each explicitly
instructed this is a **verification/audit pass only — do not create or edit any files**:

- `component-review-types`, `component-review-props`, `component-review-a11y` — the quality
  triad. Their raw findings go straight to step 3; do not consolidate them through
  `component-review-report` first, since `release-readiness-report` does its own aggregation and
  a double pass loses detail.
- `component-test-writer`, in audit mode: report which components lack `__tests__/index.spec.ts`
  coverage or whose tests look stale versus current props/emits — don't write any.
- `component-api-extractor` — one call for the whole scope. Ask it only for the factual API
  spec, which is its entire contract; it is descriptive and never evaluative, so do **not** ask
  it to judge whether a doc page is stale.
- `core-tokens-review` — always whole-theme scoped (it audits `Atlas.ts` as a unit, not
  per-component), so run it once regardless of how many components are in scope.

For a multi-component scope, tell each agent "enumerate `src/lib/components/**/adpt-*/index.vue`
yourself" rather than hardcoding a file list, so adding a component needs no change here.

## 2b. Derive the documentation gap yourself

The extractor gives you the real API; the docs check is a comparison, and you own it. Glob
`docs/components/adpt-*.md`, and for each component in scope report: **missing page** (no file),
**out of date** (the page's props/emits/slots tables disagree with the spec — name the specific
ones), or **up to date**.

This stays here rather than going to an agent because it's a diff between two things you already
have in context. Note it makes the docs signal cheaper but shallower than a `/component-docs`
audit run, which reads each page in full — that's the right trade for a go/no-go gate.

## 3. Compile the report

Invoke `release-readiness-report` (foreground, single call) with the scope, the five raw agent
outputs from step 2 and your docs-gap summary from 2b, labeled by source. Pass them through
verbatim — it has no file-reading tools and cannot recover anything you leave out.

## 4. Present the result

Relay the reporting agent's output as-is. If the checklist surfaces gaps the user wants closed,
say so and offer to run `component-test-writer` / `component-docs` for real (not in audit mode)
as a separate, explicit next step — don't do it automatically.

## Scaling notes

- Fixed number of calls per run (5 agents + 1 report; the docs comparison costs none) regardless
  of how many components are in scope: every check agent is read-only and enumerates its own file
  list internally, so nothing here shards per component. Same O(1) shape as `component-review`.
- To run outside a slash-command context: "Run the release-readiness orchestration (see
  `.claude/skills/release-readiness/SKILL.md`) for `<component-name-or-'all components'>`."
