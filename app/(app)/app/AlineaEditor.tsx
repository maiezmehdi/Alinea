"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { AnimatePresence, motion } from "motion/react";

import { Toolbar } from "./Toolbar";
import { findFont } from "./fonts";
import { IconCommand, IconSparkles } from "@/app/components/icons";
import {
  downloadFile,
  htmlToMarkdown,
  htmlToWordDoc,
  readImportedFile,
} from "./io";

const STORAGE_KEY = "alinea-doc-v1";
const FONT_KEY = "alinea-font";
const TITLE_KEY = "alinea-title";
const SIZE_KEY = "alinea-size";
const LH_KEY = "alinea-lh";

const initialContent = `
<h1>Sans titre</h1>
<p>Bienvenue dans ton canvas. Commence à écrire — ou appuie sur <code>⌘K</code> pour ouvrir la palette d'actions.</p>
<p>Sélectionne un morceau de texte pour voir apparaître les options de format et d'IA. Glisse un fichier <code>.md</code>, <code>.txt</code> ou <code>.html</code> sur la fenêtre pour l'importer.</p>
`.trim();

export function AlineaEditor() {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [fontKey, setFontKey] = useState("spectral");
  const [fontSize, setFontSize] = useState(17);
  const [lineHeight, setLineHeight] = useState(1.7);
  const [docTitle, setDocTitle] = useState("Sans titre");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [dropActive, setDropActive] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: { HTMLAttributes: { class: "editor-code" } },
        blockquote: { HTMLAttributes: { class: "editor-quote" } },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return "Un titre…";
          return "Commence à écrire, ou appuie sur ⌘K pour appeler l'IA…";
        },
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false, allowBase64: true }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Subscript,
      Superscript,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Typography,
      CharacterCount,
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
        setSavedAt(
          new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      } catch {}
    },
  });

  /* --- restore persisted state --- */
  useEffect(() => {
    if (!editor) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.length > 20) editor.commands.setContent(saved);
      const title = localStorage.getItem(TITLE_KEY);
      if (title) setDocTitle(title);
      const font = localStorage.getItem(FONT_KEY);
      if (font) setFontKey(font);
      const size = localStorage.getItem(SIZE_KEY);
      if (size) setFontSize(Number(size));
      const lh = localStorage.getItem(LH_KEY);
      if (lh) setLineHeight(Number(lh));
    } catch {}
  }, [editor]);

  useEffect(() => {
    try {
      localStorage.setItem(FONT_KEY, fontKey);
    } catch {}
  }, [fontKey]);
  useEffect(() => {
    try {
      localStorage.setItem(TITLE_KEY, docTitle);
    } catch {}
  }, [docTitle]);
  useEffect(() => {
    try {
      localStorage.setItem(SIZE_KEY, String(fontSize));
    } catch {}
  }, [fontSize]);
  useEffect(() => {
    try {
      localStorage.setItem(LH_KEY, String(lineHeight));
    } catch {}
  }, [lineHeight]);

  /* --- keyboard shortcuts --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      } else if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        // Save is implicit; flash the saved indicator
        setSavedAt(
          new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      } else if (mod && e.key.toLowerCase() === "p") {
        e.preventDefault();
        window.print();
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setFileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* --- drag & drop import --- */
  useEffect(() => {
    let dragCount = 0;
    const onEnter = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
        dragCount++;
        setDropActive(true);
      }
    };
    const onLeave = (e: DragEvent) => {
      dragCount--;
      if (dragCount <= 0) {
        dragCount = 0;
        setDropActive(false);
      }
    };
    const onOver = (e: DragEvent) => e.preventDefault();
    const onDrop = async (e: DragEvent) => {
      e.preventDefault();
      dragCount = 0;
      setDropActive(false);
      const file = e.dataTransfer?.files?.[0];
      if (file && editor) {
        try {
          const { html, suggestedTitle } = await readImportedFile(file);
          editor.commands.setContent(html);
          setDocTitle(suggestedTitle);
        } catch {
          alert("Impossible de lire ce fichier.");
        }
      }
    };
    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("dragover", onOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [editor]);

  const currentFont = findFont(fontKey);
  const words = editor?.storage.characterCount?.words?.() ?? 0;
  const readMin = Math.max(1, Math.round(words / 200));

  /* --- file actions --- */
  const actions = {
    newDoc: () => {
      if (
        !window.confirm(
          "Créer un nouveau document ? Le contenu actuel sera remplacé (assure-toi d'avoir téléchargé une copie).",
        )
      )
        return;
      editor?.commands.setContent("<h1>Sans titre</h1><p></p>");
      setDocTitle("Sans titre");
    },
    openFile: () => fileInputRef.current?.click(),
    rename: () => {
      setRenaming(true);
      requestAnimationFrame(() => titleInputRef.current?.focus());
    },
    duplicate: () => {
      const filename = safeFileName(docTitle) + "-copie.html";
      const html = editor?.getHTML() ?? "";
      downloadFile(html, filename, "text/html");
    },
    print: () => window.print(),
    exportMd: () => {
      const md = htmlToMarkdown(editor?.getHTML() ?? "");
      downloadFile(md, safeFileName(docTitle) + ".md", "text/markdown");
    },
    exportHtml: () => {
      const html = editor?.getHTML() ?? "";
      downloadFile(html, safeFileName(docTitle) + ".html", "text/html");
    },
    exportDoc: () => {
      const html = editor?.getHTML() ?? "";
      const wrapped = htmlToWordDoc(html, docTitle);
      downloadFile(
        wrapped,
        safeFileName(docTitle) + ".doc",
        "application/msword",
      );
    },
    exportPdf: () => {
      window.print();
    },
    copyPlain: () => {
      const text = editor?.getText() ?? "";
      navigator.clipboard?.writeText(text);
    },
    share: async () => {
      const html = editor?.getHTML() ?? "";
      const encoded = compressToBase64(html);
      const url = `${window.location.origin}${window.location.pathname}#doc=${encoded}`;
      try {
        await navigator.clipboard.writeText(url);
        alert(
          "Lien copié — quiconque l'ouvre verra une copie de ton document.",
        );
      } catch {
        alert("Ton navigateur ne permet pas la copie automatique.");
      }
    },
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    try {
      const { html, suggestedTitle } = await readImportedFile(file);
      editor.commands.setContent(html);
      setDocTitle(suggestedTitle);
    } catch {
      alert("Impossible de lire ce fichier.");
    }
    e.target.value = "";
  };

  return (
    <div className="flex-1 flex flex-col relative">
      {/* Document header */}
      <div
        className="flex items-center gap-3"
        style={{
          padding: "14px 22px",
          borderBottom: "1px solid var(--hairline-veil)",
        }}
      >
        <div className="flex-1 min-w-0">
          {renaming ? (
            <input
              ref={titleInputRef}
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              onBlur={() => setRenaming(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === "Escape") {
                  setRenaming(false);
                }
              }}
              className="w-full bg-transparent outline-none font-display text-parchment-50 truncate"
              style={{
                fontSize: 22,
                letterSpacing: "-0.01em",
                borderBottom: "1px solid var(--color-ember-400)",
                padding: "2px 0",
              }}
            />
          ) : (
            <button
              onClick={actions.rename}
              className="text-left font-display text-parchment-50 truncate max-w-full block"
              style={{ fontSize: 22, letterSpacing: "-0.01em" }}
              title="Renommer"
            >
              {docTitle || "Sans titre"}
            </button>
          )}
        </div>

        <div
          className="flex items-center gap-2 text-parchment-500 font-sans"
          style={{ fontSize: 11 }}
        >
          <span className="tabular-nums">{words} mots · {readMin} min</span>
          <span>·</span>
          <span>{savedAt ? `sauvegardé ${savedAt}` : "auto"}</span>
        </div>

        <ModeToggle mode={mode} onChange={setMode} />

        <div className="relative">
          <button
            onClick={() => setFileMenuOpen((v) => !v)}
            className="rounded-lg flex items-center justify-center text-parchment-300 hover:text-parchment-100"
            style={{
              width: 32,
              height: 30,
              background: "var(--pill-bg)",
              border: "1px solid var(--hairline)",
            }}
            title="Fichier"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
          <AnimatePresence>
            {fileMenuOpen && (
              <FileMenu
                onClose={() => setFileMenuOpen(false)}
                actions={actions}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toolbar */}
      {mode === "edit" && (
        <Toolbar
          editor={editor}
          fontKey={fontKey}
          onFontChange={setFontKey}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
          lineHeight={lineHeight}
          onLineHeightChange={setLineHeight}
        />
      )}

      {/* Canvas */}
      <div
        className="relative flex-1 overflow-auto"
        style={{ padding: "40px 40px 120px" }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: 720,
            fontFamily: currentFont.css,
            fontSize,
            lineHeight,
          }}
        >
          {mode === "edit" ? (
            <EditorContent editor={editor} className="alinea-canvas" />
          ) : (
            <div
              className="alinea-canvas alinea-preview"
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() ?? "" }}
            />
          )}
        </div>
      </div>

      {/* Bottom AI prompt bar */}
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
          <span
            className="font-sans text-parchment-400"
            style={{ fontSize: 13 }}
          >
            Demande à Alinéa — écrire, réécrire, résumer, traduire, insérer, publier…
          </span>
          <span
            className="ml-auto inline-flex items-center gap-1 tabular-nums font-sans"
            style={{
              fontSize: 10,
              color: "var(--color-parchment-400)",
              background: "var(--track-soft)",
              padding: "2px 6px",
              borderRadius: 5,
              border: "1px solid var(--hairline-veil)",
            }}
          >
            <IconCommand style={{ width: 9, height: 9 }} />K
          </span>
        </button>
      </div>

      {/* Palette */}
      <AnimatePresence>
        {paletteOpen && editor && (
          <Palette
            editor={editor}
            actions={actions}
            onClose={() => setPaletteOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drop zone overlay */}
      <AnimatePresence>
        {dropActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            style={{
              background: "var(--scrim)",
              backdropFilter: "blur(2px)",
            }}
          >
            <div
              className="rounded-2xl text-center font-serif"
              style={{
                padding: "40px 60px",
                background: "var(--surface-glass-strong)",
                border:
                  "2px dashed color-mix(in oklab, var(--color-ember-500) 55%, transparent)",
              }}
            >
              <div
                className="font-display italic text-ember-300 mb-2"
                style={{ fontSize: 36, lineHeight: 1 }}
              >
                A
              </div>
              <div
                className="text-parchment-100"
                style={{ fontSize: 18 }}
              >
                Lâche ton fichier ici.
              </div>
              <div
                className="text-parchment-400 mt-1"
                style={{ fontSize: 13 }}
              >
                .md · .txt · .html accepté
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt,.html,.htm"
        onChange={handleFileInput}
        style={{ display: "none" }}
      />
    </div>
  );
}

/* ----- ModeToggle ------------------------------------------------------ */

function ModeToggle({
  mode,
  onChange,
}: {
  mode: "edit" | "preview";
  onChange: (m: "edit" | "preview") => void;
}) {
  return (
    <div
      className="relative flex rounded-full p-0.5"
      style={{ background: "var(--pill-bg)", border: "1px solid var(--hairline)" }}
    >
      {(["edit", "preview"] as const).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            className={`relative text-xs font-sans rounded-full ${
              active ? "text-parchment-100" : "text-parchment-400"
            }`}
            style={{
              padding: "4px 12px",
              background: active ? "var(--accent-tint-strong)" : "transparent",
              border: active
                ? "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
                : "1px solid transparent",
            }}
          >
            {m === "edit" ? "Edit" : "Preview"}
          </button>
        );
      })}
    </div>
  );
}

/* ----- FileMenu -------------------------------------------------------- */

function FileMenu({
  onClose,
  actions,
}: {
  onClose: () => void;
  actions: FileActions;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const c = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener("mousedown", c);
    return () => document.removeEventListener("mousedown", c);
  }, [onClose]);

  const groups: Array<{ label: string; items: Array<{ label: string; hint?: string; run: () => void }> }> = [
    {
      label: "Document",
      items: [
        { label: "Nouveau", hint: "efface le canvas", run: actions.newDoc },
        { label: "Ouvrir un fichier…", hint: ".md .txt .html", run: actions.openFile },
        { label: "Renommer", run: actions.rename },
        { label: "Dupliquer", hint: "→ fichier .html", run: actions.duplicate },
      ],
    },
    {
      label: "Publier",
      items: [
        { label: "Télécharger en Markdown", hint: ".md", run: actions.exportMd },
        { label: "Télécharger en HTML", hint: ".html", run: actions.exportHtml },
        { label: "Télécharger au format Word", hint: ".doc", run: actions.exportDoc },
        { label: "Exporter en PDF", hint: "impression", run: actions.exportPdf },
        { label: "Imprimer", hint: "⌘P", run: actions.print },
      ],
    },
    {
      label: "Partager",
      items: [
        { label: "Copier le lien (encodé)", run: actions.share },
        { label: "Copier le texte brut", run: actions.copyPlain },
      ],
    },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -4, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.98 }}
      transition={{ duration: 0.12 }}
      className="absolute z-40 rounded-2xl overflow-hidden"
      style={{
        top: "calc(100% + 6px)",
        right: 0,
        width: 260,
        padding: 4,
        background: "var(--surface-glass-strong)",
        border:
          "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
        boxShadow: "var(--shadow-palette)",
      }}
    >
      {groups.map((g, gi) => (
        <div key={g.label} style={{ marginBottom: gi === groups.length - 1 ? 0 : 2 }}>
          <div
            className="text-[10px] uppercase tracking-widest text-parchment-500 font-sans"
            style={{ padding: "10px 12px 4px" }}
          >
            {g.label}
          </div>
          {g.items.map((it) => (
            <button
              key={it.label}
              onClick={() => {
                it.run();
                onClose();
              }}
              className="w-full flex items-center justify-between rounded-md text-left text-parchment-200 font-sans"
              style={{ padding: "6px 12px", fontSize: 13 }}
            >
              <span>{it.label}</span>
              {it.hint && (
                <span
                  className="text-parchment-500 tabular-nums"
                  style={{ fontSize: 10 }}
                >
                  {it.hint}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}
    </motion.div>
  );
}

/* ----- Palette (⌘K) --------------------------------------------------- */

type FileActions = ReturnType<typeof buildFileActionsType>;
function buildFileActionsType() {
  return {
    newDoc: () => {},
    openFile: () => {},
    rename: () => {},
    duplicate: () => {},
    print: () => {},
    exportMd: () => {},
    exportHtml: () => {},
    exportDoc: () => {},
    exportPdf: () => {},
    copyPlain: () => {},
    share: async () => {},
  };
}

function Palette({
  editor,
  actions,
  onClose,
}: {
  editor: Editor;
  actions: FileActions;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  const groups: Array<{
    label: string;
    items: Array<{ label: string; hint?: string; run?: () => void }>;
  }> = [
    {
      label: "Écrire avec l'IA",
      items: [
        { label: "Réécrire la sélection", hint: "IA · bientôt" },
        { label: "Continuer le paragraphe", hint: "IA · bientôt" },
        { label: "Résumer le document", hint: "IA · bientôt" },
        { label: "Changer le ton", hint: "IA · bientôt" },
        { label: "Traduire en anglais", hint: "IA · bientôt" },
      ],
    },
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
          label: "Liste de tâches",
          hint: "☐",
          run: () => editor.chain().focus().toggleTaskList().run(),
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
        {
          label: "Tableau 3 × 3",
          hint: "table",
          run: () =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run(),
        },
        {
          label: "Image (URL)",
          hint: "insert",
          run: () => {
            const url = window.prompt("URL de l'image");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          },
        },
      ],
    },
    {
      label: "Fichier",
      items: [
        { label: "Nouveau document", run: actions.newDoc },
        { label: "Ouvrir un fichier…", hint: ".md .txt .html", run: actions.openFile },
        { label: "Renommer", run: actions.rename },
        { label: "Dupliquer", run: actions.duplicate },
      ],
    },
    {
      label: "Publier",
      items: [
        { label: "Télécharger en Markdown", hint: ".md", run: actions.exportMd },
        { label: "Télécharger en HTML", hint: ".html", run: actions.exportHtml },
        { label: "Télécharger au format Word", hint: ".doc", run: actions.exportDoc },
        { label: "Exporter en PDF", hint: "print", run: actions.exportPdf },
        { label: "Imprimer", hint: "⌘P", run: actions.print },
        { label: "Copier le lien de partage", run: actions.share },
        { label: "Copier le texte brut", run: actions.copyPlain },
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
          width: 560,
          maxHeight: 520,
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Écrire, formater, insérer, publier, partager…"
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
                  onClick={() => {
                    if (it.run) {
                      it.run();
                      onClose();
                    }
                  }}
                  className="w-full flex items-center justify-between rounded-lg text-left"
                  style={{
                    padding: "7px 14px",
                    color: "var(--color-parchment-200)",
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

/* ----- helpers --------------------------------------------------------- */

function safeFileName(name: string): string {
  return (name || "alinea-document")
    .replace(/[^\p{L}\p{N}\s\-_]/gu, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 60) || "alinea-document";
}

function compressToBase64(s: string): string {
  try {
    return btoa(unescape(encodeURIComponent(s)));
  } catch {
    return "";
  }
}
