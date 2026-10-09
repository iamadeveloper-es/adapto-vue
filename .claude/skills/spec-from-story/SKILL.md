---
name: spec-from-story
description: Turns a user story into a refined spec through an interactive loop — fills in the blanks, lists every functional assumption made, then asks the user one question at a time (with a progress bar and 4 alternative assumptions + "Otra") about the assumptions they reject, and ends ready to write the spec, which includes BDD scenarios in Gherkin. Use when the user hands over a user story and wants to define a spec from it.
---

# Spec from user story

Interactive procedure to turn a user story into a spec the user agrees with. The loop ends when
every assumption is settled and you say you are ready to create the spec; the spec itself, with
its BDD scenarios, is written only when the user asks for it (step 5).

Talk to the user in their language (Spanish in this repo). The user-facing strings below are
given in Spanish for that reason.

## 0. Get the story

If the invocation carries no user story, ask for it and stop. Do not invent one.

## 1. Fill in the blanks

Read the story and complete everything it leaves unspecified so that a full spec could be written:
actor(s), goal and benefit, preconditions, main flow, alternative flows, business rules,
validations, error and empty states, permissions/roles, limits and quantities, messages shown to
the user, acceptance criteria, and what is out of scope.

Every gap you fill is an **assumption**. Classify each one:

- **Functional / non-technical** — anything about behavior, business rules, users, content,
  scope or acceptance criteria. These are the ones you show.
- **Technical** — implementation choices (data model, libraries, APIs, architecture). Keep them
  to yourself; do not list them.

Ground the assumptions in the codebase when it is relevant (existing components, conventions,
terminology), but do not ask the user about things the code already answers.

## 2. Show the assumptions

Present one numbered list, numbering continuous across the whole list (never restart per group).
You may group by area with a short heading. Each item is one line: the assumption stated as a
concrete decision, not as a question.

```
**Asunciones funcionales**

_Flujo principal_
1. El usuario debe estar autenticado para acceder a la pantalla.
2. ...

_Reglas de negocio_
3. ...
```

Close with:

> Dime los números de las asunciones que no te convencen (p. ej. `2, 5, 7`), o `ninguna` si estás de acuerdo con todas.

Then stop and wait.

## 3. Ask about the rejected assumptions, one at a time

Parse the reply into a set of numbers (accept commas, spaces, ranges like `3-5`). If a number does
not exist in the list, say so and ask again. If the answer is `ninguna`, skip to step 4.

Ask about the rejected assumptions in ascending order, **one question per message**, and wait for
the answer before the next one. Each question has exactly this shape:

```
`[■■■□□□□□□□]` Pregunta 3 de 10 · quedan 7

**#5 — <short title of the assumption>**
Había asumido: <original assumption>.

<the question, open-ended and specific>

1. <alternative assumption>
2. <alternative assumption>
3. <alternative assumption>
4. <alternative assumption>
5. Otra — escríbeme tu propia definición
```

Rules for the question:

- The progress bar has 10 cells; filled cells = round(10 × current / total). Show
  "Pregunta N de T" where N is the question being asked now (1-based), plus how many remain after it
  (`T − N`).
- The 4 options are **new** assumptions: realistic, mutually distinct, and all different from the
  one the user rejected. Make them concrete decisions, not vague ranges.
- Option 5 is always "Otra". If the user picks it (or just types free text), take their text as
  the new definition. If it is ambiguous, ask one short follow-up before moving on — without
  advancing the progress bar.
- The user may answer with a number (`3`) or with text; both are valid.
- If an answer changes or contradicts another assumption (rejected or not), mention it in one line
  and, if that assumption was not already queued, append it to the queue and update the total.

After each answer, confirm the new definition in one line and go straight to the next question.

## 4. Finish

When there are no questions left, show a short summary of the assumptions that changed
(`#N: antes → ahora`), then say:

> Ya estoy listo para crear la especificación.

Do not write the spec until the user asks for it.

## 5. Write the spec (only when asked)

Write it in Markdown, in the user's language, with these sections:

1. Contexto y objetivo — the original story, actor, goal, benefit.
2. Alcance y fuera de alcance.
3. Flujo principal y flujos alternativos.
4. Reglas de negocio y validaciones.
5. Estados de error y vacíos, mensajes al usuario.
6. Escenarios BDD — see below.
7. Asunciones finales — same numbers as the list, marking the ones the user changed.
8. Notas técnicas — the technical assumptions kept out of the list, briefly and clearly separated.

### BDD scenarios

Express the acceptance criteria as Gherkin in a single ```` ```gherkin ```` block, so it can be
copied into a `.feature` file as-is:

- One `Feature:` named after the story, with the story itself (`Como… quiero… para…`) as its
  description. Write the keywords in the same language as the rest of the spec; for Spanish, start
  the block with `# language: es` and use `Característica`, `Antecedentes`, `Escenario`,
  `Esquema del escenario`, `Ejemplos`, `Dado`, `Cuando`, `Entonces`, `Y`, `Pero`.
- `Antecedentes` for preconditions shared by every scenario (e.g. the authenticated user).
- At least one scenario per flow (main and each alternative), per business rule and per
  error/empty state from sections 3–5. Nothing in those sections may be left without a scenario,
  and no scenario may introduce behavior that is not in them.
- `Esquema del escenario` + `Ejemplos` when the same rule is checked with several values (limits,
  validations, roles) instead of repeating near-identical scenarios.
- Steps describe behavior observable by the user, in domain language — no selectors, endpoints,
  or implementation details. One `Cuando` per scenario; exact user-facing messages in quotes.
- Tag each scenario with the assumption numbers it covers (`@A3 @A7`) so the user can trace every
  answer from step 3 to a scenario, plus `@happy-path`, `@alternativo` or `@error`.
