"use client";

import { useCallback, useEffect, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { IconCommand, IconSparkles } from "@/app/components/icons";

const STORAGE_KEY = "alinea-doc-v1";
const FONT_KEY = "alinea-font";

type Mode = "edit" | "preview";

type FontChoice = {
  key: string;
  label: string;
  cssFamily: string;
};

const fonts: FontChoice[] = [
  { key: "spectral", label: "Spectral", cssFamily: '"Spectral", Georgia, serif' },
  { key: "crimson", label: "Crimson", cssFamily: '"Crimson Text", Georgia, serif' },
  { key: "inter", label: "Inter", cssFamily: '"Inter", system-ui, sans-serif' },
];

const initialContent = `
<h1>Quiet Hours</h1>
<p><em>par Mira Vale</em></p>
<p>Some afternoons feel as if they arrive without a purpose. The cup stays warm in her hands, the street outside moves slowly, and for once she does not try to fill the quiet with plans. She lets the hour pass without naming it useful. The room is still, the light is low, and nothing asks to be fixed.</p>
<p>She thought that rest was not something to deserve. It was something to notice before the day became too loud.</p>
<p>She does not reach for her phone. Not yet. The messages can stay where they are, folded inside the small bright screen, waiting for a version of her that feels less tired.</p>
<p>For now, there is only the cup, the window, and the slow comfort of not <mark>explaining herself</mark>.</p>
`.trim();

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.6 };

export function AlineaEditor() {
  const [mode, setMode] = useState<Mode>("edit");
  const [font, setFont] = useState<string>("spectral");
  const [fontSize, setFontSize] = useState(17);
  const [lineHeight, setLineHeight] = useState(1.7);
  const [maxWidth, setMaxWidth] = useState(680);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [selectionMenu, setSelectionMenu] = useState<null | {
    top: number;
    left: number;
  }>(null);
  const [savedAt, setSavedAt] = useState<string>("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: { HTMLAttributes: { class: "editor-code" } },
        blockquote: { HTMLAttributes: { class: "editor-quote" } },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return "Un titre…";
          return "Commence à écrire, ou appuie ⌘K pour appeler l'IA…";
        },
      }),
      Highlight,
      CharacterCount,
      Typography,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "alinea-content outline-none focus:outline-none",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      try {
        localStorage.setItem(STORAGE_KEY, editor.getHTML());
        setSavedAt(new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
      } catch {}
    },
    onSelectionUpdate: ({ editor }) => {
      updateSelectionMenu(editor);
    },
    onBlur: () => {
      setSelectionMenu(null);
    },
  });

  const updateSelectionMenu = useCallback((editor: Editor) => {
    const { from, to } = editor.state.selection;
    if (from === to) {
      setSelectionMenu(null);
      return;
    }
    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);
    const container = editor.view.dom.getBoundingClientRect();
    const midX = (start.left + end.right) / 2 - container.left;
    const top = start.top - container.top - 52;
    setSelectionMenu({
      top: Math.max(top, 0),
      left: Math.max(midX, 40),
    });
  }, []);

  // Restore saved content
  useEffect(() => {
    if (!editor) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.length > 20) editor.commands.setContent(saved);
      const savedFont = localStorage.getItem(FONT_KEY);
      if (savedFont) setFont(savedFont);
    } catch {}
  }, [editor]);

  // Keyboard shortcut for palette
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Persist font
  useEffect(() => {
    try {
      localStorage.setItem(FONT_KEY, font);
    } catch {}
  }, [font]);

  const currentFont = fonts.find((f) => f.key === font) ?? fonts[0];
  const characters = editor?.storage.characterCount?.characters?.() ?? 0;
  const words = editor?.storage.characterCount?.words?.() ?? 0;
  const readMin = Math.max(1, Math.round(words / 200));

  return (
    <div className="flex-1 flex flex-col">
      {/* Sub-header: mode toggle + saved indicator */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "10px 22px",
          borderBottom: "1px solid var(--hairline-veil)",
        }}
      >
        <div className="flex items-center gap-3">
          <LayoutGroup id="editor-mode">
            <div
              className="relative flex rounded-full p-0.5"
              style={{ background: "var(--pill-bg)", border: "1px solid var(--hairline)" }}
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
                  >
                    {active && (
                      <motion.span
                        layoutId="editor-mode-thumb"
                        transition={spring}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "var(--accent-tint-strong)",
                          border:
                            "1px solid color-mix(in oklab, var(--color-ember-500) 40%, transparent)",
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

          {/* Font picker */}
          <div
            className="flex rounded-full p-0.5"
            style={{ background: "var(--pill-bg)", border: "1px solid var(--hairline)" }}
          >
            {fonts.map((f) => {
              const active = font === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFont(f.key)}
                  className={`text-xs px-3 py-1 rounded-full ${
                    active ? "text-parchment-100" : "text-parchment-400"
                  }`}
                  style={{
                    fontFamily: f.cssFamily,
                    background: active ? "var(--accent-tint)" : "transparent",
                    border: active
                      ? "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
                      : "1px solid transparent",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="flex items-center gap-3 text-parchment-500 font-sans"
          style={{ fontSize: 11 }}
        >
          <span className="tabular-nums">{words} mots · {readMin} min</span>
          <span>·</span>
          <span>
            {savedAt ? `sauvegardé ${savedAt}` : "sauvegarde locale auto"}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 overflow-auto" style={{ padding: "40px 40px 120px" }}>
        <div
          className="mx-auto relative"
          style={{
            maxWidth,
            fontFamily: currentFont.cssFamily,
            fontSize,
            lineHeight,
          }}
        >
          {mode === "edit" ? (
            <>
              <EditorContent
                editor={editor}
                className={"alinea-canvas"}
              />
              {selectionMenu && editor && (
                <SelectionMenu editor={editor} top={selectionMenu.top} left={selectionMenu.left} />
              )}
            </>
          ) : (
            <div
              className="alinea-canvas alinea-preview"
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() ?? "" }}
            />
          )}
        </div>
      </div>

      {/* Persistent prompt bar */}
      <div
        className="sticky bottom-0"
        style={{
          padding: "10px 12px 14px",
          borderTop: "1px solid var(--hairline-veil)",
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--color-ink-950) 60%, transparent) 40%, var(--color-ink-950) 100%)",
        }}
      >
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="w-full max-w-3xl mx-auto flex items-center gap-2.5 rounded-xl text-left"
          style={{
            padding: "10px 14px",
            background: "var(--pill-bg)",
            border: "1px solid var(--hairline)",
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
          <span className="font-sans text-parchment-400" style={{ fontSize: 13 }}>
            Écris, formate, insère un titre, un tableau, une liste…
          </span>
          <span className="ml-auto inline-flex items-center gap-1 tabular-nums font-sans"
            style={{
              fontSize: 10,
              color: "var(--color-parchment-400)",
              background: "var(--track-soft)",
              padding: "2px 6px",
              borderRadius: 5,
              border: "1px solid var(--hairline-veil)",
            }}>
            <IconCommand style={{ width: 9, height: 9 }} />K
          </span>
        </button>
      </div>

      {/* Command palette */}
      <AnimatePresence>
        {paletteOpen && editor && (
          <Palette editor={editor} onClose={() => setPaletteOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----- Selection menu -------------------------------------------------- */

function SelectionMenu({
  editor,
  top,
  left,
}: {
  editor: Editor;
  top: number;
  left: number;
}) {
  const btn = (label: string, active: boolean, onClick: () => void, style?: React.CSSProperties) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="rounded-md flex items-center justify-center text-parchment-300 hover:text-parchment-100"
      style={{
        width: 26,
        height: 26,
        background: active ? "var(--accent-tint-strong)" : "transparent",
        border: active
          ? "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
          : "1px solid transparent",
        color: active ? "var(--color-parchment-50)" : undefined,
        ...style,
      }}
    >
      {label}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.98 }}
      transition={{ duration: 0.12 }}
      className="absolute z-30 flex flex-col gap-1 rounded-2xl"
      style={{
        top,
        left,
        transform: "translateX(-50%)",
        padding: 6,
        background: "var(--surface-glass-strong)",
        border:
          "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)",
        boxShadow:
          "0 20px 60px -18px rgba(0,0,0,0.35), 0 0 0 1px color-mix(in oklab, var(--color-ember-500) 8%, transparent)",
      }}
    >
      {/* Row 1 — Format */}
      <div className="flex items-center gap-0.5">
        <select
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
              ? "h3"
              : editor.isActive("blockquote")
              ? "quote"
              : "p"
          }
          onChange={(e) => {
            const v = e.target.value;
            const chain = editor.chain().focus();
            if (v === "p") chain.setParagraph().run();
            if (v === "h1") chain.toggleHeading({ level: 1 }).run();
            if (v === "h2") chain.toggleHeading({ level: 2 }).run();
            if (v === "h3") chain.toggleHeading({ level: 3 }).run();
            if (v === "quote") chain.toggleBlockquote().run();
          }}
          className="rounded-md font-sans text-parchment-200 outline-none"
          style={{
            padding: "5px 8px",
            fontSize: 12,
            background: "var(--pill-bg)",
            border: "1px solid var(--hairline)",
          }}
        >
          <option value="p">Paragraphe</option>
          <option value="h1">Titre 1</option>
          <option value="h2">Titre 2</option>
          <option value="h3">Titre 3</option>
          <option value="quote">Citation</option>
        </select>
        <Sep />
        {btn("B", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), {
          fontFamily: "var(--font-display)",
          fontSize: 14,
          fontWeight: 700,
        })}
        {btn("I", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), {
          fontFamily: "var(--font-display)",
          fontSize: 14,
          fontStyle: "italic",
        })}
        {btn("S", editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run(), {
          fontFamily: "var(--font-display)",
          fontSize: 14,
          textDecoration: "line-through",
        })}
        {btn("</>", editor.isActive("code"), () => editor.chain().focus().toggleCode().run(), {
          fontFamily: "ui-monospace, monospace",
          fontSize: 11,
        })}
        <Sep />
        {btn(
          "H",
          editor.isActive("highlight"),
          () => editor.chain().focus().toggleHighlight().run(),
          {
            fontFamily: "var(--font-display)",
            fontSize: 13,
            background: editor.isActive("highlight")
              ? "var(--accent-tint-strong)"
              : "var(--accent-tint)",
            color: "var(--color-parchment-100)",
            border: "1px solid transparent",
          },
        )}
        <Sep />
        {btn("•", editor.isActive("bulletList"), () =>
          editor.chain().focus().toggleBulletList().run(),
        )}
        {btn("1.", editor.isActive("orderedList"), () =>
          editor.chain().focus().toggleOrderedList().run(),
        )}
      </div>

      <div className="mx-1 h-px" style={{ background: "var(--hairline-soft)" }} />

      {/* Row 2 — AI */}
      <div className="flex items-center gap-0.5">
        <span
          className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-sans"
          style={{ padding: "3px 6px", color: "var(--color-ember-300)" }}
        >
          <IconSparkles style={{ width: 10, height: 10 }} />
          IA
        </span>
        {["Réécrire", "Raccourcir", "Étendre", "Ton", "Continuer", "Traduire"].map((label) => (
          <button
            key={label}
            className="text-xs font-sans px-2 py-1 rounded-md text-parchment-300"
            title="Bientôt — Gemini se branche à la prochaine itération"
            onMouseDown={(e) => e.preventDefault()}
          >
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function Sep() {
  return (
    <div
      aria-hidden
      className="w-px mx-1"
      style={{ height: 18, background: "var(--hairline-soft)" }}
    />
  );
}

/* ----- Palette --------------------------------------------------------- */

type Cmd = { label: string; hint: string; run?: () => void };

function Palette({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  const groups: { label: string; items: Cmd[] }[] = [
    {
      label: "Insérer un bloc",
      items: [
        {
          label: "Titre 1",
          hint: "H1",
          run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
          label: "Titre 2",
          hint: "H2",
          run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          label: "Titre 3",
          hint: "H3",
          run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
          label: "Liste à puces",
          hint: "•",
          run: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          label: "Liste numérotée",
          hint: "1.",
          run: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
          label: "Citation",
          hint: "❝",
          run: () => editor.chain().focus().toggleBlockquote().run(),
        },
        {
          label: "Bloc de code",
          hint: "</>",
          run: () => editor.chain().focus().toggleCodeBlock().run(),
        },
        {
          label: "Séparateur",
          hint: "—",
          run: () => editor.chain().focus().setHorizontalRule().run(),
        },
      ],
    },
    {
      label: "Écrire avec l'IA",
      items: [
        { label: "Réécrire la sélection", hint: "IA · bientôt" },
        { label: "Continuer le paragraphe", hint: "IA · bientôt" },
        { label: "Résumer le document", hint: "IA · bientôt" },
        { label: "Traduire en anglais", hint: "IA · bientôt" },
      ],
    },
    {
      label: "Publier",
      items: [
        {
          label: "Exporter en Markdown",
          hint: ".md",
          run: () => {
            const md = htmlToMarkdown(editor.getHTML());
            downloadFile(md, "alinea-document.md", "text/markdown");
          },
        },
        {
          label: "Exporter en HTML",
          hint: ".html",
          run: () => {
            downloadFile(editor.getHTML(), "alinea-document.html", "text/html");
          },
        },
        {
          label: "Copier le texte brut",
          hint: "clipboard",
          run: () => {
            const text = editor.getText();
            navigator.clipboard?.writeText(text);
          },
        },
      ],
    },
  ];

  const filtered = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((it) =>
        it.label.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <motion.div
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-start justify-center"
      style={{
        background: "var(--scrim)",
        backdropFilter: "blur(4px)",
        paddingTop: 120,
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: -12, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -8, opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="rounded-2xl overflow-hidden"
        style={{
          width: 540,
          maxHeight: 460,
          display: "flex",
          flexDirection: "column",
          background: "var(--surface-glass-strong)",
          border:
            "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)",
          boxShadow: "var(--shadow-palette)",
        }}
      >
        <div
          className="flex items-center gap-3"
          style={{ padding: "16px 20px", borderBottom: "1px solid var(--hairline-soft)" }}
        >
          <IconSparkles
            style={{ width: 16, height: 16, color: "var(--color-ember-300)" }}
          />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Écrire, formater, insérer, exporter…"
            className="flex-1 bg-transparent text-parchment-100 placeholder:text-parchment-500 outline-none font-sans text-sm"
          />
          <span className="text-[10px] text-parchment-500 font-sans">esc</span>
        </div>
        <div style={{ padding: "6px 6px 10px", overflowY: "auto" }}>
          {filtered.length === 0 && (
            <div
              className="text-center text-parchment-500 font-sans italic"
              style={{ padding: "20px 12px", fontSize: 13 }}
            >
              Rien trouvé pour « {query} ».
            </div>
          )}
          {filtered.map((group) => (
            <div key={group.label} style={{ marginBottom: 4 }}>
              <div
                className="text-[10px] uppercase tracking-widest text-parchment-500 font-sans"
                style={{ padding: "10px 14px 4px" }}
              >
                {group.label}
              </div>
              {group.items.map((it) => (
                <button
                  key={it.label}
                  className="w-full flex items-center justify-between rounded-lg text-left"
                  style={{
                    padding: "7px 14px",
                    color: "var(--color-parchment-200)",
                  }}
                  onClick={() => {
                    if (it.run) {
                      it.run();
                      onClose();
                    }
                  }}
                >
                  <span className="font-sans text-sm">{it.label}</span>
                  <span className="text-[10px] text-parchment-500 font-sans">
                    {it.hint}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ----- Helpers --------------------------------------------------------- */

function downloadFile(content: string, name: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function htmlToMarkdown(html: string): string {
  // Minimal HTML → Markdown for common blocks. Not exhaustive; real export
  // will use a proper converter in a later iteration.
  return html
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "# $1\n\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "## $1\n\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "### $1\n\n")
    .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, "_$1_")
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`")
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, "> $1\n\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
    .replace(/<\/(ul|ol)>/gi, "\n")
    .replace(/<(ul|ol)[^>]*>/gi, "")
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n")
    .replace(/<mark[^>]*>([\s\S]*?)<\/mark>/gi, "==$1==")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<hr\s*\/?>/gi, "\n---\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
