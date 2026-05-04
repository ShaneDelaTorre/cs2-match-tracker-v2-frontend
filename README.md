# CS2 Match Tracker v2 — Frontend

A Next.js 16 App Router frontend with React Query, cookie-based JWT auth, and a native WebSocket chat implementation.

---

## Tech Stack

- **Next.js 16.2** (App Router) + **React 19**
- **TypeScript**
- **TanStack React Query v5** — server state management
- **axios** — HTTP client with `withCredentials: true`
- **CSS Modules** — component-scoped styling, no Tailwind
- **pnpm** — package manager

---

## Architecture

### Data fetching layers

```
Component
  → calls hook (src/hooks/)
  → hook calls endpoint function (src/lib/endpoints.ts)
  → endpoint calls axios instance (src/lib/api.ts)
  → axios sends request to Django API
```

### Auth via httpOnly cookies

The backend sets `access_token` and `refresh_token` as httpOnly cookies on login. JavaScript cannot read them — this eliminates XSS token theft entirely. The frontend never touches `localStorage` for auth.

`withCredentials: true` on the axios instance is required for cross-origin cookie sending between `localhost:3000` and `localhost:8000`.

The axios interceptor automatically handles 401 responses by calling the refresh endpoint and retrying the original request. If refresh fails, the user is redirected to `/login`.

### Server-side auth hydration

`RootLayout` is a server component that reads the `access_token` cookie using `next/headers` and passes `initialAuth` to `AuthProvider`. This means the server and client render with the same initial auth state — no hydration mismatch.

`Providers.tsx` is a separate client component wrapping `QueryClientProvider` and `AuthProvider`. `QueryClient` is created with `useState(() => makeQueryClient())` to prevent shared cache between users on the server.

### Route protection

`proxy.ts` (Next.js 16's replacement for `middleware.ts`) reads the `access_token` cookie and redirects unauthenticated users to `/login` and authenticated users away from public routes.

### Forms pattern

Forms use React 19's `useActionState` with the `action` prop. Field values are stored in state and passed back on error so inputs repopulate on failed submit — no controlled inputs needed.

### WebSocket chat

The WebSocket connection is stored in a `useRef` to persist across re-renders without causing re-renders when it changes. Message history is loaded via REST on mount, then new messages arrive via WebSocket and are stored in `useState`.

Deduplication is handled in the `setNewMessages` updater function — before adding a message, the existing state is checked for the same `message_id`. This handles React strict mode's double-mount behavior in development and tab visibility reconnections.

```
Page mounts
  → useChat() fetches history via REST → normalized into ChatMessage[]
  → useEffect opens WebSocket connection
  → onmessage handler appends new messages to state

User sends message
  → ws.current.send(JSON.stringify({ body: input }))
  → backend saves to DB, broadcasts to Redis group
  → onmessage fires on both sender and receiver
  → UI updates instantly for both
```

---

## Folder Structure

```
src/
  app/
    (auth)/           → login, register — no navbar
    (main)/           → dashboard, matches, profile, friends, chat, news — with navbar
    layout.tsx        → server component, reads cookies for initialAuth
    providers.tsx     → client component, QueryClient + AuthProvider
  components/
    Navbar/
    CareerSummary/
    MatchList/
  context/
    AuthContext.tsx   → isAuthenticated, login, logout only
  hooks/
    useMatches.ts
    useProfile.ts
    useFriends.ts
    useChat.ts
    useNews.ts
  lib/
    api.ts            → axios instance with interceptor
    endpoints.ts      → all raw API calls
    queryClient.ts    → makeQueryClient factory
    utils.ts          → getErrorMessage helper
  types/
    index.ts          → all TypeScript interfaces
proxy.ts              → route protection (Next.js 16)
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/login` | JWT login, sets httpOnly cookies via backend |
| `/register` | User registration |
| `/dashboard` | Career summary + recent matches |
| `/matches/log` | Round-by-round match creation form |
| `/matches/[id]` | Match detail with state-at-round slider (event sourcing showcase) |
| `/profile/me` | Own profile with career summary |
| `/profile/[id]` | Public profile — add friend, view career summary |
| `/friends` | Friend list, pending requests, user search |
| `/chat/[id]` | Real-time WebSocket chat with message history |
| `/news` | CS2 activity feed — auto-refreshes every 60 seconds |

---

## Running Locally

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

Requires the backend running at `http://localhost:8000`. Set `NEXT_PUBLIC_API_URL` in `.env.local` if using a different port.