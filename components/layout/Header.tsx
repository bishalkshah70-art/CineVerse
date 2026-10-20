"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Menu, User, X, ChevronDown } from "lucide-react";
import { NAV_MORE, NAV_PRIMARY } from "@/lib/constants";
import { Logo } from "./Logo";
import { SearchControls } from "./SearchOverlay";
import { RegionSelect } from "./RegionSelect";
import { cn } from "@/lib/utils";

function HeaderContent({
  region,
  countries,
}: {
  region: string;
  countries: Array<{ iso_3166_1: string; english_name: string }>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMore(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMore(false);
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const linkClass = (href: string) =>
    cn(
      "rounded-full px-3 py-1.5 text-sm transition",
      pathname === href || (href !== "/" && pathname.startsWith(href))
        ? "bg-surface-2 text-ink"
        : "text-muted hover:text-ink",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-8">
        <Logo />
        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_PRIMARY.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)}>
              {item.label}
            </Link>
          ))}
          <div className="relative" ref={moreRef}>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-muted hover:text-ink"
              aria-expanded={more}
              aria-haspopup="true"
              onClick={() => setMore((v) => !v)}
            >
              More <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {more ? (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-line bg-surface p-2 shadow-xl">
                {NAV_MORE.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <RegionSelect region={region} countries={countries} />
          <SearchControls />
          <Link
            href="/watchlist"
            className="rounded-full p-2 text-muted hover:text-ink"
            aria-label="Watchlist"
          >
            <Bookmark className="h-5 w-5" />
          </Link>
          <Link
            href="/profile"
            className="hidden rounded-full p-2 text-muted hover:text-ink sm:inline-flex"
            aria-label="Preferences"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="rounded-full p-2 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/70 lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-[min(100%,20rem)] overflow-y-auto bg-bg p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X />
              </button>
            </div>
            <nav className="grid gap-1">
              {[...NAV_PRIMARY, ...NAV_MORE, { href: "/watchlist", label: "Watchlist" }, { href: "/profile", label: "Preferences" }].map(
                (item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-3 py-3 text-base hover:bg-surface"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}


export function Header(props: {
  region: string;
  countries: Array<{ iso_3166_1: string; english_name: string }>;
}) {
  const pathname = usePathname();

  return <HeaderContent key={pathname} {...props} />;
}
