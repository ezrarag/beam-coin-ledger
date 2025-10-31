import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">BEAM Coin Ledger</h1>
        <p className="text-lg text-gray-600 mb-8">
          Manage BEAM Coin balances, redemption, and Stripe payouts
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/wallet"
            className="p-6 border rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">My Wallet</h2>
            <p className="text-gray-600">
              View your balance, transaction history, and redeem BEAM coins
            </p>
          </Link>

          <Link
            href="/admin/issuance"
            className="p-6 border rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Admin Issuance</h2>
            <p className="text-gray-600">
              Issue BEAM coins to participants (Admin only)
            </p>
          </Link>

          <Link
            href="/impact"
            className="p-6 border rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Impact Dashboard</h2>
            <p className="text-gray-600">
              View aggregate statistics and public metrics
            </p>
          </Link>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Legal Documents</h2>
            <div className="flex flex-col gap-2">
              <Link
                href="/legal/beam-coin-terms"
                className="text-blue-600 hover:underline"
              >
                BEAM Coin Terms of Use
              </Link>
              <Link
                href="/legal/redemption-policy"
                className="text-blue-600 hover:underline"
              >
                Redemption Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

