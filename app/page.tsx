import { PhoneFrame } from "./components/PhoneFrame";
import { CanvasReadingView } from "./components/CanvasReadingView";
import { TypographySheet } from "./components/TypographySheet";
import { DesktopMockup } from "./components/DesktopMockup";
import { ThemeToggle } from "./components/ThemeToggle";

const paragraphsLeft = [
  "Some afternoons feel as if they arrive without a purpose. The cup stays warm in her hands, the street outside moves slowly, and for once she does not try to fill the quiet with plans. She lets the hour pass without naming it useful. The room is still, the light is low, and nothing asks to be fixed.",
  "She thought that rest was not something to deserve. It was something to notice before the day became too loud.",
];

const paragraphsRight = [
  "She does not reach for her phone. Not yet. The messages can stay where they are, folded inside the small bright screen, waiting for a version of her that feels less tired.",
  "For now, there is only the cup, the window, and the slow comfort of not explaining herself.",
];

function RowCells({ cells, last }: { cells: string[]; last?: boolean }) {
  const border = last ? {} : { borderTop: "1px solid var(--hairline-veil)" };
  return (
    <>
      <div
        className="p-5 text-parchment-200 font-serif italic"
        style={{ fontSize: 13, ...border }}
      >
        {cells[0]}
      </div>
      {cells.slice(1, 4).map((c, i) => (
        <div
          key={i}
          className="p-5 text-center text-parchment-400 border-l border-white/[0.04]"
          style={{ fontSize: 12, lineHeight: 1.5, ...border }}
        >
          {c}
        </div>
      ))}
      <div
        className="p-5 text-center text-parchment-50"
        style={{
          background: "var(--accent-tint)",
          borderLeft:
            "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
          fontSize: 12,
          lineHeight: 1.5,
          ...border,
        }}
      >
        {cells[4]}
      </div>
    </>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Ambient glow layers */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 800px 500px at 50% 200px, rgba(214,138,60,0.25), transparent 70%)",
        }}
      />

      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-8 pt-8">
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-display italic text-ember-300 leading-none"
            style={{ fontSize: 28 }}
          >
            A
          </span>
          <span
            className="font-display text-parchment-100 leading-none"
            style={{ fontSize: 22, letterSpacing: "-0.01em" }}
          >
            linéa
          </span>
        </div>
        <nav className="flex items-center gap-6 text-parchment-400 text-sm font-sans">
          <a
            href="#showcase"
            className="hidden sm:inline hover:text-parchment-100 transition-colors"
          >
            Concept
          </a>
          <a
            href="#desktop"
            className="hidden sm:inline hover:text-parchment-100 transition-colors"
          >
            Design
          </a>
          <a
            href="#pillars"
            className="hidden md:inline hover:text-parchment-100 transition-colors"
          >
            Piliers
          </a>
          <ThemeToggle />
          <span
            className="hidden md:inline px-3 py-1.5 rounded-full text-xs font-sans text-ember-200"
            style={{
              border:
                "1px solid color-mix(in oklab, var(--color-ember-500) 35%, transparent)",
              background: "var(--accent-tint)",
            }}
          >
            Maquette v0.2
          </span>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto text-center px-8 pt-28 pb-16">
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-8 text-xs font-sans text-parchment-300"
          style={{
            border:
              "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
            background: "var(--accent-tint)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-ember-400 shadow-[0_0_8px_rgba(214,138,60,0.8)]" />
          Là où la pensée devient paragraphe.
        </div>
        <h1
          className="font-display text-parchment-50 mx-auto"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          Un éditeur pour ceux qui{" "}
          <span className="italic text-ember-200">écrivent</span>{" "}
          pour de vrai.
        </h1>
        <p
          className="mt-6 mx-auto text-parchment-300 font-serif"
          style={{
            fontSize: 20,
            lineHeight: 1.55,
            maxWidth: 640,
          }}
        >
          Beau comme un livre. Intelligent comme un co&#8209;auteur. Rapide comme
          une conversation. Connecté à ta vraie vie de travail — Gmail, Drive,
          Calendar, Notion.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <a
            href="#showcase"
            className="text-sm font-sans px-5 py-3 rounded-full font-medium"
            style={{
              color: "#1a0d09",
              background:
                "linear-gradient(180deg, #f6d194 0%, #e59a3f 100%)",
              boxShadow:
                "0 10px 30px -8px rgba(214,138,60,0.6), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            Voir la maquette
          </a>
          <a
            href="#pillars"
            className="text-sm font-sans px-5 py-3 rounded-full text-parchment-200 transition-colors hover:text-parchment-50"
            style={{
              border:
                "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
              background: "var(--pill-bg)",
            }}
          >
            Lire le manifeste
          </a>
        </div>
      </section>

      {/* Two-phone showcase */}
      <section
        id="showcase"
        className="relative flex flex-col items-center px-4 pb-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 900px 500px at 50% 45%, rgba(214,138,60,0.30), transparent 70%)",
          }}
        />

        <div className="flex flex-wrap items-center justify-center gap-8 max-w-6xl">
          {/* Left phone — reading mode with drop cap */}
          <div className="relative" style={{ transform: "rotate(-2deg)" }}>
            <PhoneFrame scale={1.05}>
              <CanvasReadingView
                paragraphs={paragraphsLeft}
                showDropCap
                progress={0.44}
                words={{ read: 142, total: 320 }}
                scale={1.05}
              />
            </PhoneFrame>
            <div
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 text-parchment-400 text-xs font-sans whitespace-nowrap"
            >
              <span
                className="w-1 h-1 rounded-full bg-ember-400 shadow-[0_0_6px_rgba(214,138,60,0.8)]"
              />
              Mode lecture · typo Spectral
            </div>
          </div>

          {/* Right phone — bottom sheet expanded */}
          <div className="relative" style={{ transform: "rotate(2deg)" }}>
            <PhoneFrame scale={1.05}>
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-hidden">
                  <CanvasReadingView
                    paragraphs={paragraphsRight}
                    showDropCap={false}
                    progress={0.66}
                    words={{ read: 212, total: 320 }}
                    scale={1.05}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0">
                  <TypographySheet scale={1.05} />
                </div>
              </div>
            </PhoneFrame>
            <div
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 text-parchment-400 text-xs font-sans whitespace-nowrap"
            >
              <span
                className="w-1 h-1 rounded-full bg-ember-400 shadow-[0_0_6px_rgba(214,138,60,0.8)]"
              />
              Feuille contextuelle · typographie
            </div>
          </div>
        </div>

        <p
          className="mt-24 max-w-lg text-center text-parchment-400 font-serif italic"
          style={{ fontSize: 16, lineHeight: 1.6 }}
        >
          « La même feuille inférieure change de contenu selon le geste — typographie,
          IA, blocs, export, connecteurs. Un seul chrome, plusieurs vies. »
        </p>
      </section>

      {/* Desktop mockup */}
      <section
        id="desktop"
        className="max-w-6xl mx-auto px-8 pb-32"
      >
        <div className="text-center mb-10">
          <div
            className="inline-block text-xs font-sans uppercase tracking-[0.2em] text-ember-300 mb-3"
          >
            Desktop
          </div>
          <h2
            className="font-display text-parchment-50"
            style={{ fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1.05 }}
          >
            Une seule surface. Edit et Preview.
          </h2>
          <p
            className="mt-4 max-w-xl mx-auto text-parchment-400 font-serif"
            style={{ fontSize: 17, lineHeight: 1.55 }}
          >
            Un même document, deux regards. Le mode <em>Preview</em> n&apos;est pas
            un aperçu technique — c&apos;est le rendu que verra ton lecteur.
          </p>
        </div>
        <DesktopMockup />
        <p className="mt-6 text-center text-parchment-500 text-xs font-sans">
          Astuce · essaie <kbd className="text-ember-300">Edit / Preview</kbd> et{" "}
          <kbd className="text-ember-300">⌘K</kbd> dans la barre supérieure
        </p>
      </section>

      {/* Competitive positioning */}
      <section className="max-w-6xl mx-auto px-8 pb-32">
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-sans uppercase tracking-[0.2em] text-ember-300 mb-3">
            Positionnement
          </div>
          <h2
            className="font-display text-parchment-50"
            style={{ fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1.05 }}
          >
            Ce qu&apos;aucun autre ne fait à la fois.
          </h2>
          <p
            className="mt-4 max-w-2xl mx-auto text-parchment-400 font-serif"
            style={{ fontSize: 17, lineHeight: 1.55 }}
          >
            Google Docs a la collaboration. Notion a la structure. Claude a
            l&apos;intelligence. Alinéa a <em>tout ça</em> — dans une surface
            d&apos;écriture qui a été <em>designée</em>.
          </p>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background:
              "var(--surface-card)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] text-xs font-sans">
            {/* Header row */}
            <div className="p-5 text-parchment-500 uppercase tracking-widest text-[10px]">
              Critère
            </div>
            {[
              { label: "Google Docs", tone: "muted" },
              { label: "Notion", tone: "muted" },
              { label: "Claude · ChatGPT", tone: "muted" },
              { label: "Alinéa", tone: "brand" },
            ].map((c) => (
              <div
                key={c.label}
                className={`p-5 text-center border-l border-white/[0.04] ${
                  c.tone === "brand"
                    ? "text-parchment-50"
                    : "text-parchment-400"
                }`}
                style={
                  c.tone === "brand"
                    ? {
                        background: "var(--accent-tint)",
                        borderLeft:
                          "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
                      }
                    : {}
                }
              >
                <div className="font-medium text-[11px]">{c.label}</div>
              </div>
            ))}

            {/* Rows */}
            {[
              [
                "Surface d'écriture",
                "Marges A4, toolbar Word",
                "Blocs, base de données",
                "Chat + textarea",
                "Canvas éditorial, mode Preview",
              ],
              [
                "IA",
                "Gemini en sidebar",
                "AI en dropdown, générique",
                "L'IA est le produit",
                "Inline, contextuelle, voix apprise",
              ],
              [
                "Rendu final",
                "Doc Word 1997",
                "Page web wiki",
                "Bulle de chat",
                "Typographie de livre",
              ],
              [
                "Écosystème",
                "Google Workspace",
                "Écosystème fermé",
                "Aucun natif",
                "Google + Notion + export universel",
              ],
              [
                "Vitesse blanc → utile",
                "15 min de mise en forme",
                "Structure d'abord, écrire ensuite",
                "Copier-coller vers un autre outil",
                "30 sec de prompt, sortie mise en forme",
              ],
              [
                "Sensation",
                "Outil de bureau",
                "OS de productivité",
                "Assistant à côté du texte",
                "Objet qu'on ouvre par plaisir",
              ],
            ].map((row, i) => (
              <RowCells key={i} cells={row} last={i === 5} />
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section
        id="pillars"
        className="max-w-6xl mx-auto px-8 pb-32"
      >
        <div className="text-center mb-14">
          <div className="inline-block text-xs font-sans uppercase tracking-[0.2em] text-ember-300 mb-3">
            Manifeste
          </div>
          <h2
            className="font-display text-parchment-50"
            style={{ fontSize: 44, letterSpacing: "-0.02em", lineHeight: 1.05 }}
          >
            Trois piliers. Une même exigence.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              label: "Beauté du canvas",
              title: "Un objet qu'on a envie d'ouvrir",
              text: "Typographie éditoriale, lumière ambrée, silence autour du texte. Alinéa ne ressemble à aucun éditeur. C'est ce qui fait qu'on l'ouvre pour prendre une note perso.",
            },
            {
              label: "IA dans le texte",
              title: "Un co-auteur, pas un chatbot",
              text: "Sélection → menu flottant. ⌘K → commande naturelle. L'IA apprend ton style au fil des documents. Pas de sidebar chat, jamais.",
            },
            {
              label: "Blanc → publié",
              title: "Trente secondes de prompt suffisent",
              text: "Écran vide. Une intention en langage naturel. L'IA propose une structure, streame un premier jet, tu prends la main. Export PDF, .docx, Markdown ou push vers Docs et Notion.",
            },
          ].map((p, i) => (
            <div
              key={p.label}
              className="rounded-2xl p-8 flex flex-col"
              style={{
                background:
                  "var(--surface-glass)",
                border: "1px solid var(--hairline)",
                boxShadow: "var(--shadow-elevated)",
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span
                  className="text-xs font-sans tabular-nums"
                  style={{ color: "#efb361" }}
                >
                  0{i + 1}
                </span>
                <span
                  className="text-xs font-sans uppercase tracking-widest text-parchment-400"
                >
                  {p.label}
                </span>
              </div>
              <h3
                className="font-display text-parchment-50 mb-3"
                style={{ fontSize: 22, letterSpacing: "-0.01em", lineHeight: 1.15 }}
              >
                {p.title}
              </h3>
              <p
                className="text-parchment-400 font-serif"
                style={{ fontSize: 15, lineHeight: 1.6 }}
              >
                {p.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Integration & export strip */}
      <section className="max-w-6xl mx-auto px-8 pb-32">
        <div
          className="rounded-2xl p-10 relative overflow-hidden"
          style={{
            background:
              "var(--surface-card)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 500px 300px at 90% 0%, rgba(214,138,60,0.15), transparent 70%)",
            }}
          />
          <div className="relative flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <div className="text-xs font-sans uppercase tracking-[0.2em] text-ember-300 mb-3">
                Écosystème
              </div>
              <h3
                className="font-display text-parchment-50 mb-4"
                style={{ fontSize: 30, letterSpacing: "-0.01em", lineHeight: 1.1 }}
              >
                Connecté à ta vraie vie de travail.
              </h3>
              <p
                className="text-parchment-400 font-serif"
                style={{ fontSize: 15, lineHeight: 1.65, maxWidth: 480 }}
              >
                Une seule authentification Google. Alinéa lit tes emails avec
                permission, sait qui tu vois cet après-midi, écrit dans le
                dossier Drive que tu choisis, pousse vers Google Docs ou Notion.
                Jamais quitter le canvas pour aller chercher un contexte.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              {[
                ["Gmail", "Résumer · répondre"],
                ["Google Drive", "Import · sauvegarde"],
                ["Google Calendar", "Prep de réunion"],
                ["Google Docs", "Push bidirectionnel"],
                ["Notion", "Publier vers workspace"],
                ["PDF · .docx · MD", "Export en un clic"],
              ].map(([label, meta]) => (
                <div
                  key={label}
                  className="rounded-xl p-4"
                  style={{
                    background: "var(--track-soft)",
                    border: "1px solid var(--hairline)",
                  }}
                >
                  <div className="text-parchment-100 font-sans text-sm">
                    {label}
                  </div>
                  <div className="text-parchment-500 font-sans text-xs mt-0.5">
                    {meta}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-8 pb-12 pt-6 flex items-center justify-between text-parchment-500 text-xs font-sans">
        <div className="flex items-baseline gap-1">
          <span className="font-display italic text-ember-400 text-base leading-none">
            A
          </span>
          <span className="font-display text-parchment-300 leading-none">
            linéa
          </span>
          <span className="ml-3">Maquette · itération 1</span>
        </div>
        <div>
          Prochaine étape : câbler Gemini + auth Google · vrai éditeur Tiptap
        </div>
      </footer>
    </main>
  );
}
