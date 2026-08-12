# UI redesign brief — Hamoc auth portal (FerrisKey fork)

Goal: redesign the **authentication pages** (login, OTP setup/challenge,
register, forgot/reset password, magic link, device verify) so they stop
looking generic/AI-generated. Keep them coherent with the Hamoc desk
(cool blue-grey neutrals, steel-blue accent, Inter, compact 6px radius),
but the visual direction beyond that is yours. Light AND dark must both
be designed — no naive inversion.

## Where things live (all under `front/`)

| Path | What it is |
|---|---|
| `src/App.css` | **The design tokens that actually win.** shadcn variables (`--primary`, `--background`, `--radius`, …) in `:root` + `.dark`. ⚠ `src/index.css` also defines tokens inside `@layer base` — those LOSE the cascade to App.css. Edit App.css, not index.css, or nothing changes. |
| `src/pages/authentication/ui/*.tsx` | Presentational components per view (`page-login.tsx`, `page-otp-*.tsx`, `page-register.tsx`, …). Markup + Tailwind classes — this is your main canvas. |
| `src/pages/authentication/ui/page-login.css` | Login-specific skin (card shape/shadow, `.login-shell`, `.login-card`, hides the crab logo + realm title). |
| `src/pages/authentication/feature/*.tsx` | Flow logic (hooks, submit, OAuth params). **Do not restructure** — see constraints. |
| `src/pages/authentication/components/` | Shared auth bits incl. `portal-layout-wrapper.tsx` (runtime portal-theme system; leave its mechanics alone). |
| `src/components/ui/` | shadcn primitives (button, input-text, card…). Restyling here propagates to the admin console too — fine, just be aware. |

Brand facts: wordmark is the word **Hamoc** (small caps, letterspaced),
NO logos. `page-login.tsx` is already rebranded; other auth pages still
render "FerrisKey" text/images — replace those too
(`grep -rn "FerrisKey\|logo_ferriskey" src/pages/authentication`).

## Hard constraints (break these and login breaks)

1. Do not rename/remove **form field names, input types, or button
   roles/handlers** in the auth pages — the OIDC flow and automated
   tests depend on them (`Username`/`Password` textboxes, `Login`
   button, OTP digit inputs).
2. Do not touch `feature/*.tsx` logic, `src/api/`, routing in
   `src/App.tsx`, or `portal-layout-wrapper.tsx` mechanics. Markup and
   classes in `ui/*.tsx` are fair game.
3. Keep the `?client_id=…&redirect_uri=…` login URL working — that's
   how apps arrive here.
4. Both themes ship: `.dark` class on root; toggle stored in
   `localStorage["ferriskey-ui-theme"]` (`"light"`/`"dark"`).
5. Error red stays reserved for errors.

## Preview loop (no backend knowledge needed)

A local stack recipe (Postgres in docker + API + vite) — from repo root:

```bash
docker start fk-pg 2>/dev/null || docker run -d --name fk-pg \
  -e POSTGRES_USER=ferriskey -e POSTGRES_PASSWORD=ferriskey \
  -e POSTGRES_DB=ferriskey -p 5433:5432 postgres:18.2
# migrations only needed on a fresh volume: apply core/migrations/*.up.sql in order
set -a; . api/.env; set +a; ./target/release/ferriskey-api &   # api on :3333
cd front && pnpm install && pnpm dev --host 127.0.0.1 --port 5173
```

Then open (the params matter — without them the SPA redirects away):

```
http://127.0.0.1:5173/realms/master/authentication/login?client_id=security-admin-console&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fadmin
```

Other views: trigger via the flow, or open their routes directly under
`/realms/master/authentication/…` (see `src/App.tsx` routes).

## Ship (humans do this part; the agent just needs `pnpm build` to pass)

Production build must be `VITE_API_URL=https://id.hamoc.rent pnpm build`
(the SPA bakes this env; a wrong value points prod at localhost). Deploy
is rsync of `dist/` to the server — leave that to us.
