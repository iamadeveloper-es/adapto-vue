---
name: component-review
description: Runs a multi-agent quality review (TypeScript typing, props/API consistency, accessibility AA) of one adpt-* component or the whole library, and reports one consolidated result in chat with 0-10 scores per area.
disable-model-invocation: true
---

> **Scope:** Adapto UI-specific — depends on the adpt-* component convention.

# Component review orchestration

This skill launches four single-responsibility subagents to review adpt-* Vue components and presents one consolidated, scored report in chat. It's the reusable entry point for component quality review in this repo — usable today for 10 components and unchanged as the library grows to 30.

## 1. Resolve scope

- If the user named a component (e.g. `/component-review adpt-button`, `/component-review button`, or "review the dialog"), find its folder with Glob `src/lib/components/**/adpt-<name>`. Components live under a category subfolder (`element/`, `form/`, `navigation/`, `overlay/`, ...), so don't assume a fixed path — accept the name with or without the `adpt-` prefix. If it doesn't match anything, list the actual folders under `src/lib/components/*/` and ask the user which one they meant instead of guessing.
- If no component was named, the scope is **all components**: every `src/lib/components/**/adpt-*/` folder, found the same way.

## 2. Run the three analysis agents in parallel

Invoke these three agents — `component-review-types`, `component-review-props`, `component-review-a11y` — as **foreground** Agent calls, all three in a single message (so they run concurrently and you block until all three return). Give each one the exact same scope resolved in step 1:

- Single component: pass the concrete path, e.g. "Review `src/lib/components/element/adpt-button/index.vue`."
- Whole library: tell the agent "Review all components — enumerate `src/lib/components/**/adpt-*/index.vue` yourself," so the agent does its own discovery rather than you hardcoding a file list. This is what keeps the orchestration scalable: adding a new component (or category) folder requires no change here.

Each agent already knows its own checklist and output format (see `.claude/agents/adapto/component-review-*.md`) — don't restate their instructions, just give them the scope.

## 3. Compile the report

Once all three analyses return, invoke `component-review-report` (foreground, single call) with a prompt containing:
- The scope that was reviewed (component name(s)).
- The three raw reports, verbatim, labeled by which agent produced each.

Pass the reports through unedited — the agent applies a fixed deduction rubric to score each area 0-10, so filtering or rewording findings on the way in silently changes the scores. It has no file-reading tools and cannot recover anything you leave out.

## 4. Present the result

Relay the reporting agent's output to the user as your answer — including its 0-10 scores per area and its per-area improvement list. Don't re-summarize it, don't recompute or "sanity-check" its scores, don't add your own extra findings, and don't wrap it in additional commentary beyond a one-line intro.

## Scaling notes

- Default behavior is O(1) agent calls (4 total) no matter how many components exist, because each analysis agent enumerates and loops over its own file list internally.
- If the library grows large enough that a single whole-library pass starts producing shallow or truncated findings, shard the run instead: call the three analysis agents once per component (3× more calls, but each with a tighter, deeper scope) rather than once for everything. Only switch to this mode if you observe quality degrading — it's not the default.
- This skill and the four agents are the reusable orchestration prompt — no separate prompt file is needed. To run it from outside a slash-command context (e.g. pasted into a fresh session), use: "Run the component-review orchestration (see `.claude/skills/adapto/component-review/SKILL.md`) for `<component-name-or-'all components'>`."
