"use client";

import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { AnimatePresence, motion } from "motion/react";
import { ColorPicker } from "./ColorPicker";
import { IconSparkles } from "@/app/components/icons";

type Props = { editor: Editor | null };

export function BubbleMenu({ editor }: Props) {
  const [pos, setPos] = useState<null | {
    top: number;
    left: number;
    mobile: boolean;
  }>(null);
  const [, forceRender] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      const { state, view } = editor;
      const { selection } = state;
      const { from, to, empty } = selection;

      if (empty) {
        setPos(null);
        return;
      }

      // The menu is rendered as a sibling of EditorContent inside the same
      // relatively-positioned wrapper, so convert viewport coords into
      // wrapper-local coords using the ProseMirror DOM rect.
      const pmRect = view.dom.getBoundingClientRect();
      const mobile = window.innerWidth < 640;

      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);

      const menuHeight = menuRef.current?.offsetHeight ?? 130;

      // Above the selection; if too close to the top, put it below
      let viewportY = start.top - menuHeight - 10;
      if (viewportY < 70) viewportY = end.bottom + 10;

      if (mobile) {
        // Fixed sheet spanning the viewport width
        setPos({ top: viewportY, left: 0, mobile: true });
      } else {
        const cx = (start.left + end.right) / 2;
        const menuWidth = menuRef.current?.offsetWidth ?? 480;
        const menuHalf = menuWidth / 2;
        const clampedViewportX = Math.max(
          12 + menuHalf,
          Math.min(cx, window.innerWidth - 12 - menuHalf),
        );
        setPos({
          top: viewportY - pmRect.top,
          left: clampedViewportX - pmRect.left,
          mobile: false,
        });
      }
      forceRender((n) => n + 1);
    };

    const scrollRoot = editor.view.dom.closest(".alinea-scroll");
    const onScroll = () => update();

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    editor.on("focus", update);
    editor.on("blur", () => setPos(null));
    scrollRoot?.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
      editor.off("focus", update);
      scrollRoot?.removeEventListener("scroll", onScroll);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          className={`${pos.mobile ? "fixed" : "absolute"} z-30 flex flex-col gap-1 rounded-2xl pointer-events-auto`}
          style={{
            top: pos.top,
            ...(pos.mobile
              ? { left: 12, right: 12 }
              : { left: pos.left, transform: "translateX(-50%)" }),
            padding: 6,
            maxWidth: pos.mobile ? undefined : "min(560px, calc(100vw - 24px))",
            background: "var(--surface-glass-strong)",
            border:
              "1px solid color-mix(in oklab, var(--color-ember-500) 35%, transparent)",
            boxShadow:
              "0 20px 60px -18px rgba(0,0,0,0.35), 0 0 0 1px color-mix(in oklab, var(--color-ember-500) 8%, transparent)",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Row 1 — Format text (scrolls if needed on mobile) */}
          <div
            className="flex items-center gap-0.5"
            style={{ overflowX: "auto", maxWidth: "100%" }}
          >
            <StylePicker editor={editor} />

            <Sep />

            <FmtBtn
              title="Gras"
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              label="B"
              weight={700}
            />
            <FmtBtn
              title="Italique"
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              label="I"
              italic
            />
            <FmtBtn
              title="Souligné"
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              label="U"
              underline
            />
            <FmtBtn
              title="Barré"
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              label="S"
              strike
            />
            <FmtBtn
              title="Code inline"
              active={editor.isActive("code")}
              onClick={() => editor.chain().focus().toggleCode().run()}
              label={"</>"}
              mono
            />

            <Sep />

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
                    style={{ fontSize: 13, marginBottom: 1 }}
                  >
                    A
                  </span>
                  <span
                    className="rounded-sm"
                    style={{
                      width: 12,
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
                    fontSize: 12,
                    background: "var(--accent-tint-strong)",
                    color: "var(--color-parchment-100)",
                  }}
                >
                  H
                </span>
              }
            />

            <FmtBtn
              title="Lien"
              active={editor.isActive("link")}
              onClick={() => {
                const previous = editor.getAttributes("link").href ?? "";
                const url = window.prompt("URL du lien", previous);
                if (url === null) return;
                if (url === "") {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .unsetLink()
                    .run();
                  return;
                }
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: url })
                  .run();
              }}
              icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1 1M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 1 0 7 7l1-1" />
                </svg>
              }
            />

            <Sep />

            <FmtBtn
              title="Indice"
              active={editor.isActive("subscript")}
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              label="x₂"
              small
            />
            <FmtBtn
              title="Exposant"
              active={editor.isActive("superscript")}
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              label="x²"
              small
            />
          </div>

          {/* Row 2 — Block-level (align, list, clear) */}
          <div
            className="flex items-center gap-0.5"
            style={{
              borderTop: "1px solid var(--hairline-soft)",
              paddingTop: 4,
              marginTop: 2,
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            <FmtBtn
              title="Aligner à gauche"
              active={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              icon={<AlignIcon d="M4 6h16M4 10h10M4 14h16M4 18h10" />}
            />
            <FmtBtn
              title="Centrer"
              active={editor.isActive({ textAlign: "center" })}
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              icon={<AlignIcon d="M4 6h16M7 10h10M4 14h16M7 18h10" />}
            />
            <FmtBtn
              title="Aligner à droite"
              active={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              icon={<AlignIcon d="M4 6h16M10 10h10M4 14h16M10 18h10" />}
            />
            <FmtBtn
              title="Justifier"
              active={editor.isActive({ textAlign: "justify" })}
              onClick={() => editor.chain().focus().setTextAlign("justify").run()}
              icon={<AlignIcon d="M4 6h16M4 10h16M4 14h16M4 18h16" />}
            />

            <Sep />

            <FmtBtn
              title="Liste à puces"
              active={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="4" cy="7" r="1.4" fill="currentColor" strokeWidth="0" />
                  <circle cx="4" cy="12" r="1.4" fill="currentColor" strokeWidth="0" />
                  <circle cx="4" cy="17" r="1.4" fill="currentColor" strokeWidth="0" />
                  <path d="M9 7h12M9 12h12M9 17h12" />
                </svg>
              }
            />
            <FmtBtn
              title="Liste numérotée"
              active={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 7h12M9 12h12M9 17h12" />
                  <text x="2" y="8.5" fontSize="7" fontFamily="sans-serif" fill="currentColor" strokeWidth="0">1</text>
                  <text x="2" y="13.5" fontSize="7" fontFamily="sans-serif" fill="currentColor" strokeWidth="0">2</text>
                  <text x="2" y="18.5" fontSize="7" fontFamily="sans-serif" fill="currentColor" strokeWidth="0">3</text>
                </svg>
              }
            />
            <FmtBtn
              title="Liste de tâches"
              active={editor.isActive("taskList")}
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="5" height="5" rx="1" />
                  <rect x="3" y="13" width="5" height="5" rx="1" />
                  <path d="M10 7.5h11M10 15.5h11" />
                  <path d="M4 7l1 1 2-2" strokeWidth="1.4" />
                </svg>
              }
            />

            <Sep />

            <FmtBtn
              title="Effacer le formatage"
              onClick={() =>
                editor.chain().focus().unsetAllMarks().run()
              }
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M14 4l6 6-10 10-6-6z" />
                </svg>
              }
            />
          </div>

          {/* Row 3 — IA (labels only until V0.5) */}
          <div
            className="flex items-center gap-0.5"
            style={{
              borderTop: "1px solid var(--hairline-soft)",
              paddingTop: 4,
              marginTop: 2,
              overflowX: "auto",
              maxWidth: "100%",
            }}
          >
            <span
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-sans flex-shrink-0"
              style={{
                padding: "3px 6px",
                color: "var(--color-ember-300)",
              }}
            >
              <IconSparkles style={{ width: 10, height: 10 }} />
              IA
            </span>
            {["Réécrire", "Raccourcir", "Étendre", "Ton", "Continuer", "Traduire"].map(
              (label) => (
                <button
                  key={label}
                  className="text-xs font-sans px-2 py-1 rounded-md text-parchment-300 hover:text-parchment-100 flex-shrink-0"
                  title="Bientôt — l'IA se branche à la prochaine itération"
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----- Style picker (block type) inside the BubbleMenu ---------------- */

function StylePicker({ editor }: { editor: Editor }) {
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

  const label = editor.isActive("heading", { level: 1 })
    ? "T1"
    : editor.isActive("heading", { level: 2 })
    ? "T2"
    : editor.isActive("heading", { level: 3 })
    ? "T3"
    : editor.isActive("blockquote")
    ? "❝"
    : editor.isActive("codeBlock")
    ? "</>"
    : "P";

  const opts: Array<{ label: string; hint: string; run: () => void }> = [
    { label: "Paragraphe", hint: "P", run: () => editor.chain().focus().setParagraph().run() },
    { label: "Titre 1", hint: "H1", run: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "Titre 2", hint: "H2", run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Titre 3", hint: "H3", run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Citation", hint: "❝", run: () => editor.chain().focus().toggleBlockquote().run() },
    { label: "Bloc de code", hint: "</>", run: () => editor.chain().focus().toggleCodeBlock().run() },
  ];

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-md text-parchment-300 hover:text-parchment-100"
        style={{
          padding: "0 8px",
          height: 26,
          background: "var(--pill-bg)",
          border: "1px solid var(--hairline)",
          fontSize: 11,
        }}
        title="Type de bloc"
      >
        <span className="font-display tabular-nums" style={{ fontSize: 12 }}>{label}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor" className="opacity-60">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.1 }}
            className="absolute z-40 rounded-2xl overflow-hidden"
            style={{
              top: "calc(100% + 4px)",
              left: 0,
              width: 170,
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
                onMouseDown={(e) => {
                  e.preventDefault();
                  o.run();
                  setOpen(false);
                }}
                className="w-full flex items-center justify-between rounded-md text-left text-parchment-200 font-sans"
                style={{ padding: "6px 10px", fontSize: 12 }}
              >
                <span>{o.label}</span>
                <span className="text-parchment-500 tabular-nums text-[10px]">{o.hint}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AlignIcon({ d }: { d: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Sep() {
  return (
    <div
      aria-hidden
      className="mx-1 flex-shrink-0"
      style={{
        width: 1,
        height: 18,
        background: "var(--hairline-soft)",
      }}
    />
  );
}

function FmtBtn({
  title,
  active,
  onClick,
  label,
  icon,
  weight,
  italic,
  underline,
  strike,
  mono,
  small,
}: {
  title: string;
  active?: boolean;
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  weight?: number;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  mono?: boolean;
  small?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="rounded-md flex items-center justify-center transition-colors flex-shrink-0"
      style={{
        width: 28,
        height: 26,
        background: active ? "var(--accent-tint-strong)" : "transparent",
        color: active
          ? "var(--color-parchment-50)"
          : "var(--color-parchment-300)",
        border: active
          ? "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
          : "1px solid transparent",
      }}
    >
      {icon ?? (
        <span
          style={{
            fontFamily: mono
              ? "ui-monospace, monospace"
              : "var(--font-display)",
            fontSize: mono ? 10 : small ? 11 : 14,
            fontWeight: weight ?? 400,
            fontStyle: italic ? "italic" : "normal",
            textDecoration: underline
              ? "underline"
              : strike
              ? "line-through"
              : "none",
            textUnderlineOffset: 2,
            lineHeight: 1,
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}
