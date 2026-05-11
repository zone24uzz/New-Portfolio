# 🌌 Frontend Memory Palace — Advanced Analytics System

A **futuristic, cinematic visitor analytics and session logging system** built for the Frontend Memory Palace portfolio. Tracks every visitor session with real-time updates, holographic UI, and cyberpunk aesthetics.

---

## ✨ Features

### 📊 **Visitor Session Tracking**
- **Automatic session detection** — tracks every visitor from entry to exit
- **Session data captured:**
  - Session ID (anonymous fingerprint)
  - Enter/exit timestamps
  - Total time spent
  - Active/offline status
  - Browser, OS, device type
  - Screen resolution
  - Country/city (via Vercel geo headers)
  - Referral source
  - Page views
  - Language & timezone

### 🚪 **Enter + Exit Detection**
- **Enter:** Timestamp saved on first page load
- **Exit:** Detected via:
  - `beforeunload` event (page close/refresh)
  - `visibilitychange` (tab switch/minimize)
  - Heartbeat timeout (30s intervals)
  - Inactivity timeout (30 minutes)
- **Session recovery:** Re-initializes if user returns after long absence
- **Reliable:** Uses `sendBeacon` API for guaranteed delivery on page close

### 🔴 **Live Visitor System**
- Real-time active sessions display
- Live activity log with "consciousness connected" messages
- Auto-refreshes every 30 seconds
- Pulsing online indicators
- Recently joined visitors timeline

### 🎛️ **Admin Analytics Dashboard**
- **5 Dashboard Panels:**
  1. **Overview** — Total sessions, active now, avg duration, bounce rate, charts
  2. **Live** — Real-time active visitors with device/browser/country
  3. **Sessions** — Full session log table with sorting & pagination
  4. **Devices** — Device types, browsers, OS, screen resolutions (charts)
  5. **Traffic** — Referral sources, countries, languages, timezones (charts)

- **Futuristic UI:**
  - Glassmorphism panels
  - Neon purple/blue gradients
  - Animated counters
  - Holographic scan lines
  - Glowing stat cards
  - Smooth Framer Motion transitions
  - Custom Recharts styling

### 🔐 **Security**
- Password-protected admin login (`/admin`)
- Token-based API authentication
- Row-level security (RLS) in Supabase
- IP addresses hashed (SHA-256) — never stored raw
- Anonymous session IDs (no PII)
- Service role key used server-side only

### ⚡ **Performance**
- **Lightweight:** ~500ms deferred init, non-blocking
- **Async:** All tracking happens in background
- **Optimized:** Heartbeat batching, efficient queries
- **Production-ready:** Error handling, silent failures

---

## 🛠️ Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Supabase** (Realtime database + auth)
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **Recharts** (charts)
- **date-fns** (date formatting)

---

## 📦 Installation

### 1. **Install Dependencies**

```bash
npm install @supabase/supabase-js
# or
pnpm add @supabase/supabase-js
```

### 2. **Set Up Supabase**

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema:

```sql
-- Copy contents from lib/analytics/schema.sql
```

3. Get your API keys from **Project Settings → API**

### 3. **Configure Environment Variables**

Create `.env.local` in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Admin Dashboard
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_ADMIN_TOKEN=your-secret-token
ANALYTICS_ADMIN_TOKEN=your-secret-token
```

**Security Notes:**
- Use a strong password for `ADMIN_PASSWORD`
- Generate a random token for `ADMIN_TOKEN` (e.g., `openssl rand -hex 32`)
- Never commit `.env.local` to git

### 4. **Run the Development Server**

```bash
npm run dev
```

Visit:
- **Portfolio:** `http://localhost:3000`
- **Admin Login:** `http://localhost:3000/admin`
- **Dashboard:** `http://localhost:3000/admin/dashboard` (after login)

---

## 📁 File Structure

```
lib/analytics/
  ├── types.ts              # TypeScript types
  ├── fingerprint.ts        # Anonymous visitor fingerprinting
  ├── session.ts            # Client-side session tracker
  ├── supabase.ts           # Supabase client + DB helpers
  └── schema.sql            # Database schema

app/api/analytics/
  ├── session/route.ts      # POST /api/analytics/session
  ├── heartbeat/route.ts    # POST /api/analytics/heartbeat
  ├── exit/route.ts         # POST /api/analytics/exit
  └── admin/
      └── sessions/route.ts # GET /api/analytics/admin/sessions

app/admin/
  ├── page.tsx              # Login page
  └── dashboard/
      └── page.tsx          # Main dashboard

components/analytics/
  ├── session-provider.tsx  # Auto-tracking wrapper
  ├── animated-counter.tsx  # Animated stat numbers
  ├── cyber-chart.tsx       # Recharts wrappers
  ├── admin-overview.tsx    # Overview panel
  ├── admin-live.tsx        # Live visitors panel
  ├── admin-sessions.tsx    # Session log table
  ├── admin-devices.tsx     # Device analytics
  └── admin-traffic.tsx     # Traffic sources
```

---

## 🚀 Usage

### **Automatic Tracking**

The `SessionProvider` is already wired into `app/layout.tsx`. Every visitor is automatically tracked — no additional code needed.

### **Manual Page View Tracking**

If you want to track route changes in a single-page app:

```tsx
import { usePageView } from "@/components/analytics/session-provider"

export function MyPage() {
  usePageView() // Call on route change
  return <div>...</div>
}
```

### **Admin Dashboard**

1. Navigate to `/admin`
2. Enter the password (from `NEXT_PUBLIC_ADMIN_PASSWORD`)
3. Access the dashboard at `/admin/dashboard`
4. Switch between tabs: Overview, Live, Sessions, Devices, Traffic
5. Data auto-refreshes every 30 seconds

---

## 🎨 Customization

### **Change Refresh Interval**

Edit `app/admin/dashboard/page.tsx`:

```ts
const REFRESH_INTERVAL = 30_000 // 30 seconds → change to 60_000 for 1 minute
```

### **Change Heartbeat Interval**

Edit `lib/analytics/session.ts`:

```ts
const HEARTBEAT_INTERVAL = 30_000 // 30 seconds
```

### **Change Inactivity Timeout**

Edit `lib/analytics/session.ts`:

```ts
const INACTIVITY_TIMEOUT = 30 * 60_000 // 30 minutes
```

### **Customize Colors**

All colors use CSS variables from `app/globals.css`. Modify:
- `--neon-blue`, `--neon-violet`, `--neon-cyan` for glow colors
- Chart colors in `components/analytics/cyber-chart.tsx`

---

## 🔒 Security Best Practices

1. **Never expose service role key** — only use in API routes (server-side)
2. **Use strong passwords** — for admin login
3. **Enable RLS** — Supabase Row Level Security is enabled by default
4. **Hash IPs** — IP addresses are SHA-256 hashed, never stored raw
5. **Anonymous sessions** — No PII collected (no names, emails, etc.)
6. **HTTPS only** — Always deploy with HTTPS in production

---

## 🐛 Troubleshooting

### **"Unauthorized" error in dashboard**

- Check that `ANALYTICS_ADMIN_TOKEN` matches `NEXT_PUBLIC_ADMIN_TOKEN`
- Verify token is set in both `.env.local` and Vercel env vars (if deployed)

### **No sessions appearing**

- Check Supabase connection (verify URL and keys)
- Run the SQL schema in Supabase SQL Editor
- Check browser console for errors
- Verify API routes are accessible (`/api/analytics/session`)

### **Dashboard not loading**

- Clear browser cache and sessionStorage
- Check that you're logged in (`sessionStorage.__fmp_admin` should be `"1"`)
- Verify Supabase service role key is correct

### **Sessions not marking as inactive**

- Heartbeat timeout is 2 minutes (sessions older than 2 min without heartbeat are inactive)
- Check `last_heartbeat` column in Supabase

---

## 🚢 Deployment

### **Vercel (Recommended)**

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in **Settings → Environment Variables**
4. Deploy

**Note:** Vercel provides geo headers (`x-vercel-ip-country`, `x-vercel-ip-city`) automatically.

### **Other Platforms**

- Ensure environment variables are set
- Geo headers may not be available (country/city will show "Unknown")
- Consider using a geo-IP service (e.g., ipapi.co, ip-api.com)

---

## 📊 Database Schema

### **visitor_sessions**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `session_id` | TEXT | Unique session identifier |
| `ip_hash` | TEXT | SHA-256 hash of IP |
| `enter_time` | TIMESTAMPTZ | Session start |
| `exit_time` | TIMESTAMPTZ | Session end (null if active) |
| `duration_seconds` | INTEGER | Total time spent |
| `is_active` | BOOLEAN | Currently active |
| `browser` | TEXT | Browser name |
| `browser_version` | TEXT | Browser version |
| `os` | TEXT | Operating system |
| `device_type` | TEXT | desktop/mobile/tablet |
| `screen_resolution` | TEXT | e.g., "1920x1080" |
| `country` | TEXT | Country code |
| `city` | TEXT | City name |
| `referral_source` | TEXT | e.g., "Google", "Direct" |
| `referral_url` | TEXT | Full referrer URL |
| `user_agent` | TEXT | Full UA string |
| `language` | TEXT | Browser language |
| `timezone` | TEXT | User timezone |
| `last_heartbeat` | TIMESTAMPTZ | Last ping |
| `page_views` | INTEGER | Number of pages viewed |
| `created_at` | TIMESTAMPTZ | Record creation |

### **session_events** (Future: heatmaps, replays)

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `session_id` | TEXT | Foreign key |
| `event_type` | TEXT | Event name |
| `event_data` | JSONB | Event payload |
| `timestamp` | TIMESTAMPTZ | Event time |

---

## 🎯 Roadmap

- [ ] Session replay (record DOM mutations)
- [ ] Heatmaps (click/scroll tracking)
- [ ] Funnel analysis
- [ ] A/B testing integration
- [ ] Export to CSV/JSON
- [ ] Email alerts (e.g., "10 users online")
- [ ] Custom event tracking API
- [ ] Real-time WebSocket updates (replace polling)

---

## 📝 License

MIT — feel free to use in your own projects.

---

## 🙏 Credits

Built with ❤️ for the **Frontend Memory Palace** portfolio.

**Technologies:**
- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org)
- [Tailwind CSS](https://tailwindcss.com)

---

## 📧 Support

For issues or questions, open an issue on GitHub or contact the developer.

---

**🌌 "New consciousness connected."**
