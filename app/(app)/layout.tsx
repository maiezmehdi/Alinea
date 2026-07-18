import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="flex items-center justify-between"
        style={{
          padding: "14px 22px",
          borderBottom: "1px solid var(--hairline-veil)",
        }}
      >
        <Link href="/app" className="inline-flex items-baseline">
          <span
            className="font-display italic text-ember-300 leading-none"
            style={{ fontSize: 22, marginRight: -1 }}
          >
            A
          </span>
          <span
            className="font-display text-parchment-100 leading-none"
            style={{ fontSize: 18, letterSpacing: "-0.01em" }}
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
        <div className="flex items-center gap-3">
          <span
            className="text-parchment-400 font-sans"
            style={{ fontSize: 12 }}
          >
            {session.user.name ?? "Invité"}
            {(session.user as { isGuest?: boolean }).isGuest ? (
              <span
                className="ml-2 rounded-full font-sans"
                style={{
                  padding: "1px 8px",
                  fontSize: 10,
                  background: "var(--pill-bg)",
                  border: "1px solid var(--hairline)",
                  color: "var(--color-parchment-400)",
                }}
              >
                Invité
              </span>
            ) : null}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-full font-sans"
              style={{
                padding: "5px 12px",
                fontSize: 12,
                color: "var(--color-parchment-300)",
                background: "var(--pill-bg)",
                border: "1px solid var(--hairline)",
              }}
            >
              Se déconnecter
            </button>
          </form>
        </div>
      </header>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
