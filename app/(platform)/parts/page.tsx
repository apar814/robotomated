import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Robot Parts Marketplace — Find OEM & Aftermarket Parts | Robotomated",
  description:
    "Search OEM and aftermarket robot parts. Find motors, sensors, grippers, controllers, and more with fast shipping.",
};

const FILTER_OPTIONS = {
  condition: ["New", "Refurbished", "Used - Like New", "Used - Good"],
  priceRange: ["Under $100", "$100-$500", "$500-$2,000", "$2,000-$10,000", "$10,000+"],
  location: ["North America", "Europe", "Asia Pacific", "Global Shipping"],
} as const;

function PartsSearchBar() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <input
        type="text"
        placeholder="Search parts by name, part number, or robot model..."
        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
      />
      <button
        type="button"
        className="rounded-lg bg-[#00C2FF] px-8 py-3 font-display font-semibold text-[#0A0F1E] transition-colors hover:bg-[#00C2FF]/80"
      >
        Search
      </button>
    </div>
  );
}

function ListPartForm() {
  return (
    <form
      action="/api/parts"
      method="POST"
      className="grid gap-6 sm:grid-cols-2"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="part_name" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Part Name
        </label>
        <input
          id="part_name"
          name="part_name"
          type="text"
          required
          placeholder="e.g. Servo Motor, Gripper Assembly"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="part_number" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Part Number
        </label>
        <input
          id="part_number"
          name="part_number"
          type="text"
          placeholder="OEM or aftermarket part number"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="compatible_robots"
          className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
        >
          Compatible Robots
        </label>
        <input
          id="compatible_robots"
          name="compatible_robots"
          type="text"
          required
          placeholder="e.g. Fanuc CRX-10iA, UR10e"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="condition" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Condition
        </label>
        <select
          id="condition"
          name="condition"
          required
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-[#00C2FF] focus:outline-none"
        >
          <option value="">Select condition</option>
          {FILTER_OPTIONS.condition.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="price" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Price (USD)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="0.00"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="seller_location" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Location
        </label>
        <input
          id="seller_location"
          name="seller_location"
          type="text"
          required
          placeholder="City, State"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <label
          htmlFor="part_description"
          className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted"
        >
          Description
        </label>
        <textarea
          id="part_description"
          name="description"
          rows={3}
          required
          placeholder="Describe the part, its condition, and any relevant details..."
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="seller_email" className="font-[family-name:var(--font-ui)] text-[11px] font-medium uppercase tracking-[0.08em] text-muted">
          Contact Email
        </label>
        <input
          id="seller_email"
          name="seller_email"
          type="email"
          required
          placeholder="you@company.com"
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#00C2FF] focus:outline-none"
        />
      </div>

      <div className="flex items-end">
        <button
          type="submit"
          className="w-full rounded-lg bg-[#00E5A0] px-8 py-3 font-display font-semibold text-[#0A0F1E] transition-colors hover:bg-[#00E5A0]/80"
        >
          List Part
        </button>
      </div>
    </form>
  );
}

export default function PartsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Parts", href: "/parts" },
        ]}
      />

      <section className="mt-8 text-center">
        <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">
          [ PARTS MARKETPLACE ]
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Find the exact part. Fast.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
          Search OEM and aftermarket parts from verified sellers. Motors,
          sensors, grippers, controllers, and everything in between.
        </p>
      </section>

      <section className="mt-12">
        <PartsSearchBar />

        <div className="mt-6 flex flex-wrap gap-3">
          {FILTER_OPTIONS.condition.map((c) => (
            <button
              key={c}
              type="button"
              className="rounded-full border border-white/10 px-4 py-1.5 font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-[#00C2FF] hover:text-white"
            >
              {c}
            </button>
          ))}
          {FILTER_OPTIONS.priceRange.map((p) => (
            <button
              key={p}
              type="button"
              className="rounded-full border border-white/10 px-4 py-1.5 font-[family-name:var(--font-ui)] text-[11px] uppercase tracking-[0.08em] text-muted transition-colors hover:border-[#00C2FF] hover:text-white"
            >
              {p}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="glass col-span-full flex flex-col items-center justify-center rounded-xl border border-white/10 py-20 text-center">
            <div className="text-4xl text-white/20">--</div>
            <h3 className="mt-4 font-display text-lg font-semibold text-white/60">
              No parts listed yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted">
              Be the first to list a part on the Robotomated marketplace. Reach
              thousands of robot operators looking for quality components.
            </p>
            <a
              href="#list"
              className="mt-6 rounded-lg bg-[#00C2FF] px-6 py-2.5 font-display text-sm font-semibold text-[#0A0F1E] transition-colors hover:bg-[#00C2FF]/80"
            >
              List a Part
            </a>
          </div>
        </div>
      </section>

      <section id="list" className="mt-20">
        <div className="glass rounded-2xl border border-white/10 p-8 sm:p-12">
          <p className="font-[family-name:var(--font-brand)] text-[10px] font-medium uppercase tracking-[0.15em] text-[#0EA5E9]">
            [ SELLER PORTAL ]
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white">
            List a Part
          </h2>
          <p className="mt-2 text-muted">
            Sell your spare parts to the robotics community. Free to list.
          </p>
          <div className="mt-8">
            <ListPartForm />
          </div>
        </div>
      </section>
    </main>
  );
}
