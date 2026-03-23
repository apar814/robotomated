"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RobotInfo { id: string; name: string; slug: string; images: { url: string; alt: string }[] }

export default function AdminRobotImagesPage() {
  const params = useParams();
  const robotId = params.id as string;
  const [robot, setRobot] = useState<RobotInfo | null>(null);
  const [images, setImages] = useState<{ url: string; alt: string }[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/admin/robot-images?id=${robotId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.robot) {
          setRobot(data.robot);
          setImages(data.robot.images || []);
        }
      });
  }, [robotId]);

  function addImage() {
    if (!newUrl.trim()) return;
    const img = { url: newUrl.trim(), alt: newAlt.trim() || `${robot?.name} product photo` };
    setImages([...images, img]);
    setNewUrl("");
    setNewAlt("");
    setPreview(null);
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const newImages = [...images];
    const target = index + direction;
    if (target < 0 || target >= newImages.length) return;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
    setImages(newImages);
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/robot-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: robotId, images }),
      });
      if (res.ok) setMessage("Images saved!");
      else setMessage("Failed to save");
    } catch {
      setMessage("Error saving");
    }
    setSaving(false);
  }

  if (!robot) return <div className="py-20 text-center text-white/30">Loading...</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-2 flex items-center gap-2 text-sm text-white/40">
        <Link href="/admin" className="hover:text-white">Admin</Link>
        <span>/</span>
        <Link href={`/admin/robots/${robotId}/edit`} className="hover:text-white">{robot.name}</Link>
        <span>/</span>
        <span className="text-white/60">Images</span>
      </div>
      <h1 className="mb-6 font-display text-2xl font-bold">Manage Images: {robot.name}</h1>

      {/* Current images */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">Current Images ({images.length})</h2>
        {images.length === 0 ? (
          <div className="glass-card p-8 text-center text-white/30">No images yet. Add a product photo URL below.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {images.map((img, i) => (
              <div key={`${img.url}-${i}`} className="glass-card overflow-hidden">
                <div className="relative h-48">
                  <Image src={img.url} alt={img.alt} fill sizes="50vw" className="object-cover" unoptimized />
                  {i === 0 && (
                    <span className="absolute left-2 top-2 rounded bg-blue/80 px-2 py-0.5 text-[10px] font-bold text-navy">PRIMARY</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-white/40">{img.url}</p>
                    <p className="text-[10px] text-white/25">{img.alt}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => moveImage(i, -1)} disabled={i === 0} className="rounded p-1 text-white/30 hover:text-white disabled:opacity-20">&#9650;</button>
                    <button onClick={() => moveImage(i, 1)} disabled={i === images.length - 1} className="rounded p-1 text-white/30 hover:text-white disabled:opacity-20">&#9660;</button>
                    <button onClick={() => removeImage(i)} className="rounded p-1 text-white/30 hover:text-orange">&#10005;</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new image */}
      <div className="glass-card p-5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">Add Image</h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-white/40">Image URL</label>
            <input
              type="url"
              value={newUrl}
              onChange={(e) => { setNewUrl(e.target.value); setPreview(null); }}
              placeholder="https://manufacturer.com/product-photo.webp"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/40">Alt text (optional)</label>
            <input
              type="text"
              value={newAlt}
              onChange={(e) => setNewAlt(e.target.value)}
              placeholder="Product photo description"
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-blue focus:outline-none"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setPreview(newUrl)} disabled={!newUrl.trim()}>
              Preview
            </Button>
            <Button onClick={addImage} disabled={!newUrl.trim()}>
              Add Image
            </Button>
          </div>

          {preview && (
            <div className="mt-3 overflow-hidden rounded-lg border border-white/[0.08]">
              <div className="relative h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="h-full w-full object-cover" onError={() => setPreview(null)} />
              </div>
              <p className="px-3 py-2 text-xs text-green">Image loads successfully</p>
            </div>
          )}
        </div>
      </div>

      {/* Save */}
      <div className="mt-6 flex items-center gap-4">
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save All Images"}
        </Button>
        {message && <span className={`text-sm ${message.includes("saved") ? "text-green" : "text-orange"}`}>{message}</span>}
      </div>

      <div className="mt-8 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
        <h3 className="mb-2 text-xs font-semibold text-white/40">Tips</h3>
        <ul className="space-y-1 text-xs text-white/25">
          <li>Use official product images from manufacturer websites</li>
          <li>First image is the PRIMARY image shown on cards and hero</li>
          <li>Recommended: .webp or .jpg, at least 600px wide</li>
          <li>Check the manufacturer press kit for high-res product renders</li>
        </ul>
      </div>
    </div>
  );
}
