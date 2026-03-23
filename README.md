# MRI Viewer

AI-powered MRI analysis web app. Upload DICOM files, get findings highlighted with severity ratings, and download a professional doctor's letter PDF.

## Architecture

- **Free tier**: Client-side DICOM parsing, blurred preview with AI annotations, no storage
- **Paid tier ($29/study)**: Full resolution viewer, all findings, doctor's letter PDF, permanent MinIO storage

## Tech Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **UI**: Tailwind CSS v4, DaisyUI v5
- **Auth**: Supabase Auth (Google OAuth + Magic Links)
- **Database**: Supabase PostgreSQL with RLS
- **Storage**: MinIO (S3-compatible, self-hosted)
- **Payments**: Stripe Checkout (one-time)
- **AI**: Anthropic Claude (vision model for MRI analysis)
- **PDF**: @react-pdf/renderer
- **DICOM**: dcmjs (client-side parsing)

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd mriViewer
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in all values in `.env`:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project settings > API (keep secret!) |
| `STRIPE_SECRET_KEY` | Stripe Dashboard > Developers > API keys |
| `STRIPE_PUBLIC_KEY` | Stripe Dashboard > Developers > API keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Same as STRIPE_PUBLIC_KEY |
| `STRIPE_WEBHOOK_SECRET` | Created when setting up webhook endpoint |
| `MINIO_ROOT_USER` | Your choice (default: minioadmin) |
| `MINIO_ROOT_PASSWORD` | Your choice (default: minioadmin) |
| `ANTHROPIC_API_KEY` | Anthropic Console > API Keys |

### 3. Start MinIO

```bash
docker-compose up -d
```

Open MinIO Console at [http://localhost:9001](http://localhost:9001):
- Login with `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`
- Create a bucket called `mri-studies` (private, no public access)

### 4. Set up Supabase database

Run the SQL schema in the Supabase SQL Editor:

```bash
# Copy and paste the contents of supabase-schema.sql into the SQL Editor
```

The schema creates tables for: `studies`, `series`, `dicom_files`, `annotations`, `payments` — all with Row Level Security policies.

### 5. Enable Supabase Realtime

In Supabase Dashboard:
- Go to Database > Replication
- Enable Realtime for the `payments` table

### 6. Configure Supabase Auth

In Supabase Dashboard > Authentication > Providers:
- Enable Email (Magic Links are enabled by default)
- Enable Google OAuth (requires Google Cloud Console credentials)
- Set redirect URL: `http://localhost:3000/api/auth/callback`

### 7. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 8. Set up Stripe webhook (for local development)

Install Stripe CLI, then:

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in your `.env`.

## File Structure

```
app/
  page.tsx                            # Landing page with upload widget
  upload/page.tsx                     # Upload redirect page
  processing/page.tsx                 # Post-payment processing
  viewer/[studyId]/page.tsx           # Full paid DICOM viewer
  dashboard/page.tsx                  # User's study history
  signin/page.tsx                     # Auth page (Google + Magic Link)
  api/
    annotate/preview/route.ts         # Free-tier AI annotation
    studies/persist/route.ts          # Paid study upload + annotation
    payments/
      create-checkout-session/route.ts
      webhook/route.ts
    report/[studyId]/letter/route.ts  # Doctor's letter PDF
    auth/callback/route.ts            # OAuth callback
components/
  UploadZone.tsx                      # Drag-and-drop DICOM upload
  PreviewViewer.tsx                   # Blurred preview with annotations
  PaywallOverlay.tsx                  # Glassmorphism paywall
  DicomViewer.tsx                     # Full DICOM viewer with controls
  AnnotationOverlay.tsx               # Bounding box overlay
  FindingsPanel.tsx                   # Findings list with severity
  StudyInfoPanel.tsx                  # Study metadata display
  DoctorLetterButton.tsx              # PDF download button
libs/
  supabase/                           # Supabase client (browser + server)
  minio.ts                            # MinIO client
  annotate.ts                         # Claude AI annotation
  stripe.ts                           # Stripe utilities
  api.ts                              # Axios API client
```

## Payment Flow

1. User uploads DICOM files (parsed client-side, held in memory)
2. Middle slice sent to `/api/annotate/preview` for free AI analysis
3. Blurred preview shown with finding count
4. User clicks "Unlock Full Report - $29"
5. Stripe Checkout session created, user pays
6. Webhook confirms payment, broadcasts via Supabase Realtime
7. Client uploads DICOM files to MinIO via `/api/studies/persist`
8. Full annotation runs on all slices
9. User redirected to `/viewer/[studyId]` with full access
