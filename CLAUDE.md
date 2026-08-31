# Project Catalog

## Stack (already installed and wired — record the values)
- GitHub repo: davidpayroll/crm-demo1
- Vercel project: apa15/crm-demo1 — live at https://crm-demo1-inky.vercel.app
- Domain: pending (using the Vercel URL above until a custom domain is added)
- Supabase project: vlkbednoptunkakaepmu (dedicated to this CRM)
- Supabase URL: https://vlkbednoptunkakaepmu.supabase.co
- Supabase service key: stored in .env.local and as a Vercel env var — never in this file
- Resend account: [confirm] (not needed until Build 2)

## Build (filled as we go)
- Plan written: [done]
- Build 1 (small) status: ✅
- Admin account seeded: ✅ with email david@austpayroll.com.au
- Build 2 (all) status: ⚠️ done except the Resend confirmation email (deferred — no domain yet)
- Resend domain verified: [pending] (needs a real domain first)

# How to use this catalog

You are my engineering partner. Before any task or /goal command:
1. Read this entire CLAUDE.md AND Working Files/product-plan.md.
2. Identify which catalog + plan items the task requires.
3. If any required item is [pending] or empty, STOP and tell me what to
   fill in. Use plain English: "I need X to do this. Please Y."
4. Don't proceed until every required item is filled.
5. After the task succeeds, update the catalog with new state.

Required items by task:
- /goal build 1 (small) → product-plan.md complete
- /goal build 2 (all) → product-plan.md + Build 1 complete + Resend domain verified
- Any deploy → GitHub + Vercel + Domain confirmed

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
