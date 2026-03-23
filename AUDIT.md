# Template Audit — ShipFast (Next.js + Supabase + Stripe + DaisyUI)

## Template Identity
- **Name**: ShipFast (`ship-fast-code`)
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **CSS**: Tailwind CSS v4 (CSS-based config in `globals.css`), DaisyUI v5
- **Theme**: Light mode (DaisyUI `light` theme), Inter font, primary color `#570df8`
- **Styling convention**: DaisyUI component classes (`btn`, `btn-primary`, `input`, `card`, etc.) + Tailwind utilities

---

## Existing Dependencies

### Already Present (REUSE)
| Package | Version | Notes |
|---|---|---|
| `next` | ^15.1.9 | App Router, server components |
| `react` / `react-dom` | ^19.0.0 | Latest React |
| `@supabase/ssr` | ^0.4.0 | Server-side Supabase client |
| `@supabase/supabase-js` | ^2.45.0 | Supabase JS client |
| `stripe` | ^13.11.0 | Stripe server SDK |
| `tailwindcss` | ^4.1.10 | Tailwind v4 (CSS config) |
| `daisyui` | ^5.0.5 | UI component library |
| `axios` | ^1.7.9 | HTTP client (used by `libs/api.ts`) |
| `react-hot-toast` | ^2.4.1 | Toast notifications |
| `react-tooltip` | ^5.28.0 | Tooltips |
| `nextjs-toploader` | ^3.7.15 | Page transition progress bar |
| `zod` | ^3.24.1 | Schema validation |
| `sharp` | NOT present | **Need to install** |

### Need to Install
| Package | Purpose |
|---|---|
| `@cornerstonejs/core` | DICOM rendering engine |
| `@cornerstonejs/tools` | DICOM interaction tools |
| `@cornerstonejs/dicom-image-loader` | DICOM file loading |
| `dcmjs` | DICOM parsing |
| `@supabase/auth-ui-react` | Pre-built auth UI (SKIP — template has custom auth) |
| `minio` | MinIO S3-compatible client |
| `@stripe/stripe-js` | Stripe client-side SDK |
| `@anthropic-ai/sdk` | Claude AI API |
| `@react-pdf/renderer` | PDF generation |
| `sharp` | Image processing |

### Decision: Skip `@supabase/auth-ui-react`
The template already has a polished custom sign-in page at `app/signin/page.tsx` with Google OAuth + Magic Link. We should **extend** this rather than replacing it with auth-ui-react.

---

## Existing Components

| Component | Action | Reason |
|---|---|---|
| `Header.tsx` | **EXTEND** | Add MRI-specific nav links (Upload, Dashboard) |
| `Footer.tsx` | **EXTEND** | Update links for MRI app (privacy, terms, contact) |
| `ButtonSignin.tsx` | **KEEP** | Already handles auth state, shows avatar |
| `ButtonCheckout.tsx` | **REPLACE** | Uses priceId-based flow; we need custom per-study checkout |
| `ButtonAccount.tsx` | **KEEP** | Account management button |
| `LayoutClient.tsx` | **KEEP** | Wraps toast, tooltip, top-loader, Crisp |
| `Pricing.tsx` | **REPLACE** | Template subscription pricing; we need one-time $29/study |
| `Hero.tsx` | **REPLACE** | Generic template hero; build MRI-specific hero |
| `FAQ.tsx` | **EXTEND** | Reuse structure, update content for MRI |
| `FeaturesGrid.tsx` | **REPLACE** | Build "How It Works" section instead |
| `Testimonials*.tsx` | **DELETE** | Not needed initially |
| `Problem.tsx` | **DELETE** | Not relevant |
| `WithWithout.tsx` | **KEEP for reference** | Could adapt for Free vs Paid comparison |
| `CTA.tsx` | **REPLACE** | Build MRI-specific CTA |
| `Modal.tsx` | **KEEP** | Useful utility |
| `ButtonPopover.tsx` | **KEEP** | Useful utility |
| `ButtonGradient.tsx` | **KEEP** | Could use for premium CTA styling |
| `ButtonLead.tsx` | **DELETE** | Not needed |
| `ButtonSupport.tsx` | **KEEP** | Crisp integration |
| `BetterIcon.tsx` | **KEEP** | Utility |
| `Tabs.tsx` | **KEEP** | May reuse in viewer |
| `FeaturesListicle.tsx` | **DELETE** | Not needed |
| `FeaturesAccordion.tsx` | **DELETE** | Not needed |
| `Testimonial1Small.tsx` | **DELETE** | Not needed |

---

## Existing Routes

| Route | Action | Reason |
|---|---|---|
| `app/page.tsx` | **REPLACE** | Placeholder → MRI landing page |
| `app/signin/page.tsx` | **EXTEND** | Add redirect param support for post-auth return |
| `app/dashboard/page.tsx` | **REPLACE** | Placeholder → user's study list |
| `app/dashboard/layout.tsx` | **KEEP** | Auth guard works perfectly |
| `app/blog/**` | **KEEP** | Leave blog intact (SEO value) |
| `app/tos/page.tsx` | **KEEP** | Terms of service |
| `app/privacy-policy/page.tsx` | **KEEP** | Privacy policy |
| `app/api/auth/callback/route.ts` | **EXTEND** | Support redirect param |
| `app/api/stripe/create-checkout/route.ts` | **KEEP for reference** | Build new per-study checkout alongside |
| `app/api/webhook/stripe/route.ts` | **EXTEND** | Add MRI payment handling cases |
| `app/api/stripe/create-portal/` | **KEEP** | Customer portal still useful |
| `app/api/lead/route.ts` | **KEEP** | Lead capture still useful |

---

## Existing Lib/Infrastructure

| File | Action | Notes |
|---|---|---|
| `libs/supabase/client.ts` | **KEEP** | Browser Supabase client |
| `libs/supabase/server.ts` | **KEEP** | Server Supabase client |
| `libs/supabase/middleware.ts` | **KEEP** | Session refresh middleware |
| `libs/stripe.ts` | **EXTEND** | Add MRI-specific checkout creation |
| `libs/api.ts` | **KEEP** | Axios client with auth interceptor |
| `libs/seo.tsx` | **EXTEND** | Update SEO tags for MRI app |
| `libs/resend.ts` | **KEEP** | Email sending |
| `libs/gpt.ts` | **REPLACE** | Replace with Claude/Anthropic |
| `middleware.ts` | **EXTEND** | Add /viewer/* protection |
| `config.ts` | **EXTEND** | Update branding, add MRI-specific config |

---

## Design System

- **Theme**: DaisyUI `light` with primary `#570df8` (purple)
- **Font**: Inter (Google Fonts), with `Satoshi` declared as display font in CSS
- **Button styles**: `btn btn-primary`, `btn btn-block`, `btn-gradient` (rainbow shimmer)
- **Layout**: `max-w-7xl mx-auto px-8` containers
- **Cards**: DaisyUI card classes
- **Form inputs**: `input input-bordered`
- **Animations**: Custom shimmer, opacity, popup, wiggle keyframes in globals.css
- **Background**: `bg-base-200` for header/footer, `bg-base-100` for content

**For dark MRI viewer**: We'll need a dark section/page that contrasts with the light theme. Use `data-theme="dark"` on viewer sections or create a dark variant.

---

## Environment Variables (Existing)

```
RESEND_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

**Note**: Template uses `STRIPE_PUBLIC_KEY` not `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. We should add our new vars alongside existing ones.

---

## Conflicts & Considerations

1. **TypeScript `ConfigProps` type**: Imported in `config.ts` but `types/config.ts` doesn't exist — will cause build error. Need to either create the type file or remove the import.
2. **Tailwind v4**: No `tailwind.config.ts` — all config is in `globals.css` via `@theme`. New animations (pulse for bounding boxes) go there.
3. **DaisyUI v5 + light theme**: The MRI viewer needs dark background. Use scoped `data-theme="dark"` on viewer components.
4. **`libs/gpt.ts`**: OpenAI integration exists — replace with Anthropic.
5. **Stripe webhook**: Existing webhook handles `profiles` table updates. Our MRI payment flow needs its own handling alongside.
6. **No `profiles` table in our schema**: Template expects `profiles` table with `customer_id`, `price_id`, `has_access`. We may need to keep this or migrate.
7. **Blog system**: Fully built with MDX support. Keep as-is.
8. **MongoDB references**: `next.config.js` has MongoDB ignore plugin — harmless, keep.

---

## Folder Convention

Template uses:
- `app/` — pages and API routes (Next.js App Router)
- `components/` — shared React components (flat, no subdirectories)
- `libs/` — utility modules (NOT `lib/`)
- `config.ts` — central app config at root

**We should follow `libs/` convention** (not `lib/`) to stay consistent with the template.

---

## Build Plan Summary

1. Fix `ConfigProps` type import issue
2. Update `config.ts` for MRI branding
3. Install missing deps (cornerstone, minio, @stripe/stripe-js, @anthropic-ai/sdk, @react-pdf/renderer, sharp, dcmjs)
4. Add new env vars to `.env.example`
5. Create `docker-compose.yml` for MinIO
6. Add new libs: `libs/minio.ts`, `libs/annotate.ts`
7. Extend auth to support redirect after login
8. Build landing page reusing Header/Footer
9. Build upload, preview, paywall components
10. Build payment flow (extend existing Stripe setup)
11. Build viewer, dashboard, doctor letter
12. Update README
