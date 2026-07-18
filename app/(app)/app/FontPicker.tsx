"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  fontLibrary,
  fontCategoryLabels,
  findFont,
  type FontCategory,
  type FontDef,
} from "./fonts";

type Props = {
  currentKey: string;
  onChange: (key: string) => void;
  align?: "left" | "right";
};

export function FontPicker({ currentKey, onChange, align = "left" }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<FontCategory | "all">("all");
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const current = findFont(currentKey);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fontLibrary.filter((f) => {
      if (cat !== "all" && f.category !== cat) return false;
      if (q && !f.label.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, cat]);

  const categories = ["all", "serif", "display", "sans", "mono"] as const;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg text-parchment-200 font-sans"
        style={{
          padding: "5px 10px",
          fontSize: 12,
          background: "var(--pill-bg)",
          border: "1px solid var(--hairline)",
          minWidth: 140,
        }}
        title={`Police : ${current.label}`}
      >
        <span
          className="truncate flex-1 text-left"
          style={{ fontFamily: current.css, fontSize: 13 }}
        >
          {current.label}
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="opacity-60 flex-shrink-0">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute z-40 rounded-2xl overflow-hidden"
            style={{
              top: "calc(100% + 6px)",
              [align === "right" ? "right" : "left"]: 0,
              width: 320,
              maxHeight: 420,
              display: "flex",
              flexDirection: "column",
              background: "var(--surface-glass-strong)",
              border:
                "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
              boxShadow: "var(--shadow-palette)",
            }}
          >
            {/* Search */}
            <div
              className="flex items-center gap-2"
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid var(--hairline-soft)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="text-parchment-400">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3-3" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Chercher une police…"
                className="flex-1 bg-transparent outline-none text-parchment-100 placeholder:text-parchment-500 font-sans"
                style={{ fontSize: 13 }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-parchment-500 hover:text-parchment-200"
                  style={{ fontSize: 11 }}
                >
                  clear
                </button>
              )}
            </div>

            {/* Category tabs */}
            <div
              className="flex gap-1"
              style={{
                padding: "8px 10px",
                borderBottom: "1px solid var(--hairline-soft)",
              }}
            >
              {categories.map((c) => {
                const active = cat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className="rounded-full font-sans"
                    style={{
                      padding: "3px 10px",
                      fontSize: 11,
                      color: active
                        ? "var(--color-parchment-50)"
                        : "var(--color-parchment-400)",
                      background: active ? "var(--accent-tint-strong)" : "transparent",
                      border: active
                        ? "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
                        : "1px solid var(--hairline-veil)",
                    }}
                  >
                    {fontCategoryLabels[c]}
                  </button>
                );
              })}
            </div>

            {/* List */}
            <div style={{ overflowY: "auto", padding: "4px 6px 10px" }}>
              {filtered.length === 0 && (
                <div
                  className="text-center text-parchment-500 font-sans italic"
                  style={{ padding: "16px 12px", fontSize: 13 }}
                >
                  Rien trouvé.
                </div>
              )}
              {filtered.map((f) => (
                <FontRow
                  key={f.key}
                  font={f}
                  active={f.key === currentKey}
                  onSelect={() => {
                    onChange(f.key);
                    setOpen(false);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FontRow({
  font,
  active,
  onSelect,
}: {
  font: FontDef;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-baseline gap-3 rounded-lg text-left"
      style={{
        padding: "8px 12px",
        background: active ? "var(--accent-tint)" : "transparent",
        border: active
          ? "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)"
          : "1px solid transparent",
      }}
    >
      <span
        className="text-parchment-100"
        style={{ fontFamily: font.css, fontSize: 20, lineHeight: 1 }}
      >
        Aa
      </span>
      <span className="flex-1 flex flex-col">
        <span
          className="text-parchment-100 font-sans"
          style={{ fontSize: 13 }}
        >
          {font.label}
        </span>
        <span
          className="text-parchment-400"
          style={{
            fontFamily: font.css,
            fontSize: 11,
            lineHeight: 1.3,
          }}
        >
          The quick brown fox jumps.
        </span>
      </span>
      <span
        className="text-parchment-500 font-sans uppercase tabular-nums"
        style={{ fontSize: 9, letterSpacing: "0.1em" }}
      >
        {font.category}
      </span>
    </button>
  );
}
