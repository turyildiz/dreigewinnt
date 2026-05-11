# Dreigewinnt

Dreigewinnt is a German-language hyperlocal platform for Raunheim, Kelsterbach, and Rüsselsheim: business directory, business profile posts, events, jobs, news/magazine, and admin moderation workflows.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
./node_modules/.bin/tsc --noEmit --incremental false
npm run build
```

If local `.next`/TypeScript build artifacts have permission issues, typecheck with `--incremental false` and verify production build in a clean temp copy.

## Environment

Copy `.env.example` to `.env.local` and fill values locally/inside the hosting provider. Never commit real secrets.

Required Supabase variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Cloudflare R2 media variables:

```bash
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=dreigewinnt-media
CLOUDFLARE_R2_PUBLIC_BASE_URL=https://images.dreigewinnt.com
```

When all R2 variables are configured, uploads through `src/lib/storage.ts` go to Cloudflare R2 and return public `images.dreigewinnt.com` URLs. If R2 is not configured, the helper falls back to the existing Supabase Storage path so local development does not break.

## Architecture direction

```text
Frontend: Next.js
Database/Auth/Admin: Supabase/PostgreSQL
Images/media: Cloudflare R2 via images.dreigewinnt.com
DNS/CDN/WAF: Cloudflare
Initial site hosting: Vercel unless changed later
Bots/background jobs: VPS/Workers depending on workload
```
