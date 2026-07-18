"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";

type Mode = "login" | "signup";

export function AuthCard({ mode }: { mode: Mode }) {
  const isLogin = mode === "login";
  const [pseudonym, setPseudonym] = useState("");
  const [loading, setLoading] = useState<"google" | "guest" | null>(null);

  async function google() {
    setLoading("google");
    try {
      await signIn("google", { callbackUrl: "/app" });
    } catch {
      setLoading(null);
    }
  }

  async function guest(e: React.FormEvent) {
    e.preventDefault();
    setLoading("guest");
    try {
      await signIn("guest", {
        pseudonym: pseudonym.trim() || "Invité",
        callbackUrl: "/app",
      });
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 pt-24 pb-16">
      <div className="text-center mb-8">
        <div className="inline-block text-xs font-sans uppercase tracking-[0.2em] text-ember-300 mb-3">
          {isLogin ? "Retour" : "Bienvenue"}
        </div>
        <h1
          className="font-display text-parchment-50"
          style={{ fontSize: 40, lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          {isLogin ? "Rouvre ton canvas." : "Un canvas t'attend."}
        </h1>
        <p
          className="mt-4 mx-auto text-parchment-400 font-serif"
          style={{ fontSize: 15, lineHeight: 1.5, maxWidth: 360 }}
        >
          {isLogin
            ? "Continue là où tu t'étais arrêté."
            : "Prends deux minutes pour voir ce que ça fait d'écrire dans quelque chose de beau."}
        </p>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface-glass)",
          border: "1px solid var(--hairline)",
          boxShadow: "var(--shadow-elevated)",
          padding: 22,
        }}
      >
        {/* Google button */}
        <motion.button
          type="button"
          onClick={google}
          disabled={loading !== null}
          whileHover={loading ? undefined : { y: -1 }}
          whileTap={loading ? undefined : { scale: 0.985 }}
          className="w-full flex items-center justify-center gap-3 rounded-xl font-sans font-medium"
          style={{
            padding: "12px 16px",
            fontSize: 14,
            color: "#1a0d09",
            background: "linear-gradient(180deg, #f6d194 0%, #e59a3f 100%)",
            boxShadow:
              "0 10px 26px -8px rgba(214,138,60,0.5), inset 0 1px 0 rgba(255,255,255,0.4)",
            border: "1px solid transparent",
            cursor: loading ? "wait" : "pointer",
            opacity: loading === "guest" ? 0.6 : 1,
          }}
        >
          <GoogleGlyph />
          <span>
            {loading === "google"
              ? "Ouverture de Google…"
              : isLogin
              ? "Continuer avec Google"
              : "S'inscrire avec Google"}
          </span>
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: "var(--hairline)" }} />
          <span
            className="uppercase text-parchment-500 font-sans"
            style={{ fontSize: 10, letterSpacing: "0.2em" }}
          >
            ou
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--hairline)" }} />
        </div>

        {/* Guest form — for testing without OAuth setup */}
        <form onSubmit={guest} className="flex flex-col gap-3">
          <label
            className="text-parchment-400 font-sans"
            style={{ fontSize: 12 }}
          >
            Tester en invité
            <input
              type="text"
              value={pseudonym}
              onChange={(e) => setPseudonym(e.target.value)}
              placeholder="Ton prénom (optionnel)"
              className="mt-1.5 w-full rounded-xl bg-transparent outline-none font-sans text-parchment-100 placeholder:text-parchment-500"
              style={{
                padding: "10px 14px",
                fontSize: 14,
                background: "var(--pill-bg)",
                border: "1px solid var(--hairline)",
              }}
            />
          </label>
          <motion.button
            type="submit"
            disabled={loading !== null}
            whileHover={loading ? undefined : { y: -1 }}
            whileTap={loading ? undefined : { scale: 0.985 }}
            className="rounded-xl font-sans"
            style={{
              padding: "10px 14px",
              fontSize: 13,
              color: "var(--color-parchment-100)",
              background: "var(--pill-bg)",
              border: "1px solid var(--hairline)",
              cursor: loading ? "wait" : "pointer",
              opacity: loading === "google" ? 0.6 : 1,
            }}
          >
            {loading === "guest" ? "Ouverture du canvas…" : "Entrer sans compte"}
          </motion.button>
        </form>
      </div>

      <p
        className="mt-6 text-center text-parchment-500 font-sans"
        style={{ fontSize: 12 }}
      >
        {isLogin ? (
          <>
            Pas encore de compte ?{" "}
            <a href="/signup" className="text-ember-300 hover:text-ember-200">
              Créer un espace
            </a>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <a href="/login" className="text-ember-300 hover:text-ember-200">
              Se reconnecter
            </a>
          </>
        )}
      </p>

      <p
        className="mt-3 text-center text-parchment-500 font-sans italic"
        style={{ fontSize: 11 }}
      >
        Aucun tracking. Ton texte reste chez toi.
      </p>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
