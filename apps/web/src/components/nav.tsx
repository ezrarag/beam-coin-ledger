import Link from "next/link";

export function Nav() {
  return (
    <nav className="border-b mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              BEAM Coin Ledger
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/wallet"
              className="text-gray-600 hover:text-gray-900"
            >
              Wallet
            </Link>
            <Link
              href="/admin/issuance"
              className="text-gray-600 hover:text-gray-900"
            >
              Issue BEAM
            </Link>
            <Link
              href="/admin/redemptions"
              className="text-gray-600 hover:text-gray-900"
            >
              Redemptions
            </Link>
            <Link
              href="/impact"
              className="text-gray-600 hover:text-gray-900"
            >
              Impact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

