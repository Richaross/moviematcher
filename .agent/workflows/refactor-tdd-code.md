---
description: Perform a second, constrained refactoring pass on the following codebase to refine design clarity, dependency boundaries, and testability, while strictly preserving all behavior, contracts, and structure introduced in the previous refactor.
---

Antigravity Refactoring Prompt — Iteration 2

Task
Perform a second, constrained refactoring pass on the following codebase to refine design clarity, dependency boundaries, and testability, while strictly preserving all behavior, contracts, and structure introduced in the previous refactor.

This is a design refinement pass, not a structural rewrite.

Preconditions

All tests are green.

The previous refactor is committed.

No behavioral changes are allowed.

Scope Constraints

Do NOT move or rename files or folders.

Do NOT change public APIs, store shapes, or component props.

Do NOT introduce new features, layers, or patterns.

Do NOT modify routing, auth, or external API contracts.

Primary Focus Areas

Make Dependencies Explicit

Reduce hidden coupling between UI, state, and data access.

Prefer explicit parameters over implicit imports where possible.

Improve Testability

Extract logic that is difficult to test into pure functions.

Reduce reliance on global state inside components.

Refine Abstractions (If Already Present)

Simplify existing interfaces and hooks.

Remove abstractions that add indirection without benefit.

Clarify Intent

Improve naming where intent is still ambiguous.

Reduce cognitive load without increasing indirection.

TDD Rules (Strict)

Tests define behavior; behavior must not change.

Existing tests must pass unmodified.

If test gaps are discovered, report them only.

Tech Stack Guardrails

Next.js App Router conventions must remain intact.

Client/Server component boundaries must not change.

Zustand stores must preserve public API and behavior.

Supabase and TMDB usage must remain identical.

Output Requirements

Provide only necessary refactored code.

Explain why each change improves design or testability.

Explicitly state why behavior remains unchanged.

Call out anything that should not be refactored further.

Goal
Reduce ambiguity and coupling while increasing confidence and test clarity — not to further “clean up” or redesign.