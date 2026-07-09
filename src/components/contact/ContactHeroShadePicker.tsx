"use client";

import { useEffect, useState } from "react";
import {
  contactHeroShades,
  defaultContactHeroShade,
  previewBodyClass,
  type ContactHeroShadeId,
} from "@/lib/contact-hero-shades";

const STORAGE_KEY = "pelagic-contact-hero-shade-v2";

type ContactHeroShadePickerProps = {
  value: ContactHeroShadeId;
  onChange: (id: ContactHeroShadeId) => void;
};

function ShadeGrid({
  shades,
  value,
  onChange,
  startIndex,
}: {
  shades: typeof contactHeroShades;
  value: ContactHeroShadeId;
  onChange: (id: ContactHeroShadeId) => void;
  startIndex: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {shades.map((shade, index) => {
        const selected = value === shade.id;
        return (
          <button
            key={shade.id}
            type="button"
            onClick={() => onChange(shade.id)}
            className={`overflow-hidden rounded-xl border text-left transition ${
              selected
                ? "border-pelagic-gold ring-2 ring-pelagic-gold/30"
                : "border-pelagic-mist hover:border-pelagic-accent/50"
            }`}
          >
            <div className="h-8" style={{ background: shade.ribbon }} />
            <div className={`h-10 ${previewBodyClass(shade.id)}`} />
            <div className="border-t border-pelagic-mist bg-white p-3">
              <p className="text-xs font-bold text-pelagic-gold">Option {startIndex + index + 1}</p>
              <p className="font-semibold text-pelagic-ink">{shade.label}</p>
              <p className="mt-0.5 text-xs text-pelagic-steel">{shade.tagline}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function ContactHeroShadePicker({ value, onChange }: ContactHeroShadePickerProps) {
  const [open, setOpen] = useState(true);

  const tealGoldShades = contactHeroShades.filter((s) => s.group === "teal-gold");
  const blueShades = contactHeroShades.filter((s) => s.group === "blue");
  const otherShades = contactHeroShades.filter((s) => s.group === "other");

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 max-h-[70vh] overflow-y-auto border-t border-pelagic-mist bg-white/95 shadow-[0_-8px_30px_rgba(26,22,20,0.12)] backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <span>
            <span className="text-xs font-bold uppercase tracking-wider text-pelagic-accent">
              Preview hero themes
            </span>
            <span className="mt-0.5 block text-sm text-pelagic-steel">
              Teal gold themes first — click a swatch to preview live
            </span>
          </span>
          <span className="text-sm font-semibold text-pelagic-gold">{open ? "Hide ↑" : "Show ↓"}</span>
        </button>

        {open && (
          <div className="mt-4 space-y-5">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-teal-700">
                Teal gold themes
              </p>
              <ShadeGrid
                shades={tealGoldShades}
                value={value}
                onChange={onChange}
                startIndex={0}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                Blue gradients
              </p>
              <ShadeGrid
                shades={blueShades}
                value={value}
                onChange={onChange}
                startIndex={tealGoldShades.length}
              />
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-pelagic-steel">
                Other tones
              </p>
              <ShadeGrid
                shades={otherShades}
                value={value}
                onChange={onChange}
                startIndex={tealGoldShades.length + blueShades.length}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function useContactHeroShade() {
  const [shade, setShade] = useState<ContactHeroShadeId>(defaultContactHeroShade);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ContactHeroShadeId | null;
    if (saved && contactHeroShades.some((s) => s.id === saved)) {
      setShade(saved);
    }
  }, []);

  function setAndSave(next: ContactHeroShadeId) {
    setShade(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return [shade, setAndSave] as const;
}
