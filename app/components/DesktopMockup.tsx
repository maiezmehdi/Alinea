"use client";

import { useState } from "react";
import { IconCommand, IconSparkles, IconAa, IconChevronLeft, IconMore } from "./icons";

type Mode = "edit" | "preview";

const bodyParagraphs = [
  "Some afternoons feel as if they arrive without a purpose. The cup stays warm in her hands, the street outside moves slowly, and for once she does not try to fill the quiet with plans. She lets the hour pass without naming it useful. The room is still, the light is low, and nothing asks to be fixed.",
  "She thought that rest was not something to deserve. It was something to notice before the day became too loud.",
  "She does not reach for her phone. Not yet. The messages can stay where they are, folded inside the small bright screen, waiting for a version of her that feels less tired.",
  "For now, there is only the cup, the window, and the slow comfort of not explaining herself.",
];

export function DesktopMockup() {
  const [mode, setMode] = useState<Mode>("edit");
  const [showAI, setShowAI] = useState(false);

  return (
    <div
      className="relative rounded-[18px] overflow-hidden ember-glow"
      style={{
        background:
          "linear-gradient(180deg, #1a0d09 0%, #120806 100%)",
        border: "1px solid rgba(214, 138, 60, 0.14)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center justify-between border-b border-white/[0.04]"
        style={{ padding: "12px 16px" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400/50" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/50" />
          <span className="w-3 h-3 rounded-full bg-green-400/50" />
        </div>

        <div className="flex items-center gap-3 text-parchment-300 text-xs font-sans">
          <span className="italic font-display text-ember-300 text-base leading-none">A</span>
          <span>Quiet Hours · Draft</span>
          <span className="text-parchment-500">— saved just now</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Edit / Preview toggle */}
          <div
            className="flex rounded-full p-0.5"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            {(["edit", "preview"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-xs font-sans px-3 py-1 rounded-full transition-colors ${
                  mode === m
                    ? "bg-ember-500/15 text-parchment-100"
                    : "text-parchment-400"
                }`}
                style={
                  mode === m
                    ? { border: "1px solid rgba(214,138,60,0.35)" }
                    : { border: "1px solid transparent" }
                }
              >
                {m === "edit" ? "Edit" : "Preview"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-1.5 text-xs font-sans text-parchment-300 hover:text-parchment-100 transition-colors"
            style={{
              padding: "5px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(214,138,60,0.20)",
              background: showAI ? "rgba(214,138,60,0.10)" : "transparent",
            }}
          >
            <IconCommand style={{ width: 12, height: 12 }} />
            <span>K</span>
          </button>
        </div>
      </div>

      <div className="flex" style={{ minHeight: 520 }}>
        {/* Sidebar */}
        <aside
          className="border-r border-white/[0.03] text-parchment-400 font-sans text-xs flex flex-col"
          style={{ width: 200, padding: "20px 14px" }}
        >
          <div className="text-parchment-500 uppercase tracking-widest text-[10px] mb-3">
            Recent
          </div>
          {[
            ["Quiet Hours", "Draft"],
            ["Weekly memo", "3 days ago"],
            ["Product notes", "Last week"],
            ["Interview transcript", "Sep 12"],
            ["Substack draft", "Sep 5"],
          ].map(([title, meta], i) => (
            <div
              key={title}
              className="flex flex-col rounded-lg cursor-pointer transition-colors"
              style={{
                padding: "8px 10px",
                background: i === 0 ? "rgba(214,138,60,0.08)" : "transparent",
                border: i === 0 ? "1px solid rgba(214,138,60,0.20)" : "1px solid transparent",
                marginBottom: 3,
                color: i === 0 ? "#f4ebd7" : "#a8927a",
              }}
            >
              <span className="text-[12px]">{title}</span>
              <span className="text-[10px] text-parchment-500">{meta}</span>
            </div>
          ))}

          <div className="mt-auto text-[10px] text-parchment-500 pt-4 border-t border-white/[0.03]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ember-400" />
              <span>Synced to Drive</span>
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <div className="relative flex-1 flex flex-col">
          {/* Doc header */}
          <div
            className="flex items-center gap-3 text-parchment-400"
            style={{
              padding: "18px 40px 4px",
              fontSize: 12,
              justifyContent: "space-between",
            }}
          >
            <div className="flex items-center gap-2 text-xs font-sans">
              <IconChevronLeft style={{ width: 14, height: 14 }} />
              <span>All documents</span>
            </div>
            <IconMore style={{ width: 16, height: 16 }} />
          </div>

          {mode === "edit" ? (
            <EditView />
          ) : (
            <PreviewView />
          )}

          {/* Bottom status */}
          <div
            className="flex items-center justify-between text-parchment-500 font-sans border-t border-white/[0.03]"
            style={{ padding: "10px 40px", fontSize: 11 }}
          >
            <div className="flex items-center gap-3">
              <span className="tabular-nums">248 words</span>
              <span>·</span>
              <span>1 min read</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1"
                style={{ color: "#efb361" }}
              >
                <IconSparkles style={{ width: 12, height: 12 }} />
                Gemini
              </span>
              <span>·</span>
              <span>Press ⌘K for actions</span>
            </div>
          </div>

          {showAI && <CommandPalette onClose={() => setShowAI(false)} />}
        </div>
      </div>
    </div>
  );
}

function EditView() {
  return (
    <div
      className="flex-1 overflow-hidden font-serif text-parchment-100 relative"
      style={{ padding: "22px 40px 30px", fontSize: 16, lineHeight: 1.7 }}
    >
      <div
        className="font-display text-parchment-50 mb-1"
        style={{ fontSize: 34, letterSpacing: "-0.01em" }}
      >
        Quiet Hours
      </div>
      <div className="text-parchment-400 italic mb-6" style={{ fontSize: 14 }}>
        Mira Vale · a short essay
      </div>
      {bodyParagraphs.slice(0, 3).map((p, i) => (
        <p key={i} style={{ marginBottom: 14 }}>
          {i === 0 ? (
            <>
              {p.slice(0, 108)}
              <mark
                style={{
                  background: "rgba(214,138,60,0.18)",
                  color: "#f4ebd7",
                  padding: "0 2px",
                  borderRadius: "2px",
                }}
              >
                {p.slice(108, 148)}
              </mark>
              {p.slice(148)}
            </>
          ) : (
            p
          )}
        </p>
      ))}
      <p>
        {bodyParagraphs[3]}
        <span className="ember-caret inline-block ml-0.5 w-[2px] h-[1.1em] bg-ember-400 align-middle rounded-[1px]" />
      </p>

      {/* Inline AI menu on the highlighted selection */}
      <div
        className="absolute z-10 flex items-center gap-1 rounded-xl"
        style={{
          top: 150,
          left: 132,
          padding: "5px 6px",
          background:
            "linear-gradient(180deg, rgba(38, 20, 14, 0.98), rgba(20, 10, 7, 0.98))",
          border: "1px solid rgba(214, 138, 60, 0.30)",
          boxShadow:
            "0 12px 40px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(214,138,60,0.05)",
        }}
      >
        {[
          "Rewrite",
          "Shorten",
          "Change tone",
          "Continue",
          "Translate",
        ].map((label, i) => (
          <button
            key={label}
            className={`text-xs font-sans px-2 py-1 rounded-lg transition-colors ${
              i === 0
                ? "bg-ember-500/20 text-parchment-50"
                : "text-parchment-300 hover:text-parchment-100 hover:bg-white/[0.04]"
            }`}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-4 bg-white/10 mx-1" />
        <button className="text-[10px] font-sans text-parchment-400 px-2 py-1 flex items-center gap-1 rounded-lg">
          <IconCommand style={{ width: 10, height: 10 }} />
          K
        </button>
      </div>
    </div>
  );
}

function PreviewView() {
  return (
    <div className="flex-1 overflow-hidden relative">
      <div
        className="mx-auto font-serif text-parchment-100 drop-cap"
        style={{
          maxWidth: 620,
          padding: "34px 40px 40px",
          fontSize: 17,
          lineHeight: 1.75,
        }}
      >
        <div
          className="font-display text-parchment-50 text-center mb-1"
          style={{ fontSize: 40, letterSpacing: "-0.01em" }}
        >
          Quiet Hours
        </div>
        <div
          className="text-center text-parchment-400 italic mb-8"
          style={{ fontSize: 14 }}
        >
          by Mira Vale
        </div>
        {bodyParagraphs.map((p, i) => (
          <p key={i} style={{ marginBottom: 18 }}>
            {p}
          </p>
        ))}
      </div>
      {/* Progress rail on the left */}
      <div
        className="absolute top-6 bottom-6 flex flex-col items-center"
        style={{ left: 20, gap: 6 }}
      >
        <div
          className="w-[1.5px] flex-1 bg-white/10 rounded-full relative overflow-hidden"
        >
          <div
            className="absolute top-0 left-0 w-full bg-ember-400"
            style={{
              height: "44%",
              boxShadow: "0 0 8px rgba(214,138,60,0.6)",
            }}
          />
        </div>
        <div
          className="text-parchment-500 font-sans tabular-nums text-[10px] writing-mode-vertical"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          142 / 320
        </div>
      </div>
    </div>
  );
}

function CommandPalette({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 z-30 flex items-start justify-center"
      style={{
        background: "rgba(10, 5, 3, 0.55)",
        backdropFilter: "blur(4px)",
        paddingTop: 60,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl overflow-hidden"
        style={{
          width: 480,
          background:
            "linear-gradient(180deg, rgba(38, 20, 14, 0.98) 0%, rgba(20, 10, 7, 0.98) 100%)",
          border: "1px solid rgba(214, 138, 60, 0.25)",
          boxShadow:
            "0 30px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(214,138,60,0.05), 0 0 40px rgba(214,138,60,0.15)",
        }}
      >
        <div
          className="flex items-center gap-3 border-b border-white/[0.04]"
          style={{ padding: "16px 20px" }}
        >
          <IconSparkles
            style={{ width: 16, height: 16, color: "#efb361" }}
          />
          <input
            autoFocus
            placeholder="Ask Alinéa to write, edit, or find…"
            className="flex-1 bg-transparent text-parchment-100 placeholder:text-parchment-500 outline-none font-sans text-sm"
          />
          <span className="text-[10px] text-parchment-500 font-sans">esc</span>
        </div>
        <div style={{ padding: "8px 8px 12px" }}>
          <div
            className="text-[10px] uppercase tracking-widest text-parchment-500 font-sans"
            style={{ padding: "8px 12px 4px" }}
          >
            Suggested
          </div>
          {[
            ["Write a short essay from…", "prompt · draft mode"],
            ["Continue the last paragraph", "inline · Gemini"],
            ["Summarise this thread with Sarah", "Gmail · this week"],
            ["Prep notes for my 3pm call", "Calendar · today"],
            ["Export as PDF (Article template)", "publish"],
          ].map(([label, meta]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg cursor-pointer transition-colors hover:bg-ember-500/[0.08]"
              style={{
                padding: "8px 12px",
                color: "#e8dbbb",
              }}
            >
              <span className="font-sans text-sm">{label}</span>
              <span className="text-[10px] text-parchment-500 font-sans">
                {meta}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
