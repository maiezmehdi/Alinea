"use client";

import { useState } from "react";
import {
  IconSize,
  IconLineHeight,
  IconMargin,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignJustify,
  IconAlignRight,
  IconBold,
  IconItalic,
} from "./icons";

type Props = {
  scale?: number;
};

const fonts = [
  { key: "original", label: "Original", family: '"Spectral", serif', italic: false },
  { key: "georgian", label: "Noto Sans\nGeorgian", family: "Inter, sans-serif", italic: false },
  { key: "spectral", label: "Spectral", family: '"Spectral", serif', italic: false },
  { key: "crimson", label: "Crimson\nText", family: '"Crimson Text", serif', italic: false },
];

export function TypographySheet({ scale = 1 }: Props) {
  const [font, setFont] = useState("georgian");
  const [size, setSize] = useState(52);
  const [lh, setLh] = useState(66);
  const [margin, setMargin] = useState(48);
  const [align, setAlign] = useState<"left" | "center" | "justify" | "right">("left");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  const px = (n: number) => `${n * scale}px`;

  return (
    <div
      className="rounded-t-[28px] backdrop-blur-xl relative overflow-hidden"
      style={{
        background: "var(--surface-sheet)",
        borderTop: "1px solid var(--hairline)",
        boxShadow:
          "0 -8px 24px -8px rgba(0,0,0,0.15), 0 -1px 0 var(--hairline) inset",
        padding: `${8 * scale}px ${8 * scale}px ${22 * scale}px`,
      }}
    >
      {/* Grabber */}
      <div
        className="mx-auto rounded-full bg-parchment-500/40"
        style={{
          width: px(36),
          height: px(4),
          marginBottom: px(14),
        }}
      />

      {/* Fonts row */}
      <div
        className="grid grid-cols-4 gap-1"
        style={{ marginBottom: `${18 * scale}px`, padding: `0 ${6 * scale}px` }}
      >
        {fonts.map((f) => {
          const active = font === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFont(f.key)}
              className="flex flex-col items-center justify-start gap-1 rounded-2xl transition-colors"
              style={{
                padding: `${10 * scale}px ${4 * scale}px ${8 * scale}px`,
                background: active ? "var(--accent-tint)" : "transparent",
                border: active
                  ? "1px solid color-mix(in oklab, var(--color-ember-500) 45%, transparent)"
                  : "1px solid transparent",
                color: active
                  ? "var(--color-parchment-100)"
                  : "var(--color-parchment-500)",
              }}
            >
              <span
                className="font-display leading-none"
                style={{
                  fontFamily: f.family,
                  fontSize: px(24),
                  fontStyle: f.italic ? "italic" : "normal",
                }}
              >
                Aa
              </span>
              <span
                className="text-center font-sans whitespace-pre-line"
                style={{
                  fontSize: px(9),
                  lineHeight: 1.15,
                  marginTop: px(4),
                  letterSpacing: "0.02em",
                }}
              >
                {f.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sliders */}
      <div
        className="flex flex-col"
        style={{ gap: px(14), padding: `0 ${14 * scale}px`, marginBottom: px(16) }}
      >
        <SliderRow
          scale={scale}
          value={size}
          onChange={setSize}
          leftIcon={<IconSize small style={{ width: px(18), height: px(18) }} />}
          rightIcon={<IconSize style={{ width: px(20), height: px(20) }} />}
        />
        <SliderRow
          scale={scale}
          value={lh}
          onChange={setLh}
          leftIcon={<IconLineHeight compact style={{ width: px(18), height: px(18) }} />}
          rightIcon={<IconLineHeight style={{ width: px(18), height: px(18) }} />}
        />
        <SliderRow
          scale={scale}
          value={margin}
          onChange={setMargin}
          leftIcon={<IconMargin narrow style={{ width: px(18), height: px(18) }} />}
          rightIcon={<IconMargin style={{ width: px(18), height: px(18) }} />}
        />
      </div>

      {/* Alignment + emphasis */}
      <div
        className="flex items-center justify-between"
        style={{ padding: `0 ${14 * scale}px` }}
      >
        <div
          className="flex items-center gap-1 rounded-2xl"
          style={{
            background: "var(--track-soft)",
            padding: `${5 * scale}px`,
            border: "1px solid var(--hairline-veil)",
          }}
        >
          {(
            [
              ["left", IconAlignLeft],
              ["center", IconAlignCenter],
              ["justify", IconAlignJustify],
              ["right", IconAlignRight],
            ] as const
          ).map(([key, Icon]) => {
            const active = align === key;
            return (
              <button
                key={key}
                onClick={() => setAlign(key)}
                className="rounded-xl transition-colors flex items-center justify-center"
                style={{
                  width: px(40),
                  height: px(32),
                  background: active ? "var(--accent-tint-strong)" : "transparent",
                  color: active
                    ? "var(--color-parchment-100)"
                    : "var(--color-parchment-500)",
                }}
              >
                <Icon style={{ width: px(18), height: px(18) }} />
              </button>
            );
          })}
        </div>

        <div
          className="flex items-center gap-1 rounded-2xl"
          style={{
            background: "var(--track-soft)",
            padding: `${5 * scale}px`,
            border: "1px solid var(--hairline-veil)",
          }}
        >
          <button
            onClick={() => setBold(!bold)}
            className="rounded-xl transition-colors flex items-center justify-center"
            style={{
              width: px(40),
              height: px(32),
              background: bold ? "var(--accent-tint-strong)" : "transparent",
              color: bold
                ? "var(--color-parchment-100)"
                : "var(--color-parchment-500)",
            }}
          >
            <IconBold style={{ width: px(18), height: px(18) }} />
          </button>
          <button
            onClick={() => setItalic(!italic)}
            className="rounded-xl transition-colors flex items-center justify-center"
            style={{
              width: px(40),
              height: px(32),
              background: italic ? "var(--accent-tint-strong)" : "transparent",
              color: italic
                ? "var(--color-parchment-100)"
                : "var(--color-parchment-500)",
            }}
          >
            <IconItalic style={{ width: px(18), height: px(18) }} />
          </button>
        </div>
      </div>
    </div>
  );
}

function SliderRow({
  value,
  onChange,
  leftIcon,
  rightIcon,
  scale = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  scale?: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-parchment-300 flex-shrink-0" style={{ width: 22 * scale }}>
        {leftIcon}
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-slider flex-1"
        style={{ ["--val" as string]: `${value}%` }}
      />
      <div className="text-parchment-300 flex-shrink-0" style={{ width: 22 * scale }}>
        {rightIcon}
      </div>
    </div>
  );
}
