# Action Images & Infrastructure Hardening — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cinematic YouTube-thumbnail-based imagery across the site (starting with Find My Robot wizard task cards) and harden infrastructure with rate limiting and database indexes.

**Architecture:** A single `lib/action-images.ts` data file maps task/industry keys to YouTube video IDs, gradient fallbacks, icons, and colors. A `TaskCard` component renders these as full-image cards with gradient overlays. Rate limiting uses `@upstash/ratelimit` on the existing Redis instance. Performance indexes target the most common query patterns.

**Tech Stack:** Next.js 15, TypeScript, Upstash Redis (already configured), `@upstash/ratelimit` (new), Supabase PostgreSQL.

---

## Task 1: Action Images Data Library

**Files:**
- Create: `lib/action-images.ts`

- [ ] **Step 1: Create the action images library**

Create `lib/action-images.ts` with:

```typescript
// lib/action-images.ts

export interface ActionImage {
  youtubeId?: string;
  gradient: string;
  icon: string;
  label: string;
  subtitle?: string;
  color: string;
}

/**
 * Single source of truth for all task/action/industry imagery.
 * YouTube thumbnails are free, always fresh, and high quality.
 * Gradient fallback ensures no broken images ever.
 */
export const ACTION_IMAGES: Record<string, ActionImage> = {
  // ── TASKS (Find My Robot wizard) ──
  "material-transport": {
    youtubeId: "lYlNjFdOCZ4",
    gradient: "from-blue-900 via-blue-800 to-cyan-900",
    icon: "Package",
    label: "Move Materials",
    subtitle: "AMRs, conveyors, forklifts",
    color: "#0EA5E9",
  },
  "pick-pack": {
    youtubeId: "quMz3FhOMZk",
    gradient: "from-indigo-900 via-purple-800 to-indigo-900",
    icon: "PackageCheck",
    label: "Pick & Pack",
    subtitle: "Order fulfillment robots",
    color: "#8B5CF6",
  },
  "cleaning": {
    youtubeId: "Ra2Rb2JWwks",
    gradient: "from-cyan-900 via-teal-800 to-cyan-900",
    icon: "Sparkles",
    label: "Clean Surfaces",
    subtitle: "Floor scrubbers, UV sanitizers",
    color: "#06B6D4",
  },
  "inspection": {
    youtubeId: "wlkCQxHsBnY",
    gradient: "from-amber-900 via-orange-800 to-amber-900",
    icon: "ScanLine",
    label: "Inspect & Survey",
    subtitle: "Drones, inspection robots",
    color: "#F59E0B",
  },
  "security": {
    youtubeId: "KMcEVdMJ5QA",
    gradient: "from-red-900 via-rose-800 to-red-900",
    icon: "Shield",
    label: "Secure a Facility",
    subtitle: "Patrol robots, surveillance",
    color: "#EF4444",
  },
  "service": {
    youtubeId: "nRbJJ5MgJb8",
    gradient: "from-pink-900 via-rose-800 to-pink-900",
    icon: "Users",
    label: "Serve Customers",
    subtitle: "Service, delivery, reception",
    color: "#EC4899",
  },
  "agriculture": {
    youtubeId: "gBVVqIQVMhk",
    gradient: "from-green-900 via-emerald-800 to-green-900",
    icon: "Leaf",
    label: "Harvest Crops",
    subtitle: "Agricultural automation",
    color: "#10B981",
  },
  "manufacturing": {
    youtubeId: "6c8Szsc3Oy4",
    gradient: "from-orange-900 via-amber-800 to-orange-900",
    icon: "Wrench",
    label: "Weld & Assemble",
    subtitle: "Manufacturing robots",
    color: "#F97316",
  },
  "delivery": {
    youtubeId: "dRi4Jl7dLkQ",
    gradient: "from-violet-900 via-purple-800 to-violet-900",
    icon: "Truck",
    label: "Deliver Items",
    subtitle: "Internal delivery robots",
    color: "#7C3AED",
  },
  "other": {
    gradient: "from-slate-900 via-slate-800 to-slate-900",
    icon: "HelpCircle",
    label: "Something Else",
    subtitle: "Tell us what you need",
    color: "#64748B",
  },

  // ── INDUSTRIES ──
  "warehouse": {
    youtubeId: "lYlNjFdOCZ4",
    gradient: "from-blue-950 via-blue-900 to-cyan-950",
    icon: "Warehouse",
    label: "Warehouse",
    color: "#0EA5E9",
  },
  "medical": {
    youtubeId: "dRi4Jl7dLkQ",
    gradient: "from-teal-950 via-teal-900 to-cyan-950",
    icon: "Heart",
    label: "Medical",
    color: "#14B8A6",
  },
  "humanoid": {
    youtubeId: "29ECwExc-_M",
    gradient: "from-purple-950 via-indigo-900 to-purple-950",
    icon: "Bot",
    label: "Humanoid",
    color: "#8B5CF6",
  },
  "hospitality": {
    youtubeId: "nRbJJ5MgJb8",
    gradient: "from-amber-950 via-amber-900 to-orange-950",
    icon: "Hotel",
    label: "Hospitality",
    color: "#F59E0B",
  },
  "construction": {
    youtubeId: "wlkCQxHsBnY",
    gradient: "from-yellow-950 via-amber-900 to-yellow-950",
    icon: "HardHat",
    label: "Construction",
    color: "#EAB308",
  },
  "eldercare": {
    youtubeId: "nRbJJ5MgJb8",
    gradient: "from-rose-950 via-pink-900 to-rose-950",
    icon: "Heart",
    label: "Eldercare",
    color: "#FB7185",
  },
  "agricultural": {
    youtubeId: "gBVVqIQVMhk",
    gradient: "from-green-950 via-green-900 to-emerald-950",
    icon: "Leaf",
    label: "Agriculture",
    color: "#22C55E",
  },
  "consumer": {
    youtubeId: "Ra2Rb2JWwks",
    gradient: "from-sky-950 via-sky-900 to-blue-950",
    icon: "Home",
    label: "Consumer",
    color: "#38BDF8",
  },
};

/** Get YouTube thumbnail URL. Uses maxresdefault with hqdefault fallback. */
export function getThumbnailUrl(youtubeId: string, quality: "maxres" | "hq" = "maxres"): string {
  const file = quality === "maxres" ? "maxresdefault" : "hqdefault";
  return `https://img.youtube.com/vi/${youtubeId}/${file}.jpg`;
}

/** Get action image config by key, with fallback to "other". */
export function getActionImage(key: string): ActionImage {
  return ACTION_IMAGES[key] || ACTION_IMAGES["other"];
}

/** Get CSS background style for an action image — thumbnail with gradient fallback. */
export function getBackgroundStyle(key: string): React.CSSProperties {
  const img = getActionImage(key);
  if (img.youtubeId) {
    return {
      backgroundImage: `url(${getThumbnailUrl(img.youtubeId)})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return {};
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/action-images.ts
git commit -m "feat: action images data library with YouTube thumbnails"
```

---

## Task 2: Task Card Component

**Files:**
- Create: `components/find-my-robot/task-card.tsx`

- [ ] **Step 1: Create the cinematic task card component**

Create `components/find-my-robot/task-card.tsx`:

```tsx
"use client";

import { useState } from "react";
import { getActionImage, getThumbnailUrl } from "@/lib/action-images";

interface TaskCardProps {
  taskKey: string;
  selected: boolean;
  onSelect: () => void;
}

export function TaskCard({ taskKey, selected, onSelect }: TaskCardProps) {
  const img = getActionImage(taskKey);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const thumbnailUrl = img.youtubeId ? getThumbnailUrl(img.youtubeId) : null;

  return (
    <button
      onClick={onSelect}
      className="group relative block w-full overflow-hidden rounded-xl text-left transition-all duration-300 focus:outline-none"
      style={{
        aspectRatio: "16 / 10",
        border: selected ? `2px solid ${img.color}` : "2px solid transparent",
        boxShadow: selected
          ? `0 0 0 4px ${img.color}20, inset 0 0 40px ${img.color}15`
          : "none",
        transform: selected ? "scale(1.02)" : undefined,
      }}
    >
      {/* Layer 1: Gradient background (always visible, acts as fallback) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${img.gradient}`}
      />

      {/* Layer 2: YouTube thumbnail (loads on top of gradient) */}
      {thumbnailUrl && !imgError && (
        <>
          {/* Hidden img to detect load/error */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt=""
            className="hidden"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
          {imgLoaded && (
            <div
              className="absolute inset-0 transition-transform duration-600 ease-out group-hover:scale-[1.08]"
              style={{
                backgroundImage: `url(${thumbnailUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
        </>
      )}

      {/* Layer 3: Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* Layer 4: Content */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div
          className="mb-1.5 text-lg"
          style={{ color: img.color }}
        >
          {getIconEmoji(img.icon)}
        </div>
        <p className="text-[15px] font-bold leading-tight text-white">
          {img.label}
        </p>
        {img.subtitle && (
          <p className="mt-1 text-xs text-white/0 transition-all duration-200 group-hover:text-white/70 group-hover:translate-y-0 translate-y-1.5">
            {img.subtitle}
          </p>
        )}
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: img.color }}
        >
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Hover border */}
      {!selected && (
        <div className="absolute inset-0 rounded-xl border border-transparent transition-colors group-hover:border-white/30" />
      )}
    </button>
  );
}

/** Map icon names to emoji for simplicity (no Lucide dependency needed) */
function getIconEmoji(icon: string): string {
  const map: Record<string, string> = {
    Package: "\ud83d\udce6",
    PackageCheck: "\ud83d\udce6",
    Sparkles: "\u2728",
    ScanLine: "\ud83d\udd0d",
    Shield: "\ud83d\udee1\ufe0f",
    Users: "\ud83d\udc65",
    Leaf: "\ud83c\udf3f",
    Wrench: "\ud83d\udd27",
    Truck: "\ud83d\ude9a",
    HelpCircle: "\u2753",
    Warehouse: "\ud83c\udfed",
    Heart: "\u2764\ufe0f",
    Bot: "\ud83e\udd16",
    Hotel: "\ud83c\udfe8",
    HardHat: "\ud83d\udc77",
    Home: "\ud83c\udfe0",
  };
  return map[icon] || "\ud83e\udd16";
}
```

- [ ] **Step 2: Commit**

```bash
git add components/find-my-robot/task-card.tsx
git commit -m "feat: cinematic task card with YouTube thumbnail + gradient fallback"
```

---

## Task 3: Redesign Find My Robot Wizard Step 1

**Files:**
- Modify: `components/find-my-robot/wizard.tsx`

- [ ] **Step 1: Update the wizard to use TaskCard in StepProblem**

Read the file first. Then modify the `StepProblem` function component to:

1. Add import at top of file: `import { TaskCard } from "@/components/find-my-robot/task-card";`

2. Replace the grid of text-abbreviation buttons in `StepProblem` with `TaskCard` components:

Replace this block (the grid inside StepProblem):
```tsx
<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3">
  {PROBLEMS.map((p) => (
    <button
      key={p.id}
      onClick={() => onChange(p.id)}
      className={`glass glass-hover flex flex-col items-center gap-3 rounded-xl p-5 text-center transition-all duration-200 ${
        value === p.id
          ? "!border-[#00C2FF] !bg-[#00C2FF]/5 ring-1 ring-[#00C2FF]/30"
          : ""
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg font-mono text-xs font-bold ${
          value === p.id
            ? "bg-[#00C2FF]/20 text-[#00C2FF]"
            : "bg-white/5 text-white/40"
        }`}
      >
        {p.icon}
      </div>
      <span className="text-sm leading-tight text-white/80">{p.label}</span>
    </button>
  ))}
</div>
```

With:
```tsx
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
  {PROBLEMS.map((p) => (
    <TaskCard
      key={p.id}
      taskKey={p.id}
      selected={value === p.id}
      onSelect={() => onChange(p.id)}
    />
  ))}
</div>
```

No other changes to the wizard file. The rest of the steps stay as-is.

- [ ] **Step 2: Verify build compiles**

Run: `npm run build 2>&1 | grep -E "error|Error" | head -10`

- [ ] **Step 3: Commit**

```bash
git add components/find-my-robot/wizard.tsx
git commit -m "feat: Find My Robot wizard — cinematic task cards with action images"
```

---

## Task 4: Robot Image Fallback Component

**Files:**
- Create: `components/robots/robot-image.tsx`

- [ ] **Step 1: Create the robot image component with fallback chain**

Create `components/robots/robot-image.tsx`:

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { getActionImage, getThumbnailUrl } from "@/lib/action-images";

interface RobotImageProps {
  src: string | null;
  alt: string;
  categorySlug?: string;
  className?: string;
  sizes?: string;
  fill?: boolean;
}

/**
 * Robot image with 3-tier fallback:
 * 1. Actual robot image (if valid URL)
 * 2. Category YouTube thumbnail
 * 3. Category gradient + icon
 *
 * Never shows a broken image.
 */
export function RobotImage({
  src,
  alt,
  categorySlug = "other",
  className = "",
  sizes = "33vw",
  fill = true,
}: RobotImageProps) {
  const [imgError, setImgError] = useState(false);
  const actionImg = getActionImage(categorySlug);

  // Tier 1: actual robot image
  const hasValidSrc = src && !src.includes("unsplash") && !imgError;

  if (hasValidSrc) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={`object-cover ${className}`}
        onError={() => setImgError(true)}
      />
    );
  }

  // Tier 2: YouTube thumbnail for category
  if (actionImg.youtubeId) {
    return (
      <YouTubeFallback
        youtubeId={actionImg.youtubeId}
        gradient={actionImg.gradient}
        icon={actionImg.icon}
        label={alt}
        color={actionImg.color}
        className={className}
      />
    );
  }

  // Tier 3: gradient + icon
  return (
    <GradientFallback
      gradient={actionImg.gradient}
      icon={actionImg.icon}
      label={alt}
      color={actionImg.color}
      className={className}
    />
  );
}

function YouTubeFallback({
  youtubeId,
  gradient,
  icon,
  label,
  color,
  className,
}: {
  youtubeId: string;
  gradient: string;
  icon: string;
  label: string;
  color: string;
  className: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const url = getThumbnailUrl(youtubeId, "hq");

  return (
    <div className={`relative h-full w-full ${className}`}>
      {/* Gradient base */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {/* YouTube thumbnail */}
      {!error && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="hidden"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
          {loaded && (
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage: `url(${url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
        </>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Label */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="text-[10px] font-medium text-white/50">{label}</p>
      </div>
    </div>
  );
}

function GradientFallback({
  gradient,
  icon,
  label,
  color,
  className,
}: {
  gradient: string;
  icon: string;
  label: string;
  color: string;
  className: string;
}) {
  const emojiMap: Record<string, string> = {
    Package: "\ud83d\udce6", Sparkles: "\u2728", ScanLine: "\ud83d\udd0d",
    Shield: "\ud83d\udee1\ufe0f", Users: "\ud83d\udc65", Leaf: "\ud83c\udf3f",
    Wrench: "\ud83d\udd27", Truck: "\ud83d\ude9a", Warehouse: "\ud83c\udfed",
    Heart: "\u2764\ufe0f", Bot: "\ud83e\udd16", Hotel: "\ud83c\udfe8",
    HardHat: "\ud83d\udc77", Home: "\ud83c\udfe0", HelpCircle: "\u2753",
    PackageCheck: "\ud83d\udce6",
  };

  return (
    <div className={`relative flex h-full w-full items-center justify-center ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="relative flex flex-col items-center gap-1">
        <span className="text-3xl opacity-40">{emojiMap[icon] || "\ud83e\udd16"}</span>
        <span className="text-[10px] font-medium text-white/30">{label}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/robots/robot-image.tsx
git commit -m "feat: robot image component with 3-tier fallback — never broken"
```

---

## Task 5: Rate Limiting

**Files:**
- Create: `lib/cache/rate-limit.ts`
- Modify: `middleware.ts`

- [ ] **Step 1: Install @upstash/ratelimit**

Run: `npm install @upstash/ratelimit`

- [ ] **Step 2: Create rate limit configuration**

Create `lib/cache/rate-limit.ts`:

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Use same Redis instance as cache
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const redis = getRedis();

/** General API rate limit: 100 requests per minute per IP */
export const apiRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 m"),
      prefix: "rl:api",
    })
  : null;

/** Robotimus chat: 20 messages per minute per IP */
export const robotimusRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 m"),
      prefix: "rl:robotimus",
    })
  : null;

/** Job posting: 5 per hour per IP */
export const jobPostingRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      prefix: "rl:jobs",
    })
  : null;

/** Bid submission: 10 per hour per IP */
export const bidRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 h"),
      prefix: "rl:bids",
    })
  : null;
```

- [ ] **Step 3: Add rate limiting to middleware**

Read existing `middleware.ts` first. Then add API rate limiting. The existing middleware handles auth routes. Add rate limiting for `/api/` routes before the existing logic:

Add at the top of the middleware function, before existing logic:

```typescript
import { apiRateLimit } from "@/lib/cache/rate-limit";

// In the middleware function, at the top:
if (request.nextUrl.pathname.startsWith("/api/")) {
  if (apiRateLimit) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
    const { success, limit, remaining, reset } = await apiRateLimit.limit(ip);

    if (!success) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      });
    }
  }
}
```

Note: The middleware must be updated carefully — read the existing file, understand the matcher config, and integrate cleanly. The rate limit code goes at the top of the function before existing route matching.

- [ ] **Step 4: Commit**

```bash
git add lib/cache/rate-limit.ts middleware.ts package.json package-lock.json
git commit -m "feat: API rate limiting via Upstash — 100/min general, 20/min Robotimus"
```

---

## Task 6: Database Performance Indexes

**Files:**
- Create: `supabase/migrations/029_performance_indexes.sql`

- [ ] **Step 1: Write the migration**

```sql
-- 029_performance_indexes.sql
-- Performance indexes for common query patterns

-- Robot browsing (most common query — category + score sort)
CREATE INDEX IF NOT EXISTS idx_robots_category_score
ON robots(category_id, robo_score DESC NULLS LAST)
WHERE status = 'active';

-- Robot price filtering
CREATE INDEX IF NOT EXISTS idx_robots_price
ON robots(price_current)
WHERE status = 'active' AND price_current IS NOT NULL;

-- Robot manufacturer browsing
CREATE INDEX IF NOT EXISTS idx_robots_manufacturer_score
ON robots(manufacturer_id, robo_score DESC NULLS LAST)
WHERE status = 'active';

-- Robot text search (name + description)
CREATE INDEX IF NOT EXISTS idx_robots_name_trgm
ON robots USING gin(name gin_trgm_ops);

-- Open job postings (time-sensitive queries)
CREATE INDEX IF NOT EXISTS idx_jobs_status_created
ON robowork_jobs(status, created_at DESC)
WHERE status = 'open';

-- Job market matching (city + state + status)
CREATE INDEX IF NOT EXISTS idx_jobs_market
ON robowork_jobs(city, state, status)
WHERE status = 'open';

-- RSP market matching (verified providers by location)
CREATE INDEX IF NOT EXISTS idx_rsp_market
ON robot_service_providers(city, state)
WHERE verified = true;

-- RSP specialization matching (GIN index on array)
CREATE INDEX IF NOT EXISTS idx_rsp_specializations
ON robot_service_providers USING gin(specializations);

-- Bid lookup by job
CREATE INDEX IF NOT EXISTS idx_bids_job_status
ON robowork_bids(job_id, status, created_at);

-- Bid lookup by RSP
CREATE INDEX IF NOT EXISTS idx_bids_rsp
ON robowork_bids(rsp_id, created_at DESC);

-- Fleet status by RSP
CREATE INDEX IF NOT EXISTS idx_fleet_rsp_status
ON rsp_fleet_status(rsp_id, status);

-- Newsletter subscribers (for digest queries)
CREATE INDEX IF NOT EXISTS idx_newsletter_active
ON newsletter_subscribers(active, created_at DESC)
WHERE active = true;
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/029_performance_indexes.sql
git commit -m "feat: database performance indexes for robots, jobs, RSPs, bids"
```

---

## Task 7: Build Verification & Push

**Files:** None new.

- [ ] **Step 1: Run full build**

Run: `npm run build 2>&1 | tail -20`
Expected: Clean build.

- [ ] **Step 2: Check for errors**

Run: `npm run build 2>&1 | grep -iE "error|type error|fail" | head -10`
Expected: No output.

- [ ] **Step 3: Push**

```bash
git push origin main
```
