"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { IconCommand, IconSparkles, IconAa, IconChevronLeft, IconMore } from "./icons";

type Mode = "edit" | "preview";

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.6 };
const smooth = { type: "spring" as const, stiffness: 240, damping: 28, mass: 0.7 };

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
        background: "var(--surface-glass-strong)",
        border: "1px solid var(--window-outline)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center justify-between"
        style={{ padding: "12px 16px", borderBottom: "1px solid var(--hairline-soft)" }}
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
          <LayoutGroup id="mode-toggle">
            <div
              className="relative flex rounded-full p-0.5"
              style={{ background: "var(--pill-bg)" }}
            >
              {(["edit", "preview"] as Mode[]).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`relative text-xs font-sans px-3 py-1 rounded-full ${
                      active ? "text-parchment-100" : "text-parchment-400"
                    }`}
                    style={{
                      transition: "color 200ms ease",
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="mode-thumb"
                        aria-hidden
                        className="absolute inset-0 rounded-full"
                        transition={spring}
                        style={{
                          border:
                            "1px solid color-mix(in oklab, var(--color-ember-500) 45%, transparent)",
                          background: "var(--accent-tint-strong)",
                        }}
                      />
                    )}
                    <span className="relative z-10">
                      {m === "edit" ? "Edit" : "Preview"}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
          <button
            onClick={() => setShowAI(!showAI)}
            className="flex items-center gap-1.5 text-xs font-sans text-parchment-300 hover:text-parchment-100 transition-colors"
            style={{
              padding: "5px 10px",
              borderRadius: "8px",
              border:
                "1px solid color-mix(in oklab, var(--color-ember-500) 35%, transparent)",
              background: showAI ? "var(--accent-tint)" : "transparent",
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
          className="text-parchment-400 font-sans text-xs flex flex-col"
          style={{
            width: 200,
            padding: "20px 14px",
            borderRight: "1px solid var(--hairline-veil)",
          }}
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
                background: i === 0 ? "var(--accent-tint)" : "transparent",
                border:
                  i === 0
                    ? "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
                    : "1px solid transparent",
                marginBottom: 3,
                color:
                  i === 0
                    ? "var(--color-parchment-100)"
                    : "var(--color-parchment-500)",
              }}
            >
              <span className="text-[12px]">{title}</span>
              <span className="text-[10px] text-parchment-500">{meta}</span>
            </div>
          ))}

          <div
            className="mt-auto text-[10px] text-parchment-500 pt-4"
            style={{ borderTop: "1px solid var(--hairline-veil)" }}
          >
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

          {/* Persistent prompt bar — always accessible */}
          <PersistentPromptBar onOpen={() => setShowAI(true)} />

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
                  background:
                    "color-mix(in oklab, var(--color-ember-500) 22%, transparent)",
                  color: "var(--color-parchment-100)",
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

      {/* Notion-style "+" block insert affordance on paragraph hover */}
      <div
        className="absolute z-10 flex items-center justify-center"
        aria-hidden
        style={{
          top: 88,
          left: 12,
          width: 22,
          height: 22,
          borderRadius: 8,
          background: "var(--accent-tint)",
          border:
            "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
          color: "var(--color-ember-300)",
          boxShadow:
            "0 6px 18px -8px rgba(0,0,0,0.35)",
          fontSize: 14,
          lineHeight: 1,
        }}
        title="Insérer un bloc"
      >
        +
      </div>

      {/* Inline selection menu — Alinéa's answer to Docs' toolbar */}
      <InlineSelectionMenu top={132} left={120} />
    </div>
  );
}

const paragraphStyles = [
  { key: "p", label: "Paragraphe", hint: "Texte" },
  { key: "h1", label: "Titre 1", hint: "H1" },
  { key: "h2", label: "Titre 2", hint: "H2" },
  { key: "h3", label: "Titre 3", hint: "H3" },
  { key: "quote", label: "Citation", hint: "❝" },
  { key: "callout", label: "Callout", hint: "💡" },
  { key: "code", label: "Code", hint: "</>" },
];

function InlineSelectionMenu({ top, left }: { top: number; left: number }) {
  return (
    <div
      className="absolute z-10 flex flex-col gap-1 rounded-2xl"
      style={{
        top,
        left,
        padding: 6,
        minWidth: 460,
        background: "var(--surface-glass-strong)",
        border:
          "1px solid color-mix(in oklab, var(--color-ember-500) 40%, transparent)",
        boxShadow:
          "0 20px 60px -18px rgba(0,0,0,0.35), 0 0 0 1px color-mix(in oklab, var(--color-ember-500) 8%, transparent)",
      }}
    >
      {/* Row 1 — Format (Docs feature parity, inline) */}
      <div className="flex items-center gap-0.5">
        {/* Style dropdown */}
        <button
          className="flex items-center gap-1.5 rounded-lg text-xs font-sans text-parchment-200"
          style={{
            padding: "5px 8px",
            background: "var(--pill-bg)",
            border: "1px solid var(--hairline)",
          }}
        >
          <span className="font-display">P</span>
          <span>Paragraphe</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="opacity-60">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <FormatSep />

        <FmtBtn label="B" bold />
        <FmtBtn label="I" italic />
        <FmtBtn label="U" underline />
        <FmtBtn label="S" strike />

        <FormatSep />

        {/* Color / highlight */}
        <button
          className="flex items-center rounded-lg text-parchment-300 text-xs font-sans"
          style={{
            padding: "5px 8px",
            gap: 4,
          }}
          title="Couleur du texte"
        >
          <span className="font-display" style={{ color: "var(--color-ember-300)" }}>A</span>
          <span
            className="w-[10px] h-[3px] rounded-sm"
            style={{ background: "var(--color-ember-400)" }}
          />
        </button>
        <button
          className="rounded-lg text-parchment-300"
          style={{ padding: "5px 7px" }}
          title="Surligner"
        >
          <span
            className="inline-block rounded-sm font-display text-xs"
            style={{
              background: "var(--accent-tint-strong)",
              color: "var(--color-parchment-100)",
              padding: "0 3px",
            }}
          >
            H
          </span>
        </button>

        <FormatSep />

        {/* Link / Comment */}
        <FmtIconBtn title="Lien">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
            <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 1 0 7 7l1-1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </FmtIconBtn>
        <FmtIconBtn title="Commentaire">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
            <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6z" strokeLinejoin="round" />
          </svg>
        </FmtIconBtn>

        <FormatSep />

        {/* Alignment quick */}
        <FmtIconBtn title="Aligner à gauche">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
            <path d="M4 6h16M4 10h10M4 14h16M4 18h10" strokeLinecap="round" />
          </svg>
        </FmtIconBtn>
        <FmtIconBtn title="Liste à puces">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
            <circle cx="5" cy="7" r="1" fill="currentColor" />
            <circle cx="5" cy="12" r="1" fill="currentColor" />
            <circle cx="5" cy="17" r="1" fill="currentColor" />
            <path d="M10 7h10M10 12h10M10 17h10" strokeLinecap="round" />
          </svg>
        </FmtIconBtn>
      </div>

      {/* Separator between Format & AI rows — the Alinéa signature */}
      <div
        className="mx-1"
        style={{ height: 1, background: "var(--hairline-soft)" }}
      />

      {/* Row 2 — Écrire avec l'IA (Alinéa's superpower) */}
      <div className="flex items-center gap-0.5">
        <span
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-sans"
          style={{ padding: "3px 8px", color: "var(--color-ember-300)" }}
        >
          <IconSparkles style={{ width: 10, height: 10 }} />
          IA
        </span>
        {(
          [
            ["Réécrire", true],
            ["Raccourcir", false],
            ["Étendre", false],
            ["Ton", false],
            ["Continuer", false],
            ["Traduire", false],
          ] as const
        ).map(([label, active]) => (
          <button
            key={label}
            className={`text-xs font-sans px-2 py-1 rounded-lg ${
              active
                ? "text-parchment-50"
                : "text-parchment-300 hover:text-parchment-100"
            }`}
            style={{
              transition: "color 200ms ease, background-color 200ms ease",
              background: active ? "var(--accent-tint-strong)" : "transparent",
            }}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <FormatSep />
          <button
            className="text-[10px] font-sans text-parchment-400 px-2 py-1 flex items-center gap-1 rounded-lg"
            title="Command palette"
          >
            <IconCommand style={{ width: 10, height: 10 }} />
            K
          </button>
        </div>
      </div>
    </div>
  );
}

function FormatSep() {
  return (
    <div
      aria-hidden
      className="w-px mx-1"
      style={{ height: 18, background: "var(--hairline-soft)" }}
    />
  );
}

function FmtBtn({
  label,
  bold,
  italic,
  underline,
  strike,
}: {
  label: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
}) {
  return (
    <button
      className="rounded-lg text-parchment-300 hover:text-parchment-100 flex items-center justify-center"
      style={{
        width: 26,
        height: 26,
        fontFamily: "var(--font-display)",
        fontSize: 14,
        fontWeight: bold ? 700 : 500,
        fontStyle: italic ? "italic" : "normal",
        textDecoration: underline ? "underline" : strike ? "line-through" : "none",
        textUnderlineOffset: 2,
      }}
    >
      {label}
    </button>
  );
}

function FmtIconBtn({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      title={title}
      className="rounded-lg text-parchment-300 hover:text-parchment-100 flex items-center justify-center"
      style={{ width: 26, height: 26 }}
    >
      <span style={{ width: 14, height: 14, display: "inline-block" }}>
        {children}
      </span>
    </button>
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
          className="w-[1.5px] flex-1 rounded-full relative overflow-hidden"
          style={{ background: "var(--track)" }}
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

function PersistentPromptBar({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="flex items-center"
      style={{
        padding: "10px 12px 12px",
        borderTop: "1px solid var(--hairline-veil)",
        gap: 10,
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="group flex-1 flex items-center gap-2.5 rounded-xl text-left"
        style={{
          padding: "8px 12px",
          background: "var(--pill-bg)",
          border: "1px solid var(--hairline)",
          transition: "background-color 200ms ease, border-color 200ms ease",
        }}
      >
        <span
          className="flex items-center justify-center rounded-md"
          style={{
            width: 22,
            height: 22,
            background: "var(--accent-tint)",
            color: "var(--color-ember-300)",
          }}
        >
          <IconSparkles style={{ width: 14, height: 14 }} />
        </span>
        <span
          className="font-sans text-parchment-400"
          style={{ fontSize: 13, letterSpacing: "-0.005em" }}
        >
          Ask Alinéa to write, edit, insert a table, translate, publish…
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span
            className="text-parchment-500 font-sans tabular-nums"
            style={{ fontSize: 10 }}
          >
            248 mots · 1 min
          </span>
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-sans"
            style={{
              fontSize: 10,
              color: "var(--color-parchment-300)",
              background: "var(--track-soft)",
              border: "1px solid var(--hairline-veil)",
            }}
          >
            <IconCommand style={{ width: 9, height: 9 }} />K
          </span>
        </span>
      </button>
    </div>
  );
}

const paletteGroups: Array<{
  label: string;
  items: Array<[string, string, string?]>;
}> = [
  {
    label: "Écrire avec l'IA",
    items: [
      ["Écrire un essai à partir de…", "prompt · draft"],
      ["Continuer le dernier paragraphe", "inline · IA"],
      ["Résumer ce document en 3 points", "summarize"],
      ["Traduire tout en anglais", "translate · en"],
    ],
  },
  {
    label: "Insérer un bloc",
    items: [
      ["Titre 1 · Titre 2 · Titre 3", "H1 / H2 / H3"],
      ["Liste à puces · Liste numérotée", "• / 1."],
      ["Case à cocher (todo)", "☐"],
      ["Citation · Callout", "❝ / 💡"],
      ["Tableau", "Table"],
      ["Image · Fichier · Embed", "Insert"],
      ["Bloc de code · Équation", "</> / ∑"],
      ["Séparateur · Note de bas de page", "— / ¹"],
    ],
  },
  {
    label: "Écosystème Google",
    items: [
      ["Résumer ce thread avec Sarah", "Gmail · cette semaine"],
      ["Préparer mes notes pour 15h", "Calendar · aujourd'hui"],
      ["Ouvrir un fichier .docx du Drive", "Drive"],
      ["Publier vers Google Docs", "push · doc"],
    ],
  },
  {
    label: "Importer (tous formats)",
    items: [
      ["Fichier local · glisser-déposer", ".docx .md .txt .rtf .odt"],
      ["PDF · extraire le texte", ".pdf"],
      ["EPUB · article Instapaper", ".epub · url"],
      ["Email en tant que note", ".eml · Gmail"],
      ["Export Notion (.zip)", "notion"],
    ],
  },
  {
    label: "Publier & exporter",
    items: [
      ["PDF · Article template", "publish · pdf"],
      ["PDF · Memo template", "publish · pdf"],
      ["Word (.docx) · Markdown · HTML", "export"],
      ["Push vers Notion", "notion"],
      ["Lien de partage public", "share · read-only"],
    ],
  },
];

function CommandPalette({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-start justify-center"
      style={{
        background: "var(--scrim)",
        backdropFilter: "blur(4px)",
        paddingTop: 60,
      }}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl overflow-hidden"
        style={{
          width: 520,
          maxHeight: 460,
          display: "flex",
          flexDirection: "column",
          background: "var(--surface-glass-strong)",
          border:
            "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)",
          boxShadow: "var(--shadow-palette)",
        }}
        initial={{ y: -12, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -8, opacity: 0, scale: 0.98 }}
        transition={smooth}
      >
        <div
          className="flex items-center gap-3"
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--hairline-soft)",
          }}
        >
          <IconSparkles
            style={{ width: 16, height: 16, color: "var(--color-ember-300)" }}
          />
          <input
            autoFocus
            placeholder="Ask Alinéa to write, edit, insert, translate, publish…"
            className="flex-1 bg-transparent text-parchment-100 placeholder:text-parchment-500 outline-none font-sans text-sm"
          />
          <span className="text-[10px] text-parchment-500 font-sans">esc</span>
        </div>
        <div
          style={{
            padding: "6px 6px 10px",
            overflowY: "auto",
          }}
        >
          {paletteGroups.map((group, gi) => (
            <div key={group.label} style={{ marginBottom: 4 }}>
              <div
                className="text-[10px] uppercase tracking-widest text-parchment-500 font-sans"
                style={{ padding: "10px 14px 4px" }}
              >
                {group.label}
              </div>
              {group.items.map(([label, meta], i) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg cursor-pointer"
                  style={{
                    padding: "7px 14px",
                    color: "var(--color-parchment-200)",
                    background:
                      gi === 0 && i === 0 ? "var(--accent-tint)" : "transparent",
                  }}
                >
                  <span className="font-sans text-sm">{label}</span>
                  <span className="text-[10px] text-parchment-500 font-sans tabular-nums">
                    {meta}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
