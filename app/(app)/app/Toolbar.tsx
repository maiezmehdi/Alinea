"use client";

import { useState, useRef, useEffect } from "react";
import type { Editor } from "@tiptap/react";
import { AnimatePresence, motion } from "motion/react";
import { FontPicker } from "./FontPicker";
import { ColorPicker } from "./ColorPicker";

type Props = {
  editor: Editor | null;
  fontKey: string;
  onFontChange: (key: string) => void;
  fontSize: number;
  onFontSizeChange: (n: number) => void;
  lineHeight: number;
  onLineHeightChange: (n: number) => void;
};

const sizePresets = [10, 11, 12, 13, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72];
const lineHeightPresets = [
  { label: "Simple", value: 1.15 },
  { label: "Confort", value: 1.55 },
  { label: "1½", value: 1.75 },
  { label: "Double", value: 2 },
];

const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

export function Toolbar({
  editor,
  fontKey,
  onFontChange,
  fontSize,
  onFontSizeChange,
  lineHeight,
  onLineHeightChange,
}: Props) {
  if (!editor) return null;

  const isActive = (
    nameOrAttrs: string | Record<string, unknown>,
    attrs?: Record<string, unknown>,
  ): boolean =>
    typeof nameOrAttrs === "string"
      ? editor.isActive(nameOrAttrs, attrs)
      : editor.isActive(nameOrAttrs);

  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      style={{
        padding: "8px 16px",
        borderBottom: "1px solid var(--hairline-veil)",
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--color-ink-950) 30%, transparent) 0%, transparent 100%)",
      }}
    >
      {/* History */}
      <Group>
        <IconBtn
          title="Annuler (⌘Z)"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Ico d="M9 14L4 9l5-5M4 9h9a7 7 0 0 1 0 14h-3" />
        </IconBtn>
        <IconBtn
          title="Rétablir (⌘⇧Z)"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Ico d="M15 14l5-5-5-5M20 9h-9a7 7 0 0 0 0 14h3" />
        </IconBtn>
      </Group>

      <Sep />

      {/* Style dropdown */}
      <StyleDropdown editor={editor} />

      <Sep />

      {/* Font picker + size */}
      <FontPicker currentKey={fontKey} onChange={onFontChange} />

      <SizePicker
        value={fontSize}
        onChange={onFontSizeChange}
      />

      <LineHeightPicker value={lineHeight} onChange={onLineHeightChange} />

      <Sep />

      {/* Format buttons */}
      <Group>
        <IconBtn
          title="Gras (⌘B)"
          active={isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <TextGlyph weight={700}>B</TextGlyph>
        </IconBtn>
        <IconBtn
          title="Italique (⌘I)"
          active={isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <TextGlyph italic>I</TextGlyph>
        </IconBtn>
        <IconBtn
          title="Souligné (⌘U)"
          active={isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <TextGlyph underline>U</TextGlyph>
        </IconBtn>
        <IconBtn
          title="Barré"
          active={isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <TextGlyph strike>S</TextGlyph>
        </IconBtn>
        <IconBtn
          title="Code inline"
          active={isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <span
            className="font-mono"
            style={{ fontSize: 11 }}
          >
            {`</>`}
          </span>
        </IconBtn>
        <IconBtn
          title="Indice"
          active={isActive("subscript")}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        >
          <TextGlyph sub>x₂</TextGlyph>
        </IconBtn>
        <IconBtn
          title="Exposant"
          active={isActive("superscript")}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        >
          <TextGlyph sup>x²</TextGlyph>
        </IconBtn>
      </Group>

      <Sep />

      {/* Color */}
      <ColorPicker
        kind="text"
        currentColor={editor.getAttributes("textStyle").color ?? null}
        onPick={(c) => {
          if (c === null) editor.chain().focus().unsetColor().run();
          else editor.chain().focus().setColor(c).run();
        }}
        title="Couleur du texte"
        buttonLabel={
          <span className="flex flex-col items-center leading-none">
            <span
              className="font-display"
              style={{ fontSize: 14, marginBottom: 1 }}
            >
              A
            </span>
            <span
              className="rounded-sm"
              style={{
                width: 14,
                height: 3,
                background:
                  editor.getAttributes("textStyle").color ??
                  "var(--color-ember-400)",
              }}
            />
          </span>
        }
      />
      <ColorPicker
        kind="highlight"
        currentColor={editor.getAttributes("highlight").color ?? null}
        onPick={(c) => {
          if (c === null) editor.chain().focus().unsetHighlight().run();
          else editor.chain().focus().toggleHighlight({ color: c }).run();
        }}
        title="Surligner"
        buttonLabel={
          <span
            className="rounded font-display"
            style={{
              padding: "1px 5px",
              fontSize: 13,
              background: "var(--accent-tint-strong)",
              color: "var(--color-parchment-100)",
            }}
          >
            H
          </span>
        }
      />

      {/* Link */}
      <LinkButton editor={editor} />

      <Sep />

      {/* Lists */}
      <Group>
        <IconBtn
          title="Liste à puces"
          active={isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <Ico d="M8 6h13M8 12h13M8 18h13" />
          <circle cx="3.5" cy="6" r="1.4" fill="currentColor" />
          <circle cx="3.5" cy="12" r="1.4" fill="currentColor" />
          <circle cx="3.5" cy="18" r="1.4" fill="currentColor" />
        </IconBtn>
        <IconBtn
          title="Liste numérotée"
          active={isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <Ico d="M9 6h12M9 12h12M9 18h12" />
          <text x="2" y="7.5" fontSize="7" fontFamily="sans-serif" fill="currentColor" strokeWidth="0">1</text>
          <text x="2" y="13.5" fontSize="7" fontFamily="sans-serif" fill="currentColor" strokeWidth="0">2</text>
          <text x="2" y="19.5" fontSize="7" fontFamily="sans-serif" fill="currentColor" strokeWidth="0">3</text>
        </IconBtn>
        <IconBtn
          title="Liste de tâches"
          active={isActive("taskList")}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
        >
          <Ico d="M4 6h4v4H4zM10 8h11M4 14h4v4H4zM10 16h11" />
        </IconBtn>
        <IconBtn
          title="Citation"
          active={isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Ico d="M7 7h4v4H7c0 3 1 4 3 4M14 7h4v4h-4c0 3 1 4 3 4" />
        </IconBtn>
        <IconBtn
          title="Bloc de code"
          active={isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Ico d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
        </IconBtn>
      </Group>

      <Sep />

      {/* Insert */}
      <Group>
        <IconBtn
          title="Image"
          onClick={() => {
            const url = window.prompt("URL de l'image");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <Ico d="M4 5h16v14H4zM4 15l4-4 5 5 3-3 4 4" />
          <circle cx="9" cy="9" r="1.5" fill="currentColor" />
        </IconBtn>
        <IconBtn
          title="Tableau"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <Ico d="M4 5h16v14H4zM4 10h16M4 15h16M9 5v14M15 5v14" />
        </IconBtn>
        <IconBtn
          title="Séparateur"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Ico d="M4 12h16" />
        </IconBtn>
      </Group>

      <Sep />

      {/* Alignment */}
      <Group>
        <IconBtn
          title="Aligner à gauche"
          active={isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <Ico d="M4 6h16M4 10h10M4 14h16M4 18h10" />
        </IconBtn>
        <IconBtn
          title="Centrer"
          active={isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <Ico d="M4 6h16M7 10h10M4 14h16M7 18h10" />
        </IconBtn>
        <IconBtn
          title="Aligner à droite"
          active={isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <Ico d="M4 6h16M10 10h10M4 14h16M10 18h10" />
        </IconBtn>
        <IconBtn
          title="Justifier"
          active={isActive({ textAlign: "justify" })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <Ico d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </IconBtn>
      </Group>

      <Sep />

      {/* Clear */}
      <IconBtn
        title="Effacer le formatage"
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
      >
        <Ico d="M6 6l12 12M14 4l6 6-10 10-6-6z" />
      </IconBtn>
    </div>
  );
}

/* ----- Size picker (presets + exact) ---------------------------------- */

function SizePicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const c = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", c);
    return () => document.removeEventListener("mousedown", c);
  }, [open]);

  const commit = (n: number) => {
    if (!isNaN(n) && n >= 8 && n <= 200) onChange(n);
  };

  return (
    <div ref={ref} className="relative">
      <div
        className="flex items-center rounded-lg"
        style={{
          background: "var(--pill-bg)",
          border: "1px solid var(--hairline)",
          height: 28,
        }}
      >
        <button
          onClick={() => commit(value - 1)}
          className="text-parchment-300 hover:text-parchment-100 flex items-center justify-center"
          style={{ width: 22, height: 26, fontSize: 14 }}
          title="Réduire"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => commit(parseInt(e.target.value, 10))}
          className="bg-transparent outline-none text-parchment-100 text-center font-sans tabular-nums"
          style={{ width: 30, fontSize: 12, MozAppearance: "textfield" }}
          title="Taille exacte (px)"
        />
        <button
          onClick={() => commit(value + 1)}
          className="text-parchment-300 hover:text-parchment-100 flex items-center justify-center"
          style={{ width: 22, height: 26, fontSize: 14 }}
          title="Agrandir"
        >
          +
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-parchment-400 flex items-center justify-center"
          style={{ width: 18, height: 26 }}
          title="Choisir dans les tailles courantes"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
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
              width: 100,
              padding: 4,
              maxHeight: 260,
              overflowY: "auto",
              background: "var(--surface-glass-strong)",
              border:
                "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
              boxShadow: "var(--shadow-palette)",
            }}
          >
            {sizePresets.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className="w-full rounded-md text-parchment-200 font-sans tabular-nums text-left"
                style={{
                  padding: "6px 10px",
                  fontSize: 12,
                  background:
                    value === s ? "var(--accent-tint)" : "transparent",
                }}
              >
                {s} px
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----- Line height picker --------------------------------------------- */

function LineHeightPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const c = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", c);
    return () => document.removeEventListener("mousedown", c);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg flex items-center justify-center text-parchment-300 hover:text-parchment-100"
        style={{
          width: 30,
          height: 28,
          background: "var(--pill-bg)",
          border: "1px solid var(--hairline)",
        }}
        title={`Interligne (${value.toFixed(2)})`}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4v16M6 4l-2 3M6 4l2 3M6 20l-2-3M6 20l2-3M11 7h10M11 12h10M11 17h10" />
        </svg>
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
              width: 200,
              padding: 8,
              background: "var(--surface-glass-strong)",
              border:
                "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
              boxShadow: "var(--shadow-palette)",
            }}
          >
            <div
              className="text-[10px] uppercase tracking-widest text-parchment-500 font-sans mb-2"
            >
              Interligne
            </div>
            {lineHeightPresets.map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  onChange(p.value);
                  setOpen(false);
                }}
                className="w-full rounded-md text-parchment-200 font-sans flex items-center justify-between text-left"
                style={{
                  padding: "6px 10px",
                  fontSize: 12,
                  background:
                    Math.abs(value - p.value) < 0.02
                      ? "var(--accent-tint)"
                      : "transparent",
                }}
              >
                <span>{p.label}</span>
                <span className="text-parchment-500 tabular-nums text-[10px]">
                  {p.value.toFixed(2)}
                </span>
              </button>
            ))}
            <div className="mt-2 pt-2" style={{ borderTop: "1px solid var(--hairline-soft)" }}>
              <label
                className="flex items-center gap-2 text-parchment-400 font-sans"
                style={{ fontSize: 11 }}
              >
                Exact
                <input
                  type="number"
                  step={0.05}
                  min={1}
                  max={3}
                  value={value.toFixed(2)}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v >= 1 && v <= 3) onChange(v);
                  }}
                  className="flex-1 rounded-md bg-transparent outline-none text-parchment-100 tabular-nums"
                  style={{
                    padding: "4px 8px",
                    fontSize: 12,
                    background: "var(--pill-bg)",
                    border: "1px solid var(--hairline)",
                  }}
                />
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----- Style dropdown -------------------------------------------------- */

function StyleDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;
    const c = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", c);
    return () => document.removeEventListener("mousedown", c);
  }, [open]);

  const current = editor.isActive("heading", { level: 1 })
    ? { label: "Titre 1", preview: 22, weight: 500 }
    : editor.isActive("heading", { level: 2 })
    ? { label: "Titre 2", preview: 18, weight: 500 }
    : editor.isActive("heading", { level: 3 })
    ? { label: "Titre 3", preview: 15, weight: 500 }
    : editor.isActive("blockquote")
    ? { label: "Citation", preview: 13, weight: 400 }
    : editor.isActive("codeBlock")
    ? { label: "Code", preview: 12, weight: 400 }
    : { label: "Paragraphe", preview: 13, weight: 400 };

  const opts: Array<{ label: string; onSelect: () => void; preview: number; family?: string; weight: number }> = [
    {
      label: "Paragraphe",
      preview: 13,
      weight: 400,
      onSelect: () => editor.chain().focus().setParagraph().run(),
    },
    {
      label: "Titre 1",
      preview: 24,
      weight: 500,
      family: "var(--font-display)",
      onSelect: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "Titre 2",
      preview: 19,
      weight: 500,
      family: "var(--font-display)",
      onSelect: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Titre 3",
      preview: 16,
      weight: 500,
      family: "var(--font-display)",
      onSelect: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: "Citation",
      preview: 13,
      weight: 400,
      family: "var(--font-display)",
      onSelect: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Code",
      preview: 12,
      weight: 400,
      family: "ui-monospace, monospace",
      onSelect: () => editor.chain().focus().toggleCodeBlock().run(),
    },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg text-parchment-200 font-sans"
        style={{
          padding: "5px 10px",
          fontSize: 12,
          background: "var(--pill-bg)",
          border: "1px solid var(--hairline)",
          minWidth: 110,
          height: 28,
        }}
      >
        <span className="flex-1 text-left">{current.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="opacity-60">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
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
              width: 220,
              padding: 4,
              background: "var(--surface-glass-strong)",
              border:
                "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
              boxShadow: "var(--shadow-palette)",
            }}
          >
            {opts.map((o) => (
              <button
                key={o.label}
                onClick={() => {
                  o.onSelect();
                  setOpen(false);
                }}
                className="w-full text-left rounded-lg"
                style={{
                  padding: "8px 12px",
                  background:
                    o.label === current.label
                      ? "var(--accent-tint)"
                      : "transparent",
                }}
              >
                <span
                  className="text-parchment-100"
                  style={{
                    fontSize: o.preview,
                    fontWeight: o.weight,
                    fontFamily: o.family ?? "inherit",
                    lineHeight: 1.05,
                  }}
                >
                  {o.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----- Link button ----------------------------------------------------- */

function LinkButton({ editor }: { editor: Editor }) {
  return (
    <IconBtn
      title="Ajouter un lien"
      active={editor.isActive("link")}
      onClick={() => {
        const previous = editor.getAttributes("link").href ?? "";
        const url = window.prompt("URL du lien", previous);
        if (url === null) return;
        if (url === "") {
          editor.chain().focus().extendMarkRange("link").unsetLink().run();
          return;
        }
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: url })
          .run();
      }}
    >
      <Ico d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 1 0 7 7l1-1" />
    </IconBtn>
  );
}

/* ----- Primitives ------------------------------------------------------ */

function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Sep() {
  return (
    <div
      aria-hidden
      className="mx-1"
      style={{
        width: 1,
        height: 20,
        background: "var(--hairline-veil)",
      }}
    />
  );
}

function IconBtn({
  title,
  onClick,
  active,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="rounded-md flex items-center justify-center transition-colors"
      style={{
        width: 30,
        height: 26,
        color: active
          ? "var(--color-parchment-50)"
          : disabled
          ? "var(--color-parchment-500)"
          : "var(--color-parchment-300)",
        background: active ? "var(--accent-tint-strong)" : "transparent",
        border: active
          ? "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
          : "1px solid transparent",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

function Ico({ d }: { d: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

function TextGlyph({
  children,
  weight,
  italic,
  underline,
  strike,
  sub,
  sup,
}: {
  children: React.ReactNode;
  weight?: number;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  sub?: boolean;
  sup?: boolean;
}) {
  return (
    <span
      className="font-display leading-none"
      style={{
        fontSize: sub || sup ? 11 : 14,
        fontWeight: weight ?? 400,
        fontStyle: italic ? "italic" : "normal",
        textDecoration: underline
          ? "underline"
          : strike
          ? "line-through"
          : "none",
        textUnderlineOffset: 2,
      }}
    >
      {children}
    </span>
  );
}
