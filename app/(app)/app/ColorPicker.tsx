"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

function CustomColorInput({
  currentColor,
  kind,
  onCommit,
}: {
  currentColor?: string;
  kind: Kind;
  onCommit: (c: string) => void;
}) {
  const [hex, setHex] = useState(() => normalizeHex(currentColor) || "#b46a26");

  useEffect(() => {
    const nh = normalizeHex(currentColor);
    if (nh) setHex(nh);
  }, [currentColor]);

  return (
    <div className="flex items-center gap-2">
      <label
        className="rounded-md overflow-hidden flex-shrink-0 relative cursor-pointer"
        style={{
          width: 34,
          height: 30,
          background: hex,
          border: "1px solid var(--hairline)",
        }}
        title="Palette système"
      >
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>
      <input
        type="text"
        value={hex}
        onChange={(e) => setHex(e.target.value)}
        placeholder="#b46a26"
        className="flex-1 rounded-md bg-transparent outline-none text-parchment-100 font-mono uppercase"
        style={{
          padding: "6px 8px",
          fontSize: 12,
          background: "var(--pill-bg)",
          border: "1px solid var(--hairline)",
        }}
      />
      <button
        type="button"
        onClick={() => {
          const final = normalizeHex(hex);
          if (!final) return;
          onCommit(
            kind === "highlight"
              ? hexToRgba(final, 0.32)
              : final,
          );
        }}
        className="rounded-md font-sans"
        style={{
          padding: "6px 10px",
          fontSize: 11,
          color: "#1a0d09",
          background: "linear-gradient(180deg, #f6d194 0%, #e59a3f 100%)",
        }}
      >
        OK
      </button>
    </div>
  );
}

function normalizeHex(v?: string): string {
  if (!v) return "";
  const m = v.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return "";
  const hex = m[1].length === 3 ? m[1].split("").map((c) => c + c).join("") : m[1];
  return "#" + hex.toLowerCase();
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

type Kind = "text" | "highlight";

const swatches = {
  text: [
    { key: "default", value: null, label: "Défaut" },
    { key: "ember", value: "#b46a26", label: "Cuivre" },
    { key: "gold", value: "#a06614", label: "Ambre profond" },
    { key: "burgundy", value: "#7a2a2a", label: "Bordeaux" },
    { key: "pine", value: "#2f5b3f", label: "Pin" },
    { key: "slate", value: "#3d4552", label: "Ardoise" },
    { key: "midnight", value: "#1a1f3a", label: "Nuit" },
    { key: "mute", value: "#8a7358", label: "Sépia" },
  ],
  highlight: [
    { key: "clear", value: null, label: "Aucun" },
    { key: "amber", value: "rgba(214,138,60,0.30)", label: "Ambre" },
    { key: "gold", value: "rgba(220,180,80,0.32)", label: "Or" },
    { key: "rose", value: "rgba(220,120,120,0.28)", label: "Rose" },
    { key: "moss", value: "rgba(120,180,120,0.28)", label: "Mousse" },
    { key: "sky", value: "rgba(120,170,220,0.28)", label: "Ciel" },
    { key: "lavender", value: "rgba(180,140,220,0.28)", label: "Lavande" },
    { key: "cream", value: "rgba(230,220,180,0.35)", label: "Crème" },
  ],
};

type Props = {
  kind: Kind;
  currentColor?: string | null;
  onPick: (color: string | null) => void;
  buttonLabel?: React.ReactNode;
  title?: string;
};

export function ColorPicker({ kind, currentColor, onPick, buttonLabel, title }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const list = swatches[kind];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title={title}
        className="rounded-md flex items-center justify-center text-parchment-300 hover:text-parchment-100"
        style={{
          width: 30,
          height: 26,
          background: "transparent",
        }}
      >
        {buttonLabel}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-40 rounded-2xl overflow-hidden"
            style={{
              top: "calc(100% + 6px)",
              left: 0,
              padding: 10,
              background: "var(--surface-glass-strong)",
              border:
                "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
              boxShadow: "var(--shadow-palette)",
              width: 210,
            }}
          >
            <div
              className="text-[10px] uppercase tracking-widest text-parchment-500 font-sans mb-2"
            >
              {kind === "text" ? "Couleur du texte" : "Surligneur"}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {list.map((s) => {
                const active =
                  (currentColor ?? null) === (s.value ?? null);
                return (
                  <button
                    key={s.key}
                    onClick={() => {
                      onPick(s.value);
                      setOpen(false);
                    }}
                    title={s.label}
                    className="relative rounded-lg flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 32,
                      background: s.value ?? "transparent",
                      border: active
                        ? "2px solid color-mix(in oklab, var(--color-ember-500) 50%, transparent)"
                        : "1px solid var(--hairline)",
                    }}
                  >
                    {s.value === null && (
                      <span
                        className="text-parchment-400 font-sans"
                        style={{ fontSize: 10 }}
                      >
                        ∅
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom color — exact choice via hex or native picker */}
            <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--hairline-soft)" }}>
              <div
                className="text-[10px] uppercase tracking-widest text-parchment-500 font-sans mb-2"
              >
                Couleur exacte
              </div>
              <CustomColorInput
                currentColor={currentColor ?? undefined}
                kind={kind}
                onCommit={(c) => {
                  onPick(c);
                  setOpen(false);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
