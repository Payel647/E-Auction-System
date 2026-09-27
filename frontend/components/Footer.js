import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

        <div className="flex flex-col justify-between gap-8 sm:flex-row">

          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-gray-950"
            >
              E-Auction<span className="text-emerald-600">.</span>
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-500">
              A simple and transparent platform for buying, selling and
              bidding online.
            </p>
          </div>

          <div className="flex gap-12 text-sm">
            <div>
              <p className="font-semibold text-gray-900">
                Platform
              </p>

              <div className="mt-3 space-y-2">
                <Link
                  href="/login"
                  className="block text-gray-500 hover:text-gray-900"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="block text-gray-500 hover:text-gray-900"
                >
                  Register
                </Link>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-900">
                About
              </p>

              <div className="mt-3 space-y-2">
                <p className="text-gray-500">
                  Secure bidding
                </p>

                <p className="text-gray-500">
                  Online auctions
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-500">
            © 2026 E-Auction System. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}