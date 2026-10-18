import { Outlet } from "react-router";
import { HostedOnFreepod } from "@/components/hosted-on-freepod";

// A bare frame: the page fills the screen, with only a subtle Freepod credit.
export function AppShell() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,color-mix(in_oklch,var(--brand-from)_10%,transparent),transparent)]"
      />
      <main className="grid flex-1 place-items-center px-6 py-10">
        <Outlet />
      </main>
      <footer className="pb-5">
        <div className="flex justify-center">
          <HostedOnFreepod />
        </div>
      </footer>
    </div>
  );
}
