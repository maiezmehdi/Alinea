"use client";

import { useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { IconSparkles, IconCommand } from "./icons";

type TileKey =
  | "ai-inline"
  | "workspace"
  | "publish"
  | "typography"
  | "themes"
  | "voice"
  | "prompt"
  | "canvas"
  | "import";

type Tile = {
  key: TileKey;
  label: string;
  title: string;
  body: string;
  span: "sm" | "md" | "lg";
  visual:
    | "ai"
    | "workspace"
    | "publish"
    | "typography"
    | "themes"
    | "voice"
    | "prompt"
    | "canvas"
    | "import";
};

const tiles: Tile[] = [
  {
    key: "ai-inline",
    label: "Écriture IA",
    title: "L'IA vit dans le texte.",
    body:
      "Sélectionne une phrase, un menu flottant t'offre Réécrire · Raccourcir · Continuer · Traduire. Pas de sidebar, pas de chat à côté.",
    span: "lg",
    visual: "ai",
  },
  {
    key: "workspace",
    label: "Google Workspace",
    title: "Une seule auth.",
    body: "Gmail · Drive · Calendar · Docs. Alinéa lit le contexte que tu autorises.",
    span: "md",
    visual: "workspace",
  },
  {
    key: "publish",
    label: "Publier",
    title: "PDF, Docs, Notion.",
    body: "Quatre templates PDF, push bidirectionnel Docs et Notion, export Markdown propre.",
    span: "md",
    visual: "publish",
  },
  {
    key: "typography",
    label: "Typographie",
    title: "Spectral. Crimson.",
    body: "Feuille contextuelle iOS pour la typo. Police, taille, interligne, marges — sans quitter le canvas.",
    span: "md",
    visual: "typography",
  },
  {
    key: "themes",
    label: "Thèmes",
    title: "Ambre & blanc cassé.",
    body: "Deux atmosphères qui se répondent. La chaleur reste, la lumière change.",
    span: "sm",
    visual: "themes",
  },
  {
    key: "voice",
    label: "Voice memory",
    title: "Écrit comme toi.",
    body: "Alinéa apprend ton style au fil des documents. L'IA n'écrit plus « générique ».",
    span: "sm",
    visual: "voice",
  },
  {
    key: "prompt",
    label: "Prompt persistant",
    title: "⌘K partout.",
    body: "Une barre toujours accessible en bas du canvas. Insère un tableau, un titre, une image, une recherche.",
    span: "sm",
    visual: "prompt",
  },
  {
    key: "canvas",
    label: "Canvas",
    title: "Edit ↔ Preview.",
    body: "Un même document. Deux regards. Le mode Preview est ce que verra ton lecteur.",
    span: "sm",
    visual: "canvas",
  },
  {
    key: "import",
    label: "Import universel",
    title: "Amène tout ton passé.",
    body: "docx, gdoc, md, txt, rtf, odt, epub, pdf, .eml, export Notion. Alinéa lit ton passé et le remet en forme.",
    span: "md",
    visual: "import",
  },
];

const spring = { type: "spring" as const, stiffness: 220, damping: 26, mass: 0.9 };

export function BentoShowcase() {
  const [active, setActive] = useState<TileKey>("ai-inline");

  return (
    <section className="max-w-6xl mx-auto px-8 pb-32">
      <div className="text-center mb-12">
        <div className="inline-block text-xs font-sans uppercase tracking-[0.2em] text-ember-300 mb-3">
          Ce que fait Alinéa
        </div>
        <h2
          className="font-display text-parchment-50"
          style={{ fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1.05 }}
        >
          Une seule surface pour tout écrire.
          <br />
          <span className="italic text-ember-200">Rien de ce qui alourdit.</span>
        </h2>
        <p
          className="mt-5 max-w-xl mx-auto text-parchment-400 font-serif"
          style={{ fontSize: 16, lineHeight: 1.55 }}
        >
          Clique une case pour la faire grandir — les autres se réorganisent.
        </p>
      </div>

      <LayoutGroup id="bento-grid">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gridAutoRows: 160,
          }}
        >
          {tiles.map((t) => {
            const isActive = active === t.key;
            const span = isActive ? "lg" : t.span;
            const gridSpan =
              span === "lg"
                ? { gridColumn: "span 2", gridRow: "span 2" }
                : span === "md"
                ? { gridColumn: "span 2", gridRow: "span 1" }
                : { gridColumn: "span 1", gridRow: "span 1" };
            return (
              <motion.button
                key={t.key}
                layout
                layoutId={`tile-${t.key}`}
                onClick={() => setActive(t.key)}
                transition={spring}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985 }}
                className="relative overflow-hidden rounded-2xl text-left cursor-pointer group"
                style={{
                  ...gridSpan,
                  background: isActive
                    ? "var(--surface-glass-strong)"
                    : "var(--surface-card)",
                  border: isActive
                    ? "1px solid color-mix(in oklab, var(--color-ember-500) 35%, transparent)"
                    : "1px solid var(--hairline)",
                  boxShadow: isActive
                    ? "var(--shadow-elevated), 0 0 40px -8px color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
                    : "var(--shadow-elevated)",
                }}
              >
                <motion.div
                  layout="position"
                  transition={spring}
                  className="relative h-full w-full flex flex-col"
                  style={{ padding: isActive ? 24 : 16 }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-[10px] font-sans uppercase tracking-widest"
                      style={{ color: "var(--color-ember-300)" }}
                    >
                      {t.label}
                    </span>
                  </div>

                  <div
                    className="font-display text-parchment-50"
                    style={{
                      fontSize: isActive ? 22 : 15,
                      lineHeight: 1.15,
                      letterSpacing: "-0.01em",
                      transition: "font-size 240ms ease",
                    }}
                  >
                    {t.title}
                  </div>

                  {(isActive || t.span !== "sm") && (
                    <motion.p
                      layout="position"
                      initial={false}
                      className="mt-1.5 text-parchment-400 font-serif"
                      style={{
                        fontSize: isActive ? 14 : 12,
                        lineHeight: 1.5,
                        maxWidth: isActive ? 360 : undefined,
                      }}
                    >
                      {t.body}
                    </motion.p>
                  )}

                  {/* Visual demo (only on the large / active tile) */}
                  {isActive && (
                    <motion.div
                      className="mt-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, ...spring }}
                    >
                      <TileVisual visual={t.visual} />
                    </motion.div>
                  )}
                </motion.div>
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </section>
  );
}

function TileVisual({ visual }: { visual: Tile["visual"] }) {
  switch (visual) {
    case "ai":
      return (
        <div
          className="rounded-xl overflow-hidden font-serif"
          style={{
            background: "var(--pill-bg)",
            border: "1px solid var(--hairline)",
            padding: "14px 16px",
            fontSize: 13,
            lineHeight: 1.55,
            color: "var(--color-parchment-200)",
          }}
        >
          Some afternoons feel as if they{" "}
          <span
            style={{
              background:
                "color-mix(in oklab, var(--color-ember-500) 22%, transparent)",
              color: "var(--color-parchment-100)",
              padding: "0 3px",
              borderRadius: 2,
            }}
          >
            arrive without a purpose
          </span>
          .
          <div
            className="mt-3 flex items-center gap-1.5 font-sans"
            style={{ fontSize: 11 }}
          >
            {["Réécrire", "Raccourcir", "Ton", "Continuer"].map((a, i) => (
              <span
                key={a}
                className="rounded-md px-1.5 py-0.5"
                style={{
                  background: i === 0 ? "var(--accent-tint-strong)" : "transparent",
                  border:
                    i === 0
                      ? "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
                      : "1px solid var(--hairline)",
                  color: "var(--color-parchment-200)",
                }}
              >
                {a}
              </span>
            ))}
            <span
              className="ml-auto inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 tabular-nums"
              style={{
                background: "var(--track-soft)",
                color: "var(--color-parchment-400)",
                fontSize: 10,
              }}
            >
              <IconCommand style={{ width: 9, height: 9 }} />K
            </span>
          </div>
        </div>
      );
    case "workspace":
      return (
        <div className="flex flex-wrap gap-1.5">
          {["Gmail", "Drive", "Calendar", "Docs"].map((s) => (
            <span
              key={s}
              className="rounded-full px-2.5 py-1 text-parchment-200 font-sans"
              style={{
                fontSize: 11,
                background: "var(--track-soft)",
                border: "1px solid var(--hairline)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      );
    case "publish":
      return (
        <div
          className="flex items-center gap-2 rounded-xl"
          style={{
            padding: "10px 12px",
            background: "var(--pill-bg)",
            border: "1px solid var(--hairline)",
          }}
        >
          {["PDF", "DOCX", "MD", "Notion"].map((f, i) => (
            <span
              key={f}
              className="rounded-md px-2 py-0.5 font-sans text-parchment-200"
              style={{
                fontSize: 11,
                background: i === 0 ? "var(--accent-tint-strong)" : "var(--track-soft)",
                border:
                  i === 0
                    ? "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
                    : "1px solid transparent",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      );
    case "typography":
      return (
        <div
          className="flex items-center gap-3 rounded-xl"
          style={{
            padding: "10px 14px",
            background: "var(--pill-bg)",
            border: "1px solid var(--hairline)",
          }}
        >
          {[
            { label: "Original", family: "var(--font-serif)" },
            { label: "Spectral", family: '"Spectral", serif' },
            { label: "Crimson", family: '"Crimson Text", serif' },
          ].map((f, i) => (
            <span key={f.label} className="flex flex-col items-center gap-0.5">
              <span
                style={{
                  fontFamily: f.family,
                  fontSize: 22,
                  color:
                    i === 1
                      ? "var(--color-parchment-50)"
                      : "var(--color-parchment-400)",
                  lineHeight: 1,
                }}
              >
                Aa
              </span>
              <span
                className="font-sans"
                style={{
                  fontSize: 9,
                  color:
                    i === 1
                      ? "var(--color-parchment-200)"
                      : "var(--color-parchment-500)",
                }}
              >
                {f.label}
              </span>
            </span>
          ))}
        </div>
      );
    case "themes":
      return (
        <div className="flex gap-2">
          {[
            {
              key: "dark",
              bg: "linear-gradient(135deg, #2a1610 0%, #0a0503 100%)",
              dot: "#e59a3f",
            },
            {
              key: "light",
              bg: "linear-gradient(135deg, #fbf6ec 0%, #f5edd9 100%)",
              dot: "#a06614",
            },
          ].map((c) => (
            <span
              key={c.key}
              className="rounded-xl flex-1 flex items-center justify-center"
              style={{
                height: 44,
                background: c.bg,
                border: "1px solid var(--hairline)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: c.dot }}
              />
            </span>
          ))}
        </div>
      );
    case "voice":
      return (
        <div
          className="rounded-xl font-serif italic text-parchment-300"
          style={{
            padding: "10px 12px",
            background: "var(--pill-bg)",
            border: "1px solid var(--hairline)",
            fontSize: 12,
            lineHeight: 1.4,
          }}
        >
          « Ton style, appris document après document. »
        </div>
      );
    case "prompt":
      return (
        <div
          className="flex items-center gap-2 rounded-xl"
          style={{
            padding: "8px 10px",
            background: "var(--pill-bg)",
            border: "1px solid var(--hairline)",
          }}
        >
          <IconSparkles
            style={{ width: 12, height: 12, color: "var(--color-ember-300)" }}
          />
          <span
            className="font-sans text-parchment-400 truncate"
            style={{ fontSize: 11 }}
          >
            Insère un tableau des ventes…
          </span>
          <span
            className="ml-auto inline-flex items-center gap-0.5 tabular-nums font-sans"
            style={{
              fontSize: 9,
              color: "var(--color-parchment-500)",
              padding: "1px 4px",
              borderRadius: 4,
              background: "var(--track-soft)",
            }}
          >
            <IconCommand style={{ width: 8, height: 8 }} />K
          </span>
        </div>
      );
    case "import":
      return (
        <div className="flex flex-wrap gap-1.5">
          {[".docx", ".gdoc", ".md", ".txt", ".rtf", ".odt", ".epub", ".pdf", ".eml", "Notion"].map(
            (f, i) => (
              <span
                key={f}
                className="rounded-md px-2 py-0.5 font-sans tabular-nums text-parchment-200"
                style={{
                  fontSize: 11,
                  background:
                    i === 0 ? "var(--accent-tint-strong)" : "var(--track-soft)",
                  border:
                    i === 0
                      ? "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)"
                      : "1px solid var(--hairline)",
                }}
              >
                {f}
              </span>
            ),
          )}
        </div>
      );
    case "canvas":
      return (
        <div
          className="flex items-center gap-1 rounded-full p-0.5 self-start"
          style={{
            background: "var(--pill-bg)",
            border: "1px solid var(--hairline)",
          }}
        >
          <span
            className="rounded-full px-2.5 py-0.5 font-sans text-parchment-100"
            style={{
              fontSize: 10,
              background: "var(--accent-tint-strong)",
              border:
                "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)",
            }}
          >
            Edit
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 font-sans text-parchment-400"
            style={{ fontSize: 10 }}
          >
            Preview
          </span>
        </div>
      );
  }
}
