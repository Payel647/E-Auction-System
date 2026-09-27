"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { apiRequest } from "../lib/api";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const token = localStorage.getItem("access");

      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await apiRequest("/auth/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (active) setUser(data);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    router.push("/");
  }

  const dashboardHref = {
    BUYER: "/dashboard",
    SELLER: "/seller",
    ADMIN: "/admin",
  }[user?.role];

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

        {/* Logo */}
        <Link
          href={user ? "/auctions" : "/"}
          className="text-xl font-bold tracking-tight text-gray-950"
        >
          E-Auction<span className="text-emerald-600">.</span>
        </Link>

        {/* Navigation */}
        {!loading && (
          <div className="flex items-center gap-4 sm:gap-7">

            {user ? (
              <>
                <Link
                  href="/auctions"
                  className="text-sm font-medium text-gray-600 hover:text-gray-950"
                >
                  Auctions
                </Link>

                {dashboardHref && (
                  <Link
                    href={dashboardHref}
                    className="text-sm font-medium text-gray-600 hover:text-gray-950"
                  >
                    Dashboard
                  </Link>
                )}

                <div className="hidden items-center border-l border-gray-200 pl-5 sm:flex">
                  <div className="mr-4 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      {user.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-950"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden text-sm font-medium text-gray-600 hover:text-gray-950 sm:block"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}