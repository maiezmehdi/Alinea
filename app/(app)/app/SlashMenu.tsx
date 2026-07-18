"use client";

import { useEffect, useMemo, useState } from "react";
import type { Editor } from "@tiptap/react";
import { AnimatePresence, motion } from "motion/react";

type SlashCommand = {
  label: string;
  hint: string;
  keywords: string[];
  run: (editor: Editor) => void;
  icon: string;
};

const commands: SlashCommand[] = [
  {
    label: "Titre 1",
    hint: "grand titre",
    keywords: ["h1", "titre1", "heading1", "title"],
    icon: "H1",
    run: (e) => e.chain().focus().deleteRange({ from: 0, to: 0 }).toggleHeading({ level: 1 }).run(),
  },
  {
    label: "Titre 2",
    hint: "sous-titre",
    keywords: ["h2", "titre2", "heading2"],
    icon: "H2",
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Titre 3",
    hint: "petit titre",
    keywords: ["h3", "titre3", "heading3"],
    icon: "H3",
    run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: "Liste à puces",
    hint: "bullet",
    keywords: ["bullet", "ul", "list", "liste", "puces"],
    icon: "•",
    run: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Liste numérotée",
    hint: "ordered",
    keywords: ["ordered", "ol", "num", "numerotee"],
    icon: "1.",
    run: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Liste de tâches",
    hint: "todo",
    keywords: ["todo", "task", "check", "cases", "tâches", "taches"],
    icon: "☐",
    run: (e) => e.chain().focus().toggleTaskList().run(),
  },
  {
    label: "Citation",
    hint: "quote",
    keywords: ["quote", "citation", "blockquote"],
    icon: "❝",
    run: (e) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    label: "Bloc de code",
    hint: "code block",
    keywords: ["code", "codeblock", "pre"],
    icon: "</>",
    run: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    label: "Séparateur",
    hint: "hr",
    keywords: ["hr", "separateur", "divider", "rule"],
    icon: "―",
    run: (e) => e.chain().focus().setHorizontalRule().run(),
  },
  {
    label: "Tableau 3 × 3",
    hint: "table",
    keywords: ["table", "tableau", "grid"],
    icon: "▦",
    run: (e) =>
      e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    label: "Image (URL)",
    hint: "image",
    keywords: ["image", "img", "picture", "photo"],
    icon: "🖼",
    run: (e) => {
      const url = window.prompt("URL de l'image");
      if (url) e.chain().focus().setImage({ src: url }).run();
    },
  },
];

type Props = { editor: Editor | null };

export function SlashMenu({ editor }: Props) {
  const [state, setState] = useState<null | {
    top: number;
    left: number;
    query: string;
    triggerFrom: number;
  }>(null);
  const [index, setIndex] = useState(0);

  const filtered = useMemo(() => {
    if (!state) return commands;
    const q = state.query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.includes(q)),
    );
  }, [state]);

  useEffect(() => {
    if (!editor) return;

    let opened = false;

    const closeMenu = () => {
      opened = false;
      setState(null);
      setIndex(0);
    };

    const positionAtCaret = () => {
      const { from } = editor.state.selection;
      const coords = editor.view.coordsAtPos(from);
      const pmRect = editor.view.dom.getBoundingClientRect();
      const menuWidth = 280;
      const clampedX = Math.max(
        12,
        Math.min(coords.left, window.innerWidth - 12 - menuWidth),
      );
      return {
        top: coords.bottom - pmRect.top + 6,
        left: clampedX - pmRect.left,
      };
    };

    const openMenu = (triggerFrom: number) => {
      const p = positionAtCaret();
      setState({
        top: p.top,
        left: p.left,
        query: "",
        triggerFrom,
      });
      setIndex(0);
      opened = true;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // Show menu on "/" when the current block is empty
      if (!opened && e.key === "/") {
        const { state } = editor;
        const { $from } = state.selection;
        const parent = $from.parent;
        const isEmptyBlock =
          parent.type.name === "paragraph" && parent.textContent === "";
        if (isEmptyBlock) {
          openMenu($from.pos + 1);
        }
        return;
      }

      if (!opened) return;

      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[index];
        if (cmd) execute(cmd);
      }
    };

    const execute = (cmd: SlashCommand) => {
      if (!editor || !state) {
        closeMenu();
        return;
      }
      // Delete the "/" and any query text that was typed after it
      const { from } = editor.state.selection;
      editor
        .chain()
        .focus()
        .deleteRange({ from: state.triggerFrom - 1, to: from })
        .run();
      cmd.run(editor);
      closeMenu();
    };

    const onUpdate = () => {
      if (!opened) return;
      const { state: eState } = editor;
      const { from } = eState.selection;
      // Find the current "/" position — cursor should be after the trigger.
      if (from < 1) {
        closeMenu();
        return;
      }
      const doc = eState.doc;
      // Look back to find our anchor "/"
      // The query is whatever's between the anchor and the caret.
      // For simplicity we track from the state we already stored.
      const currentBlock = eState.selection.$from.parent;
      if (currentBlock.textContent === "") {
        closeMenu();
        return;
      }
      // Extract query from the paragraph's text after "/"
      const text = currentBlock.textContent;
      const slashIdx = text.lastIndexOf("/");
      if (slashIdx === -1) {
        closeMenu();
        return;
      }
      const query = text.slice(slashIdx + 1);
      setState((s) => (s ? { ...s, query } : s));
      setIndex(0);
    };

    editor.view.dom.addEventListener("keydown", onKeyDown, true);
    editor.on("transaction", onUpdate);

    return () => {
      editor.view.dom.removeEventListener("keydown", onKeyDown, true);
      editor.off("transaction", onUpdate);
    };
  }, [editor, filtered, index, state]);

  if (!editor) return null;

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.12 }}
          className="absolute z-30 rounded-2xl overflow-hidden pointer-events-auto"
          style={{
            top: state.top,
            left: state.left,
            width: 280,
            maxHeight: 320,
            display: "flex",
            flexDirection: "column",
            background: "var(--surface-glass-strong)",
            border:
              "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
            boxShadow: "var(--shadow-palette)",
          }}
        >
          <div
            className="text-[10px] uppercase tracking-widest text-parchment-500 font-sans"
            style={{ padding: "10px 14px 6px" }}
          >
            Insérer un bloc
          </div>
          <div style={{ overflowY: "auto", padding: "0 4px 6px" }}>
            {filtered.length === 0 && (
              <div
                className="text-center text-parchment-500 font-sans italic"
                style={{ padding: "12px 14px", fontSize: 12 }}
              >
                Rien trouvé.
              </div>
            )}
            {filtered.map((c, i) => (
              <button
                key={c.label}
                onMouseEnter={() => setIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  // Trigger execution via keyboard-like path
                  const evt = new KeyboardEvent("keydown", { key: "Enter" });
                  editor.view.dom.dispatchEvent(evt);
                }}
                className="w-full flex items-center gap-2.5 rounded-md text-left"
                style={{
                  padding: "6px 10px",
                  background:
                    index === i ? "var(--accent-tint)" : "transparent",
                  border:
                    index === i
                      ? "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)"
                      : "1px solid transparent",
                }}
              >
                <span
                  className="flex items-center justify-center rounded-md flex-shrink-0 font-display"
                  style={{
                    width: 26,
                    height: 26,
                    background: "var(--pill-bg)",
                    border: "1px solid var(--hairline)",
                    fontSize: 12,
                    color: "var(--color-parchment-200)",
                  }}
                >
                  {c.icon}
                </span>
                <span className="flex flex-col flex-1 min-w-0">
                  <span
                    className="text-parchment-100 font-sans"
                    style={{ fontSize: 13 }}
                  >
                    {c.label}
                  </span>
                  <span
                    className="text-parchment-500 font-sans"
                    style={{ fontSize: 10 }}
                  >
                    {c.hint}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
