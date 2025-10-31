"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { redemptionRequestSchema } from "@beam-coin/core";

async function fetchWallet() {
  const res = await fetch("/api/wallet");
  if (!res.ok) throw new Error("Failed to fetch wallet");
  return res.json();
}

async function fetchLedger() {
  const res = await fetch("/api/ledger");
  if (!res.ok) throw new Error("Failed to fetch ledger");
  return res.json();
}

async function fetchUser() {
  const res = await fetch("/api/user");
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

async function createOnboardingLink() {
  const res = await fetch("/api/payouts/onboard", {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to create onboarding link");
  return res.json();
}

async function createRedemption(amount: number) {
  const res = await fetch("/api/redemptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error("Failed to create redemption");
  return res.json();
}

export default function WalletPage() {
  const [redemptionAmount, setRedemptionAmount] = useState("");
  const queryClient = useQueryClient();

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ["wallet"],
    queryFn: fetchWallet,
  });

  const { data: ledger, isLoading: ledgerLoading } = useQuery({
    queryKey: ["ledger"],
    queryFn: fetchLedger,
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const onboardingMutation = useMutation({
    mutationFn: createOnboardingLink,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  const redemptionMutation = useMutation({
    mutationFn: (amount: number) => createRedemption(amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["ledger"] });
      setRedemptionAmount("");
    },
  });

  const handleRedemption = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(redemptionAmount);
    const validation = redemptionRequestSchema.safeParse({ amount });
    if (!validation.success) {
      alert("Invalid amount. Must be between 100 and 500 BEAM.");
      return;
    }
    redemptionMutation.mutate(amount);
  };

  const feeBps = 50; // 0.5%
  const feeAmount = redemptionAmount
    ? Math.floor((parseInt(redemptionAmount) * feeBps) / 10000)
    : 0;
  const netAmount = redemptionAmount
    ? parseInt(redemptionAmount) - feeAmount
    : 0;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Balance</CardTitle>
              <CardDescription>Current BEAM Coin balance</CardDescription>
            </CardHeader>
            <CardContent>
              {walletLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="text-4xl font-bold">
                  {wallet?.balance ?? 0} BEAM
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redeem BEAM</CardTitle>
              <CardDescription>
                Convert BEAM to USD via Stripe (min: 100, max: 500 per week)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!userLoading && !user?.stripeAccountId && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800 mb-2">
                    You need to complete Stripe onboarding to redeem BEAM coins.
                  </p>
                  <Button
                    onClick={() => onboardingMutation.mutate()}
                    disabled={onboardingMutation.isPending}
                    variant="outline"
                  >
                    {onboardingMutation.isPending ? "Loading..." : "Complete Stripe Onboarding"}
                  </Button>
                </div>
              )}
              <form onSubmit={handleRedemption} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount (BEAM)
                  </label>
                  <input
                    type="number"
                    value={redemptionAmount}
                    onChange={(e) => setRedemptionAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="100-500"
                    min={100}
                    max={500}
                    disabled={!user?.stripeAccountId}
                  />
                </div>
                {redemptionAmount && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Service fee (0.5%): -{feeAmount} BEAM</div>
                    <div className="font-semibold">
                      Net payout: {netAmount} BEAM (${netAmount} USD)
                    </div>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={
                    redemptionMutation.isPending ||
                    !redemptionAmount ||
                    !user?.stripeAccountId
                  }
                >
                  {redemptionMutation.isPending ? "Processing..." : "Request Redemption"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>All ledger entries</CardDescription>
          </CardHeader>
          <CardContent>
            {ledgerLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledger?.length > 0 ? (
                      ledger.map((entry: any) => (
                        <tr key={entry.id} className="border-b">
                          <td className="p-2">
                            {new Date(entry.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-2">{entry.type}</td>
                          <td className="p-2">{entry.amount} BEAM</td>
                          <td className="p-2">{entry.note || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-2 text-center text-gray-500">
                          No transactions yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

