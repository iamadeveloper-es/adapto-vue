---
name: component-docs
description: Generates or updates VitePress documentation for one adpt-* component or the whole library, grounded in a factual component-api-extractor spec, sharded one writer per component, and verified with a real docs build. Reusable entry point for documentation authoring in this repo.
disable-model-invocation: true
---

> **Scope:** Adapto UI-specific — depends on the adpt-* component convention and this repo's VitePress setup.

# Component docs orchestration

This skill produces accurate, consistent VitePress documentation pages by first extracting each
component's **factual API surface**, then handing that spec to a writer per component, then
verifying the result actually builds.

The grounding step is deliberately an *extraction*, not a *review*: doc pages need props, types,
defaults, emit payloads and slots — not audit findings. Review agents (`component-review-props`,
`component-review-a11y`) belong to the `component-review` orchestration and are not used here;
their output is evaluative, and folding severity language into user-facing docs is a bug, not a
feature.

## 1. Resolve scope

- If the user named a component (e.g. `/component-docs adpt-dialog`, "document the tooltip"),
  find its folder with Glob `src/lib/components/**/adpt-<name>` — components live under a
  category subfolder (`element/`, `form/`, `navigation/`, `overlay/`, ...), so don't assume a
  fixed path. Accept the name with or without the `adpt-` prefix. Verify the folder exists
  before proceeding.
- If no component was named, the scope is **all components**: every
  `src/lib/components/**/adpt-*/` folder, found the same way. Resolve the concrete list now —
  you need it to shard step 3.

## 2. Extract the API spec

Invoke `component-api-extractor` (foreground, **one call** for the whole scope) — it's read-only
and its output is a compact data sheet, so a single call scales fine across the library.

Pass it the resolved scope: concrete paths, or "all components — enumerate
`src/lib/components/**/adpt-*/index.vue` yourself".

Its per-component spec blocks are the grounding for step 3. Pass them through verbatim; don't
summarize or reformat them.

## 3. Write the documentation — one writer per component

Invoke `component-docs-writer` (foreground) **once per component in scope**, launching them in
parallel in a single message. Give each call:

- Its one component path.
- That component's spec block from step 2, verbatim.
- For multi-component runs only: "The orchestrator owns the shared files — do not edit
  `docs/.vitepress/config.ts` or `theme/index.ts`; report `Registrations needed` instead."

Sharding is deliberate. Doc pages in this repo run 150-270 lines each; a single writer asked to
produce the whole library in one context degrades or truncates. Read-only agents can safely fan
out internally — a generative writer cannot.

If the scope is more than ~6 components, run them in parallel batches of 4-5 rather than all at
once, so a failure is easy to attribute and retry.

**Single-component runs**: skip the shared-file instruction — with no concurrency there's no
race, and the writer handles its own `config.ts`/`theme/index.ts` registration.

## 4. Apply shared-file registrations (multi-component runs only)

Collect the `Registrations needed` sections from every writer and apply them yourself, in one
pass each, with Edit:

- Append the new entries to the `sidebar` (and `nav` if relevant) array in
  `docs/.vitepress/config.ts`.
- Add any missing `app.component(...)` registrations — plus their imports — to
  `docs/.vitepress/theme/index.ts`.

Additive only: never remove or reorder existing entries. Deduplicate before writing — several
components may need the same child registration (e.g. `AdaptoIcon`).

## 5. Verify the build

Run `pnpm docs:build` (Bash). If it fails, first check whether the cause is a missing
registration you own from step 4 and fix it directly. Otherwise pass the error output back to the
relevant `component-docs-writer` once to fix and retry. If it still fails, report the failure to
the user instead of retrying again.

## 6. Present the result

Report to the user (in Spanish): which page(s) were created/updated, any `config.ts`/theme
registration changes made, and the final build status. Don't wrap it in extra commentary.

## Audit mode

When the user asks what's missing or stale rather than for a rewrite ("¿qué docs faltan?"), run
steps 1-2 normally, then invoke the writers with "verification/audit pass only — do not create or
edit any files". Skip steps 4 and 5 entirely: nothing was written, so there's nothing to register
or build. Report per component: missing page / out of date (with the specific props/emits/slots
that differ) / up to date.

Note that `release-readiness` does **not** call this mode — it runs `component-api-extractor`
itself and compares against the doc pages, to keep its fan-out flat.

## Scaling notes

- Cost shape is `1 + N` agent calls for N components: one cheap read-only extraction (Haiku),
  plus one writer per component (Sonnet). The extractor stays O(1); only the generative step
  scales, which is where context budget actually matters.
- To run outside a slash-command context: "Run the component-docs orchestration (see
  `.claude/skills/adapto/component-docs/SKILL.md`) for `<component-name-or-'all components'>`."
