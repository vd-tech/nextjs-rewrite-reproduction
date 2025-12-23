# Next.js App Router: Server Component render tree not updated on client-side navigation with route rewrites

**Repository:** [https://github.com/vd-tech/nextjs-rewrite-reproduction](https://github.com/vd-tech/nextjs-rewrite-reproduction)  
**Live Demo:** [https://nextjs-rewrite-reproduction.vercel.app/](https://nextjs-rewrite-reproduction.vercel.app/)

## Issue Description

When using Next.js App Router with route rewrites (via middleware/proxy) that set dynamic headers, server components execute correctly and `headers()` returns fresh values, but the client-side render tree is not updated on client-side navigation. The React Server Component payload is cached and reused even though the server executes with different header values.

## Expected Behavior

When navigating client-side between routes that rewrite to the same page component but with different header values:
- ✅ Server components should execute with fresh header values (they do ✅)
- ✅ `generateMetadata` should execute with fresh header values (it does ✅)
- ❌ The client-side render tree should update to reflect new server component output (it doesn't ❌)
- ❌ `document.title` should update to reflect the new metadata (it doesn't ❌)
- ❌ The visible page content should update (it doesn't ❌)

## Actual Behavior

On client-side navigation:
- ✅ Server components execute with correct header values (server logs confirm this)
- ✅ `generateMetadata` executes with correct header values (server logs confirm this)
- ❌ Client-side render tree shows stale content from previous navigation
- ❌ `document.title` remains stale
- ❌ Page content remains stale

**Key observation:** Server logs show correct execution (e.g., `[SharedPage] Rendering with label: Route C`), but the client still displays the previous route's content.

**Note:** This works correctly on initial page load (SSR) and when navigating to the same route twice (e.g., `/route-c` → `/route-c`).

## Reproduction Steps

### Option 1: Try the Live Demo

Visit the [live deployment on Vercel](https://nextjs-rewrite-reproduction.vercel.app/) to see the issue in action:
1. Navigate to `/route-a` - you'll see "Route A Page"
2. Click "Route C" link (client-side navigation)
3. Notice the page content stays on "Route A Page" even though server logs show correct execution
4. Check the browser console for server logs confirming correct header values

### Option 2: Run Locally

1. Install dependencies:
   ```bash
   bun install
   # or npm install / yarn install / pnpm install
   ```

2. Start the development server:
   ```bash
   bun dev
   # or npm run dev / yarn dev / pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. **Initial Load Test (Works Correctly):**
   - Navigate to `/route-a` (or click the link from home)
   - ✅ Browser tab title shows "Route A Page"
   - ✅ Page content shows "Route A Page"
   - ✅ Server logs show `[SharedPage] Rendering with label: Route A`

5. **Client-Side Navigation Test (The Bug):**
   - Click "Route C" link (client-side navigation)
   - ✅ Server logs show `[SharedPage] Rendering with label: Route C` (correct!)
   - ✅ Server logs show `[generateMetadata] Running with label: Route C` (correct!)
   - ❌ Browser tab title still shows "Route A Page" (should be "Route C Page")
   - ❌ Page content still shows "Route A Page" (should be "Route C Page")
   - **Server executes correctly, but client render tree is stale!**

6. **Same Route Navigation (Works):**
   - Click "Route C" link again (navigating `/route-c` → `/route-c`)
   - ✅ Page content updates to "Route C Page"
   - ✅ Browser tab title updates to "Route C Page"
   - This works because React recognizes it's the same route

7. **Sequential Navigation (Stays Stale):**
   - Navigate `/route-a` → `/route-b` → `/route-c`
   - ❌ Page content stays on "Route A Page" (first cached value)
   - Server logs show correct execution for each route, but client doesn't update

8. **Full Page Reload (Works Correctly):**
   - Refresh the page or directly navigate to `/route-b`
   - ✅ Everything updates correctly on SSR

## How It Works

### Proxy (`proxy.ts`)
- Intercepts routes `/route-a`, `/route-b`, `/route-c`
- Rewrites all three routes to `/shared-page`
- Sets different header values for each route:
  - `/route-a` → `x-route-label: "Route A"`
  - `/route-b` → `x-route-label: "Route B"`
  - `/route-c` → `x-route-label: "Route C"`

### Shared Page (`app/shared-page/page.tsx`)
- Reads the `x-route-label` header using `headers()` from `next/headers`
- Exports `generateMetadata` that uses the header value to set `title: "{label} Page"`
- Renders a page showing the label from headers
- Displays the current `document.title` value for debugging

## Key Observations

1. **Server execution is correct:** Server logs confirm `headers()` returns fresh values and components execute correctly
2. **Client render tree is stale:** The React Server Component payload is cached and not refreshed
3. **Same route works:** Navigating to the same route twice triggers an update (React recognizes route change)
4. **Different routes don't update:** Navigating between different routes that rewrite to the same component keeps stale cache
5. **Route rewrites are the trigger:** This only happens when routes are rewritten to the same component with different headers

## Root Cause

On client-side navigation with route rewrites:
- Next.js rewrites different routes (`/route-a`, `/route-b`, `/route-c`) to the same component (`/shared-page`)
- The middleware/proxy runs and sets new headers correctly
- Server components execute with correct header values (confirmed by logs)
- However, Next.js/React caches the React Server Component payload by the rewritten route (`/shared-page`)
- Since all routes rewrite to `/shared-page`, React sees it as the same route and reuses cached RSC payload
- The client render tree doesn't update even though the server executed with different values
- Only a full page reload (SSR) or navigating to the same route triggers a fresh render

## Technical Details

- **Next.js Version:** 16.1.1
- **React Version:** 19.2.3
- **Issue Type:** React Server Component caching bug with route rewrites
- **Affected:** Client-side render tree updates, metadata updates
- **Server execution:** Works correctly ✅
- **Client rendering:** Fails to update ❌

## Files Structure

```
├── proxy.ts                          # Route rewrites and header setting
├── app/
│   ├── page.tsx                     # Home page with navigation links
│   ├── layout.tsx                   # Root layout
│   └── shared-page/
│       ├── page.tsx                 # Shared page with generateMetadata
│       └── document-title.tsx       # Client component to display document.title
└── README.md                        # This file
```

