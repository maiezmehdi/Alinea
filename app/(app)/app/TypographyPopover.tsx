"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FontPicker } from "./FontPicker";

type Props = {
  fontKey: string;
  onFontChange: (key: string) => void;
  fontSize: number;
  onFontSizeChange: (n: number) => void;
  lineHeight: number;
  onLineHeightChange: (n: number) => void;
  maxWidth: number;
  onMaxWidthChange: (n: number) => void;
};

const sizePresets = [12, 14, 16, 17, 18, 20, 24, 28];
const lhPresets = [
  { label: "Simple", value: 1.15 },
  { label: "Confort", value: 1.55 },
  { label: "1½", value: 1.75 },
  { label: "Double", value: 2 },
];

export function TypographyPopover({
  fontKey,
  onFontChange,
  fontSize,
  onFontSizeChange,
  lineHeight,
  onLineHeightChange,
  maxWidth,
  onMaxWidthChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const c = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", c);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", c);
      document.removeEventListener("keydown", k);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg flex items-center justify-center text-parchment-300 hover:text-parchment-100"
        style={{
          width: 32,
          height: 30,
          background: "var(--pill-bg)",
          border: "1px solid var(--hairline)",
        }}
        title="Typographie"
      >
        <span
          className="font-display leading-none"
          style={{ fontSize: 16 }}
        >
          Aa
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute z-40 rounded-2xl overflow-hidden"
            style={{
              top: "calc(100% + 8px)",
              right: 0,
              width: 300,
              padding: 14,
              background: "var(--surface-glass-strong)",
              border:
                "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
              boxShadow: "var(--shadow-palette)",
            }}
          >
            <SectionTitle>Police</SectionTitle>
            <div className="mb-4">
              <FontPicker currentKey={fontKey} onChange={onFontChange} />
            </div>

            <SectionTitle>Taille · {fontSize}px</SectionTitle>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="range"
                min={12}
                max={40}
                value={fontSize}
                onChange={(e) => onFontSizeChange(Number(e.target.value))}
                className="range-slider flex-1"
                style={{ ["--val" as string]: `${((fontSize - 12) / 28) * 100}%` }}
              />
              <input
                type="number"
                min={8}
                max={200}
                value={fontSize}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v) && v >= 8 && v <= 200) onFontSizeChange(v);
                }}
                className="rounded-md bg-transparent outline-none text-parchment-100 text-center font-sans tabular-nums"
                style={{
                  width: 46,
                  padding: "4px 6px",
                  fontSize: 12,
                  background: "var(--pill-bg)",
                  border: "1px solid var(--hairline)",
                }}
              />
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {sizePresets.map((s) => (
                <button
                  key={s}
                  onClick={() => onFontSizeChange(s)}
                  className="rounded-md font-sans tabular-nums"
                  style={{
                    padding: "3px 8px",
                    fontSize: 11,
                    color:
                      s === fontSize
                        ? "var(--color-parchment-50)"
                        : "var(--color-parchment-400)",
                    background:
                      s === fontSize ? "var(--accent-tint)" : "transparent",
                    border:
                      s === fontSize
                        ? "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)"
                        : "1px solid var(--hairline-veil)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <SectionTitle>Interligne · {lineHeight.toFixed(2)}</SectionTitle>
            <div className="flex flex-wrap gap-1 mb-4">
              {lhPresets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => onLineHeightChange(p.value)}
                  className="rounded-md font-sans"
                  style={{
                    padding: "3px 10px",
                    fontSize: 11,
                    color:
                      Math.abs(lineHeight - p.value) < 0.02
                        ? "var(--color-parchment-50)"
                        : "var(--color-parchment-400)",
                    background:
                      Math.abs(lineHeight - p.value) < 0.02
                        ? "var(--accent-tint)"
                        : "transparent",
                    border:
                      Math.abs(lineHeight - p.value) < 0.02
                        ? "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)"
                        : "1px solid var(--hairline-veil)",
                  }}
                >
                  {p.label}
                </button>
              ))}
              <input
                type="number"
                step={0.05}
                min={1}
                max={3}
                value={lineHeight.toFixed(2)}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v) && v >= 1 && v <= 3) onLineHeightChange(v);
                }}
                className="rounded-md bg-transparent outline-none text-parchment-100 text-center font-sans tabular-nums"
                style={{
                  width: 60,
                  padding: "3px 6px",
                  fontSize: 11,
                  background: "var(--pill-bg)",
                  border: "1px solid var(--hairline-veil)",
                }}
              />
            </div>

            <SectionTitle>Largeur du canvas · {maxWidth}px</SectionTitle>
            <input
              type="range"
              min={480}
              max={1000}
              step={20}
              value={maxWidth}
              onChange={(e) => onMaxWidthChange(Number(e.target.value))}
              className="range-slider w-full"
              style={{
                ["--val" as string]: `${((maxWidth - 480) / 520) * 100}%`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] uppercase tracking-widest text-parchment-500 font-sans mb-2"
    >
      {children}
    </div>
  );
}
