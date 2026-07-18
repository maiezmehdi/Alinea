"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { AnimatePresence, motion } from "motion/react";
import { ColorPicker } from "./ColorPicker";
import { IconSparkles } from "@/app/components/icons";

type Props = { editor: Editor | null };

export function BubbleMenu({ editor }: Props) {
  const [pos, setPos] = useState<null | { top: number; left: number }>(null);
  const [, forceRender] = useState(0);

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

      const scrollRoot = view.dom.closest(".alinea-scroll") as HTMLElement | null;
      const containerRect = scrollRoot?.getBoundingClientRect();
      const scrollTop = scrollRoot?.scrollTop ?? 0;
      const scrollLeft = scrollRoot?.scrollLeft ?? 0;

      const start = view.coordsAtPos(from);
      const end = view.coordsAtPos(to);
      const cx = (start.left + end.right) / 2;
      const top = start.top;

      if (!containerRect) {
        setPos({ top: top - 56 + scrollTop, left: cx });
      } else {
        setPos({
          top: top - containerRect.top + scrollTop - 56,
          left: cx - containerRect.left + scrollLeft,
        });
      }
      forceRender((n) => n + 1);
    };

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    editor.on("focus", update);
    editor.on("blur", () => setPos(null));

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
      editor.off("focus", update);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          className="absolute z-30 flex flex-col gap-1 rounded-2xl pointer-events-auto"
          style={{
            top: Math.max(pos.top, 0),
            left: pos.left,
            transform: "translateX(-50%)",
            padding: 6,
            background: "var(--surface-glass-strong)",
            border:
              "1px solid color-mix(in oklab, var(--color-ember-500) 35%, transparent)",
            boxShadow:
              "0 20px 60px -18px rgba(0,0,0,0.35), 0 0 0 1px color-mix(in oklab, var(--color-ember-500) 8%, transparent)",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Row 1 — Format */}
          <div className="flex items-center gap-0.5">
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

          {/* Row 2 — IA (labels only until V0.5) */}
          <div
            className="flex items-center gap-0.5"
            style={{
              borderTop: "1px solid var(--hairline-soft)",
              paddingTop: 4,
              marginTop: 2,
            }}
          >
            <span
              className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-sans"
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
                  className="text-xs font-sans px-2 py-1 rounded-md text-parchment-300 hover:text-parchment-100"
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

function Sep() {
  return (
    <div
      aria-hidden
      className="mx-1"
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
      className="rounded-md flex items-center justify-center transition-colors"
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
