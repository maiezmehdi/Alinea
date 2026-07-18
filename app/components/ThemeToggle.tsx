"use client";

import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "motion/react";

type Theme = "dark" | "light";

const spring = { type: "spring" as const, stiffness: 380, damping: 30, mass: 0.6 };

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (document.documentElement.dataset.theme || "dark") as Theme;
    setTheme(stored);
    setMounted(true);
  }, []);

  function apply(next: Theme) {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("alinea-theme", next);
    } catch {}
    setTheme(next);
  }

  return (
    <LayoutGroup id="theme-toggle">
      <div
        role="tablist"
        aria-label="Thème"
        className="relative flex items-center rounded-full p-0.5"
        style={{
          background: "var(--pill-bg)",
          border: "1px solid var(--hairline)",
        }}
      >
        {(["dark", "light"] as Theme[]).map((t) => {
          const active = theme === t;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={active}
              onClick={() => apply(t)}
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: 30,
                height: 24,
                color: active
                  ? "var(--color-parchment-50)"
                  : "var(--color-parchment-500)",
                transition: "color 220ms ease",
              }}
            >
              {active && mounted && (
                <motion.span
                  layoutId="theme-thumb"
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  transition={spring}
                  style={{
                    background: "var(--accent-tint-strong)",
                    border:
                      "1px solid color-mix(in oklab, var(--color-ember-500) 30%, transparent)",
                  }}
                />
              )}
              <span className="relative z-10">
                {t === "dark" ? <MoonIcon /> : <SunIcon />}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

function MoonIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor">
      <path
        d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="1.6" stroke="currentColor">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
