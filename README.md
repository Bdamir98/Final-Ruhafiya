## Ruhafiya - ব্যথা মুক্তির জন্য আপনার নির্ভরযোগ্য সমাধান

Stack has been migrated to Next.js + Supabase while keeping the UI and API behavior the same.

### Tech
- Next.js (app router) under `app/`
- TailwindCSS (`tailwind.config.js`)
- Supabase (Postgres) via `@supabase/supabase-js` (`src/lib/supabase-server.ts`)

### Environment
Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Note: service role is used server-side in API routes. Do not expose it to the client.

### Database
Create tables in Supabase using `supabase/schema.sql`:
```
-- In Supabase SQL editor, paste contents of supabase/schema.sql and run
```

### Develop
```
npm install
npm run dev
```

### API Endpoints (unchanged paths)
- POST `/api/orders`
- GET `/api/products`
- POST `/api/admin/login`
- GET `/api/admin/orders`

### Tracking
The project now includes advanced tracking integrations:

- **Google Tag Manager (GTM):** Implemented in `app/layout.tsx` with conditional loading based on `NEXT_PUBLIC_GTM_ID`. Includes noscript fallback for users without JavaScript.

- **Facebook Pixel:** Advanced client-side tracking with events for ViewContent (on product view/select), InitiateCheckout (on form submit), and Lead (on successful order) in `src/react-app/components/OrderForm.tsx`. Supports test event code for testing.

- **Facebook Conversion API:** Server-side tracking in `app/api/orders/route.ts` for Purchase events upon order completion. Includes hashed user data (phone) for privacy and compliance with FB policies.

Set the following environment variables in `.env.local`:
- `NEXT_PUBLIC_GTM_ID`: Your GTM Container ID (e.g., GTM-XXXXXXX)
- `NEXT_PUBLIC_FB_PIXEL_ID`: Your Facebook Pixel ID
- `NEXT_PUBLIC_FB_TEST_EVENT_CODE`: Test Event Code from Events Manager (optional, for testing)
- `FB_ACCESS_TOKEN`: Long-lived system user access token for Conversion API requests (server-only)
