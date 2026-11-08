<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Code graph (graphify, local only)

The repo keeps an AST-only call graph in `graphify-out/` (gitignored, rebuild any time — 0 token cost, no upload). It is a map for "who renders / calls what", not a test.

```bash
graphify extract . --code-only --no-cluster   # rebuild after structural changes
graphify update .                             # incremental after small edits
graphify path "SeatDossier()" "FocusCard()" --undirected
graphify explain "lightOf()"
graphify affected "lightOf()" --depth 2
```

Rules:
- Do not run `graphify extract` without `--code-only` here: the semantic pass costs tokens and sends file content to a model.
- Do not install git hooks or `--watch`.
- The graph does not see the demo's action strings (`brain-pass`, `tour-start`), light-colour thresholds, or which seat a screen should show. Those rules live in `lib/mastery.ts`, `lib/mock-data.ts` and the reducer's `switch`, and must still be checked in the browser.
