"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

const CSV_TEMPLATE = `slug,name,manufacturer_id,category_id,model_number,year_released,price_msrp,price_current,description_short,status,affiliate_url,amazon_asin
my-robot,My Robot Name,MANUFACTURER_UUID,CATEGORY_UUID,MODEL-001,2024,5000,4500,Short description of the robot,active,https://example.com/buy,B0XXXXXXXX`;

interface ParsedRow {
  index: number;
  data: Record<string, string>;
  errors: string[];
}

const REQUIRED_FIELDS = ["slug", "name", "manufacturer_id", "category_id"];

export default function AdminImportPage() {
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [step, setStep] = useState<"upload" | "validate" | "importing" | "done">("upload");
  const [results, setResults] = useState<{ success: number; errors: string[] }>({ success: 0, errors: [] });
  const fileRef = useRef<HTMLInputElement>(null);

  function downloadTemplate() {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "robotomated-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) return;

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const parsed: ParsedRow[] = [];

      for (let i = 1; i < lines.length && i <= 101; i++) {
        const values = parseCSVLine(lines[i]);
        const data: Record<string, string> = {};
        headers.forEach((h, j) => { data[h] = values[j]?.trim() || ""; });

        const errors: string[] = [];
        for (const f of REQUIRED_FIELDS) {
          if (!data[f]) errors.push(`Missing ${f}`);
        }

        parsed.push({ index: i, data, errors });
      }

      setRows(parsed);
      setStep("validate");
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    const validRows = rows.filter((r) => r.errors.length === 0);
    if (validRows.length === 0) return;

    setStep("importing");

    const robots = validRows.map((r) => {
      const d = r.data;
      return {
        slug: d.slug,
        name: d.name,
        manufacturer_id: d.manufacturer_id,
        category_id: d.category_id,
        model_number: d.model_number || null,
        year_released: d.year_released ? parseInt(d.year_released) : null,
        price_msrp: d.price_msrp ? parseFloat(d.price_msrp) : null,
        price_current: d.price_current ? parseFloat(d.price_current) : null,
        description_short: d.description_short || null,
        status: d.status || "active",
        affiliate_url: d.affiliate_url || null,
        amazon_asin: d.amazon_asin || null,
      };
    });

    try {
      const res = await fetch("/api/admin/robots", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robots }),
      });
      const data = await res.json();
      setResults({ success: data.success || 0, errors: data.errors || [] });
    } catch {
      setResults({ success: 0, errors: ["Import failed"] });
    }

    setStep("done");
  }

  const validCount = rows.filter((r) => r.errors.length === 0).length;
  const errorCount = rows.filter((r) => r.errors.length > 0).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">Bulk Import Robots</h1>
      <p className="mb-8 text-sm text-muted">Upload a CSV file with up to 100 robots.</p>

      {step === "upload" && (
        <div className="space-y-6">
          <Button variant="secondary" onClick={downloadTemplate}>
            Download CSV Template
          </Button>

          <div
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-border bg-navy-light p-12 text-center transition-colors hover:border-blue/30"
          >
            <p className="text-muted">Click to upload CSV file</p>
            <p className="mt-1 text-xs text-muted">Max 100 rows</p>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
          </div>
        </div>
      )}

      {step === "validate" && (
        <div>
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm text-green">{validCount} valid</span>
            {errorCount > 0 && <span className="text-sm text-orange">{errorCount} with errors</span>}
            <span className="text-sm text-muted">{rows.length} total rows</span>
          </div>

          <div className="mb-6 max-h-96 overflow-auto rounded-xl border border-border">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-navy-lighter">
                <tr>
                  <th className="px-3 py-2 text-left text-muted">#</th>
                  <th className="px-3 py-2 text-left text-muted">Name</th>
                  <th className="px-3 py-2 text-left text-muted">Slug</th>
                  <th className="px-3 py-2 text-left text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.index} className={row.errors.length > 0 ? "bg-orange/5" : "bg-navy-light"}>
                    <td className="px-3 py-2">{row.index}</td>
                    <td className="px-3 py-2">{row.data.name}</td>
                    <td className="px-3 py-2 font-mono">{row.data.slug}</td>
                    <td className="px-3 py-2">
                      {row.errors.length > 0 ? (
                        <span className="text-orange">{row.errors.join(", ")}</span>
                      ) : (
                        <span className="text-green">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => { setRows([]); setStep("upload"); }}>
              Upload Different File
            </Button>
            <Button onClick={handleImport} disabled={validCount === 0}>
              Import {validCount} Robots
            </Button>
          </div>
        </div>
      )}

      {step === "importing" && (
        <div className="py-20 text-center text-muted">Importing robots...</div>
      )}

      {step === "done" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-green/20 bg-green/5 p-6">
            <p className="text-lg font-semibold text-green">{results.success} robots imported successfully</p>
          </div>
          {results.errors.length > 0 && (
            <div className="rounded-xl border border-orange/20 bg-orange/5 p-6">
              <p className="mb-2 font-semibold text-orange">{results.errors.length} errors:</p>
              <ul className="max-h-48 space-y-1 overflow-auto text-xs text-muted">
                {results.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}
          <Button onClick={() => { setRows([]); setStep("upload"); setResults({ success: 0, errors: [] }); }}>
            Import More
          </Button>
        </div>
      )}
    </div>
  );
}

/** Simple CSV line parser handling quoted fields */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current);
  return result;
}
