import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 700px 500px at 50% 30%, rgba(214,138,60,0.20), transparent 70%)",
        }}
      />
      <header className="max-w-6xl mx-auto px-8 pt-8">
        <Link href="/" className="inline-flex items-baseline">
          <span
            className="font-display italic text-ember-300 leading-none"
            style={{ fontSize: 28, marginRight: -1 }}
          >
            A
          </span>
          <span
            className="font-display text-parchment-100 leading-none"
            style={{ fontSize: 22, letterSpacing: "-0.01em" }}
          >
            linéa
          </span>
          <span
            className="font-sans uppercase text-ember-300 ml-2 leading-none tabular-nums"
            style={{ fontSize: 9, letterSpacing: "0.15em", opacity: 0.85 }}
          >
            beta
          </span>
        </Link>
      </header>
      {children}
    </main>
  );
}
