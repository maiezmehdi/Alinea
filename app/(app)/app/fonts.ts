export type FontCategory = "serif" | "sans" | "mono" | "display";

export type FontDef = {
  key: string;
  label: string;
  category: FontCategory;
  css: string; // font-family value
};

export const fontLibrary: FontDef[] = [
  // Serif — editorial
  { key: "spectral", label: "Spectral", category: "serif", css: '"Spectral", Georgia, serif' },
  { key: "crimson", label: "Crimson Text", category: "serif", css: '"Crimson Text", Georgia, serif' },
  { key: "eb-garamond", label: "EB Garamond", category: "serif", css: '"EB Garamond", Georgia, serif' },
  { key: "lora", label: "Lora", category: "serif", css: '"Lora", Georgia, serif' },
  { key: "playfair", label: "Playfair Display", category: "serif", css: '"Playfair Display", Georgia, serif' },
  { key: "cormorant", label: "Cormorant Garamond", category: "serif", css: '"Cormorant Garamond", Georgia, serif' },
  { key: "merriweather", label: "Merriweather", category: "serif", css: '"Merriweather", Georgia, serif' },
  { key: "libre-caslon", label: "Libre Caslon Text", category: "serif", css: '"Libre Caslon Text", Georgia, serif' },

  // Display
  { key: "fraunces", label: "Fraunces", category: "display", css: '"Fraunces", Georgia, serif' },
  { key: "instrument-serif", label: "Instrument Serif", category: "display", css: '"Instrument Serif", Georgia, serif' },
  { key: "dm-serif-display", label: "DM Serif Display", category: "display", css: '"DM Serif Display", Georgia, serif' },

  // Sans
  { key: "inter", label: "Inter", category: "sans", css: '"Inter", system-ui, sans-serif' },
  { key: "manrope", label: "Manrope", category: "sans", css: '"Manrope", system-ui, sans-serif' },
  { key: "dm-sans", label: "DM Sans", category: "sans", css: '"DM Sans", system-ui, sans-serif' },
  { key: "work-sans", label: "Work Sans", category: "sans", css: '"Work Sans", system-ui, sans-serif' },
  { key: "plex-sans", label: "IBM Plex Sans", category: "sans", css: '"IBM Plex Sans", system-ui, sans-serif' },

  // Mono
  { key: "jetbrains-mono", label: "JetBrains Mono", category: "mono", css: '"JetBrains Mono", ui-monospace, monospace' },
  { key: "plex-mono", label: "IBM Plex Mono", category: "mono", css: '"IBM Plex Mono", ui-monospace, monospace' },
  { key: "fira-code", label: "Fira Code", category: "mono", css: '"Fira Code", ui-monospace, monospace' },
];

export function findFont(key: string): FontDef {
  return fontLibrary.find((f) => f.key === key) ?? fontLibrary[0];
}

export const fontCategoryLabels: Record<FontCategory | "all", string> = {
  all: "Toutes",
  serif: "Serif",
  display: "Display",
  sans: "Sans",
  mono: "Mono",
};
