"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconSparkles } from "./icons";

type Feedback = {
  id: string;
  metier: string;
  message: string;
  name?: string;
  at: string; // relative label
};

const seed: Feedback[] = [
  {
    id: "s1",
    metier: "Autrice · essais",
    name: "Léa",
    message:
      "C'est la première fois qu'un éditeur me donne envie d'écrire dedans. La feuille typographique est parfaite.",
    at: "il y a 2 jours",
  },
  {
    id: "s2",
    metier: "Product Manager",
    name: "Théo",
    message:
      "L'inline avec Gemini + le push vers Notion, c'est exactement ce que je faisais en trois onglets.",
    at: "il y a 3 jours",
  },
  {
    id: "s3",
    metier: "Journaliste",
    name: "Maya",
    message:
      "Le mode Preview change tout — je lis mon papier au lieu de le rédiger.",
    at: "la semaine dernière",
  },
  {
    id: "s4",
    metier: "Consultant",
    message:
      "Le ⌘K qui lit mes emails et prépare mes memos — plus jamais de doc vide le matin.",
    at: "la semaine dernière",
  },
];

const metierSuggestions = [
  "Autrice · essais",
  "Auteur · fiction",
  "Product Manager",
  "Fondateur / Fondatrice",
  "Consultant / Consultante",
  "Journaliste",
  "Étudiant / Étudiante",
  "Designer",
  "Chercheur / Chercheuse",
  "Enseignant / Enseignante",
  "Développeur / Développeuse",
  "Avocat / Avocate",
];

export function FeedbackSection() {
  const [items, setItems] = useState<Feedback[]>(seed);
  const [metier, setMetier] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [sent, setSent] = useState(false);

  const canSend = metier.trim().length > 1 && message.trim().length > 4;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    const entry: Feedback = {
      id: Math.random().toString(36).slice(2),
      metier: metier.trim(),
      message: message.trim(),
      name: name.trim() || undefined,
      at: "à l'instant",
    };
    setItems([entry, ...items]);
    setMetier("");
    setMessage("");
    setName("");
    setSent(true);
    setTimeout(() => setSent(false), 2400);
  }

  const suggestions = metierSuggestions
    .filter(
      (m) =>
        m.toLowerCase().includes(metier.trim().toLowerCase()) &&
        m.toLowerCase() !== metier.trim().toLowerCase(),
    )
    .slice(0, 5);

  return (
    <section id="feedback" className="max-w-4xl mx-auto px-8 pb-24">
      <div className="text-center mb-10">
        <div className="inline-block text-xs font-sans uppercase tracking-[0.2em] text-ember-300 mb-3">
          Ton avis
        </div>
        <h2
          className="font-display text-parchment-50"
          style={{ fontSize: 32, letterSpacing: "-0.02em", lineHeight: 1.1 }}
        >
          Qu&apos;est-ce qui te ferait quitter Docs ?
        </h2>
        <p
          className="mt-3 max-w-lg mx-auto text-parchment-400 font-serif"
          style={{ fontSize: 14, lineHeight: 1.55 }}
        >
          Deux lignes suffisent. Dis-nous qui tu es — ton métier nous aide à
          entendre qui parle.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={submit}
        className="rounded-2xl relative"
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--hairline)",
          padding: 6,
        }}
      >
        <div className="flex flex-col md:flex-row gap-2">
          {/* Métier */}
          <div className="relative md:w-56 flex-shrink-0">
            <input
              type="text"
              placeholder="Ton métier"
              value={metier}
              onChange={(e) => {
                setMetier(e.target.value);
                setShowSuggest(true);
              }}
              onFocus={() => setShowSuggest(true)}
              onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
              className="w-full rounded-xl bg-transparent outline-none font-sans"
              style={{
                padding: "12px 14px",
                fontSize: 14,
                color: "var(--color-parchment-100)",
                border: "1px solid transparent",
              }}
            />
            {showSuggest && suggestions.length > 0 && (
              <div
                className="absolute z-30 left-0 right-0 top-full mt-1 rounded-xl overflow-hidden"
                style={{
                  background: "var(--surface-glass-strong)",
                  border:
                    "1px solid color-mix(in oklab, var(--color-ember-500) 20%, transparent)",
                  boxShadow: "var(--shadow-elevated)",
                }}
              >
                {suggestions.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setMetier(s);
                      setShowSuggest(false);
                    }}
                    className="w-full text-left font-sans text-parchment-200 hover:text-parchment-50"
                    style={{
                      padding: "8px 14px",
                      fontSize: 13,
                      background: "transparent",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          <div className="flex-1">
            <textarea
              placeholder="Ce qui te ferait changer d'éditeur…"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl bg-transparent outline-none font-sans resize-none"
              style={{
                padding: "12px 14px",
                fontSize: 14,
                lineHeight: 1.5,
                color: "var(--color-parchment-100)",
                border: "1px solid transparent",
              }}
            />
          </div>
        </div>

        <div
          className="flex items-center gap-3 mt-1"
          style={{ padding: "4px 12px 8px" }}
        >
          <input
            type="text"
            placeholder="Prénom (optionnel)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent outline-none font-sans flex-1 text-parchment-300 placeholder:text-parchment-500"
            style={{ fontSize: 12 }}
          />
          <span
            className="text-parchment-500 font-sans"
            style={{ fontSize: 11 }}
          >
            Aucun email requis. Aucun tracking.
          </span>
          <motion.button
            type="submit"
            disabled={!canSend}
            whileHover={canSend ? { y: -1 } : undefined}
            whileTap={canSend ? { scale: 0.97 } : undefined}
            className="rounded-full font-sans font-medium"
            style={{
              padding: "8px 16px",
              fontSize: 13,
              color: canSend ? "#1a0d09" : "var(--color-parchment-500)",
              background: canSend
                ? "linear-gradient(180deg, #f6d194 0%, #e59a3f 100%)"
                : "var(--pill-bg)",
              border: canSend
                ? "1px solid transparent"
                : "1px solid var(--hairline)",
              boxShadow: canSend
                ? "0 8px 22px -6px rgba(214,138,60,0.5), inset 0 1px 0 rgba(255,255,255,0.4)"
                : "none",
              cursor: canSend ? "pointer" : "not-allowed",
              transition: "background 220ms ease, color 220ms ease",
            }}
          >
            Envoyer
          </motion.button>
        </div>

        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute -bottom-9 left-0 right-0 text-center font-sans text-ember-300"
              style={{ fontSize: 12 }}
            >
              Merci. Ton avis nous aide à choisir la prochaine brique.
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Existing feedback list */}
      <div className="mt-14">
        <div
          className="text-[10px] uppercase tracking-widest text-parchment-500 font-sans mb-4 text-center"
        >
          Ce que d&apos;autres ont dit
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <AnimatePresence initial={false}>
            {items.slice(0, 6).map((f) => (
              <motion.article
                key={f.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 28,
                }}
                className="rounded-2xl relative"
                style={{
                  padding: 18,
                  background: "var(--surface-card)",
                  border: "1px solid var(--hairline)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="rounded-full font-sans font-medium"
                    style={{
                      padding: "2px 10px",
                      fontSize: 11,
                      background: "var(--accent-tint)",
                      border:
                        "1px solid color-mix(in oklab, var(--color-ember-500) 25%, transparent)",
                      color: "var(--color-ember-200)",
                    }}
                  >
                    {f.metier}
                  </span>
                  {f.name && (
                    <span
                      className="font-sans text-parchment-400"
                      style={{ fontSize: 11 }}
                    >
                      · {f.name}
                    </span>
                  )}
                  <span
                    className="ml-auto font-sans text-parchment-500"
                    style={{ fontSize: 10 }}
                  >
                    {f.at}
                  </span>
                </div>
                <p
                  className="font-serif italic text-parchment-200"
                  style={{ fontSize: 14, lineHeight: 1.55 }}
                >
                  « {f.message} »
                </p>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
