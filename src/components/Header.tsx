"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api } from "../app/lib/api";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isAuth, setIsAuth] = useState(false);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [drawer, setDrawer] = useState(false);

  const pathname = usePathname();

  function isActive(path: string) {
    return pathname === path
      ? "text-green-600 font-semibold"
      : "text-gray-700 hover:text-green-600";
  }

  useEffect(() => {
    setIsAuth(Boolean(localStorage.getItem("token")));

    const handler = () => setIsAuth(Boolean(localStorage.getItem("token")));
    window.addEventListener("auth-change", handler);
    return () => window.removeEventListener("auth-change", handler);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    setDrawer(false);
  }

  useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await api(`/recipes?search=${encodeURIComponent(search)}`);
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <>
      <header className="bg-white shadow sticky top-0 z-50">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold text-green-600 hidden sm:block"
          >
            FlavorAI
          </Link>

          <div className="relative w-full max-w-xs sm:max-w-sm mx-2" ref={ref}>
            <input
              type="text"
              placeholder="Search recipes..."
              className="w-full bg-[#f7f7f7] rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
            />

            {open && results.length > 0 && (
              <div className="absolute mt-1 bg-white w-full shadow-lg rounded-lg border z-50 overflow-hidden">
                {results.map((r) => (
                  <Link
                    href={`/recipes/${r.id}`}
                    key={r.id}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {r.title}
                  </Link>
                ))}
              </div>
            )}

            {open && search && results.length === 0 && (
              <div className="absolute mt-1 bg-white w-full shadow-lg rounded-lg border z-50 px-4 py-2 text-gray-500">
                No results
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-6 text-gray-700 font-medium">
            <Link href="/recipes" className={isActive("/recipes")}>
              Recipes
            </Link>

            {isAuth && (
              <>
                <Link
                  href="/recipes/create"
                  className={isActive("/recipes/create")}
                >
                  Create
                </Link>

                <Link href="/my" className={isActive("/my")}>
                  My Recipes
                </Link>
              </>
            )}

            {isAuth ? (
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          <button className="sm:hidden p-2" onClick={() => setDrawer(true)}>
            <Menu size={28} />
          </button>
        </nav>
      </header>

      {drawer && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => setDrawer(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setDrawer(false)}>
                <X size={26} />
              </button>
            </div>

            {!isAuth && (
              <Link
                href="/auth/login"
                onClick={() => setDrawer(false)}
                className="py-2 px-3 rounded bg-green-600 text-white text-center mb-4"
              >
                Login
              </Link>
            )}

            {isAuth && (
              <>
                <Link
                  href="/recipes"
                  className="py-2"
                  onClick={() => setDrawer(false)}
                >
                  Recipes
                </Link>

                <Link
                  href="/recipes/create"
                  className="py-2"
                  onClick={() => setDrawer(false)}
                >
                  Create Recipe
                </Link>

                <Link
                  href="/my"
                  className="py-2"
                  onClick={() => setDrawer(false)}
                >
                  My Recipes
                </Link>

                <button
                  onClick={logout}
                  className="mt-6 bg-red-600 text-white py-2 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
