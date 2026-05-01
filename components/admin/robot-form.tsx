"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RoboScoreRing, ScoreBar } from "@/components/ui/robo-score";
import { DIMENSIONS, calculateRoboScore } from "@/lib/scoring/roboscore";
import type { RoboScoreBreakdown } from "@/lib/supabase/types";

interface Category { id: string; name: string }
interface Manufacturer { id: string; name: string }

interface RobotFormData {
  id?: string;
  slug: string;
  name: string;
  manufacturer_id: string;
  category_id: string;
  model_number: string;
  year_released: string;
  price_msrp: string;
  price_current: string;
  description_short: string;
  description_long: string;
  affiliate_url: string;
  amazon_asin: string;
  status: "active" | "discontinued" | "coming_soon";
  specs: { key: string; value: string }[];
  images: { url: string; alt: string }[];
  scores: Record<string, number>;
}

const defaultForm: RobotFormData = {
  slug: "", name: "", manufacturer_id: "", category_id: "",
  model_number: "", year_released: "", price_msrp: "", price_current: "",
  description_short: "", description_long: "", affiliate_url: "", amazon_asin: "",
  status: "active",
  specs: [{ key: "", value: "" }],
  images: [{ url: "", alt: "" }],
  scores: Object.fromEntries(DIMENSIONS.map((d) => [d.key, 75])),
};

interface Props {
  initialData?: Partial<RobotFormData> & { id?: string };
  mode: "create" | "edit";
}

export function RobotForm({ initialData, mode }: Props) {
  const [form, setForm] = useState<RobotFormData>({ ...defaultForm, ...initialData });
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/robots?perPage=0").catch(() => {});
    // Fetch categories and manufacturers
    Promise.all([
      fetch("/api/admin/meta?type=categories").then((r) => r.json()),
      fetch("/api/admin/meta?type=manufacturers").then((r) => r.json()),
    ]).then(([cats, mfrs]) => {
      setCategories(cats.data || []);
      setManufacturers(mfrs.data || []);
    }).catch(() => {});
  }, []);

  function updateField(key: keyof RobotFormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "name" && mode === "create" && !form.slug) {
      setForm((prev) => ({
        ...prev,
        [key]: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      }));
    }
  }

  function addSpec() {
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: "", value: "" }] }));
  }

  function updateSpec(i: number, field: "key" | "value", val: string) {
    setForm((prev) => {
      const specs = [...prev.specs];
      specs[i] = { ...specs[i], [field]: val };
      return { ...prev, specs };
    });
  }

  function removeSpec(i: number) {
    setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, j) => j !== i) }));
  }

  function addImage() {
    if (form.images.length >= 10) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, { url: "", alt: "" }] }));
  }

  function updateImage(i: number, field: "url" | "alt", val: string) {
    setForm((prev) => {
      const images = [...prev.images];
      images[i] = { ...images[i], [field]: val };
      return { ...prev, images };
    });
  }

  function removeImage(i: number) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, j) => j !== i) }));
  }

  function updateScore(key: string, val: number) {
    setForm((prev) => ({ ...prev, scores: { ...prev.scores, [key]: val } }));
  }

  const breakdown: RoboScoreBreakdown = {
    performance: form.scores.performance || 0,
    reliability: form.scores.reliability || 0,
    ease_of_use: form.scores.ease_of_use || 0,
    intelligence: form.scores.intelligence || 0,
    value: form.scores.value || 0,
    ecosystem: form.scores.ecosystem || 0,
    safety: form.scores.safety || 0,
    design: form.scores.design || 0,
  };

  let roboScore = 0;
  try { roboScore = calculateRoboScore(breakdown); } catch { /* */ }

  async function handleSubmit() {
    if (!form.name || !form.slug || !form.manufacturer_id || !form.category_id) {
      setError("Name, slug, manufacturer, and category are required");
      return;
    }

    setStatus("saving");
    setError("");

    const specsObj: Record<string, unknown> = {};
    for (const s of form.specs) {
      if (s.key.trim()) {
        const numVal = Number(s.value);
        specsObj[s.key.trim()] = s.value === "true" ? true : s.value === "false" ? false : !isNaN(numVal) && s.value.trim() !== "" ? numVal : s.value;
      }
    }

    const payload = {
      ...(form.id && { id: form.id }),
      slug: form.slug,
      name: form.name,
      manufacturer_id: form.manufacturer_id,
      category_id: form.category_id,
      model_number: form.model_number || null,
      year_released: form.year_released ? parseInt(form.year_released) : null,
      price_msrp: form.price_msrp ? parseFloat(form.price_msrp) : null,
      price_current: form.price_current ? parseFloat(form.price_current) : null,
      description_short: form.description_short || null,
      description_long: form.description_long || null,
      affiliate_url: form.affiliate_url || null,
      amazon_asin: form.amazon_asin || null,
      status: form.status,
      specs: specsObj,
      images: form.images.filter((img) => img.url.trim()),
      robo_score: roboScore,
      score_breakdown: breakdown,
    };

    try {
      const res = await fetch("/api/admin/robots", {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold" style={{ color: "var(--status-success-text, #6B8AB8)" }}>
          Robot {mode === "create" ? "Created" : "Updated"}!
        </h2>
        <p className="mt-2 text-muted">
          <a href={`/explore/all/${form.slug}`} className="text-white hover:underline">View robot page</a>
          {" | "}
          <button onClick={() => setStatus("idle")} className="text-white hover:underline">
            {mode === "create" ? "Add another" : "Continue editing"}
          </button>
        </p>
      </div>
    );
  }

  if (preview) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Preview</h2>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setPreview(false)}>Back to Edit</Button>
            <Button onClick={handleSubmit} disabled={status === "saving"}>
              {status === "saving" ? "Saving..." : mode === "create" ? "Create Robot" : "Save Changes"}
            </Button>
          </div>
        </div>
        {error && <p className="mb-4 text-sm text-orange">{error}</p>}

        <div className="rounded-xl border border-border bg-navy-light p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">{manufacturers.find((m) => m.id === form.manufacturer_id)?.name}</p>
              <h1 className="text-2xl font-bold">{form.name}</h1>
              {form.model_number && <p className="mt-1 font-mono text-xs text-muted">Model: {form.model_number}</p>}
            </div>
            <RoboScoreRing score={roboScore} size={90} />
          </div>
          <p className="mt-4 text-sm text-muted">{form.description_short}</p>
          {form.price_current && (
            <p className="mt-2 font-mono text-xl font-bold">${parseFloat(form.price_current).toLocaleString()}</p>
          )}
          <div className="mt-6 max-w-md space-y-2">
            {DIMENSIONS.map((d) => (
              <ScoreBar key={d.key} label={d.label} score={breakdown[d.key]} weight={`${Math.round(d.weight * 100)}%`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Robot Name *" value={form.name} onChange={(v) => updateField("name", v)} />
          <Field label="Slug *" value={form.slug} onChange={(v) => updateField("slug", v)} mono />
          <SelectField label="Manufacturer *" value={form.manufacturer_id} onChange={(v) => updateField("manufacturer_id", v)} options={manufacturers.map((m) => ({ value: m.id, label: m.name }))} />
          <SelectField label="Category *" value={form.category_id} onChange={(v) => updateField("category_id", v)} options={categories.map((c) => ({ value: c.id, label: c.name }))} />
          <Field label="Model Number" value={form.model_number} onChange={(v) => updateField("model_number", v)} />
          <Field label="Year Released" value={form.year_released} onChange={(v) => updateField("year_released", v)} type="number" />
          <SelectField label="Status" value={form.status} onChange={(v) => updateField("status", v)} options={[
            { value: "active", label: "Active" },
            { value: "discontinued", label: "Discontinued" },
            { value: "coming_soon", label: "Coming Soon" },
          ]} />
        </div>
      </Section>

      {/* Descriptions */}
      <Section title="Descriptions">
        <Field label="Short Description" value={form.description_short} onChange={(v) => updateField("description_short", v)} />
        <div className="mt-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">Long Description</label>
          <textarea
            value={form.description_long}
            onChange={(e) => updateField("description_long", e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground focus:border-white/50 focus:outline-none"
          />
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing & Affiliate">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="MSRP ($)" value={form.price_msrp} onChange={(v) => updateField("price_msrp", v)} type="number" />
          <Field label="Current Price ($)" value={form.price_current} onChange={(v) => updateField("price_current", v)} type="number" />
          <Field label="Affiliate URL" value={form.affiliate_url} onChange={(v) => updateField("affiliate_url", v)} />
          <Field label="Amazon ASIN" value={form.amazon_asin} onChange={(v) => updateField("amazon_asin", v)} mono />
        </div>
      </Section>

      {/* Specs */}
      <Section title="Specifications">
        <div className="space-y-2">
          {form.specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input value={spec.key} onChange={(e) => updateSpec(i, "key", e.target.value)} placeholder="Spec name" className="flex-1 rounded-lg border border-border bg-navy-lighter px-3 py-2 text-sm text-foreground focus:border-white/50 focus:outline-none" />
              <input value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="Value" className="flex-1 rounded-lg border border-border bg-navy-lighter px-3 py-2 text-sm text-foreground focus:border-white/50 focus:outline-none" />
              <button onClick={() => removeSpec(i)} className="px-2 text-muted hover:text-orange" aria-label="Remove">&times;</button>
            </div>
          ))}
          <button onClick={addSpec} className="text-sm text-white hover:underline">+ Add spec</button>
        </div>
      </Section>

      {/* Images */}
      <Section title="Images (up to 10)">
        <div className="space-y-2">
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input value={img.url} onChange={(e) => updateImage(i, "url", e.target.value)} placeholder="Image URL" className="flex-1 rounded-lg border border-border bg-navy-lighter px-3 py-2 text-sm text-foreground focus:border-white/50 focus:outline-none" />
              <input value={img.alt} onChange={(e) => updateImage(i, "alt", e.target.value)} placeholder="Alt text" className="w-40 rounded-lg border border-border bg-navy-lighter px-3 py-2 text-sm text-foreground focus:border-white/50 focus:outline-none" />
              <button onClick={() => removeImage(i)} className="px-2 text-muted hover:text-orange">&times;</button>
            </div>
          ))}
          {form.images.length < 10 && (
            <button onClick={addImage} className="text-sm text-white hover:underline">+ Add image</button>
          )}
        </div>
      </Section>

      {/* RoboScore */}
      <Section title="RoboScore">
        <div className="grid gap-4 sm:grid-cols-2">
          {DIMENSIONS.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-xs text-muted">{d.label}</label>
              <input type="range" min={0} max={100} value={form.scores[d.key] || 0} onChange={(e) => updateScore(d.key, parseInt(e.target.value))} className="flex-1 accent-white" />
              <input type="number" min={0} max={100} value={form.scores[d.key] || 0} onChange={(e) => updateScore(d.key, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))} className="w-14 rounded border border-border bg-navy-lighter px-2 py-1 text-center font-mono text-xs focus:border-white/50 focus:outline-none" />
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-lg bg-navy-lighter p-3">
          <span className="text-sm font-semibold">Calculated RoboScore: </span>
          <span className="font-mono text-lg font-bold text-white">{roboScore.toFixed(1)}</span>
        </div>
      </Section>

      {error && <p className="text-sm text-orange">{error}</p>}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setPreview(true)}>Preview</Button>
        <Button onClick={handleSubmit} disabled={status === "saving"}>
          {status === "saving" ? "Saving..." : mode === "create" ? "Create Robot" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-navy-light p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", mono }: { label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground focus:border-white/50 focus:outline-none ${mono ? "font-mono" : ""}`} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-border bg-navy-lighter px-3 py-2.5 text-sm text-foreground focus:border-white/50 focus:outline-none">
        <option value="">Select...</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
