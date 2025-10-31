"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function fetchImpactStats() {
  const res = await fetch("/api/impact");
  if (!res.ok) throw new Error("Failed to fetch impact stats");
  return res.json();
}

export default function ImpactPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["impact"],
    queryFn: fetchImpactStats,
  });

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">BEAM Coin Impact Dashboard</h1>
        <p className="text-gray-600 mb-8">
          Public statistics on BEAM Coin issuance, redemption, and outstanding balances
        </p>

        {isLoading ? (
          <div>Loading statistics...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Issued</CardTitle>
                <CardDescription>All BEAM coins ever issued</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {stats?.totalIssued ?? 0} BEAM
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  ${stats?.totalIssued ?? 0} USD equivalent
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Redeemed</CardTitle>
                <CardDescription>BEAM coins redeemed to date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {stats?.totalRedeemed ?? 0} BEAM
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  ${stats?.totalRedeemed ?? 0} USD equivalent
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outstanding</CardTitle>
                <CardDescription>BEAM coins currently in circulation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {stats?.outstanding ?? 0} BEAM
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  ${stats?.outstanding ?? 0} USD equivalent
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>About This Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This page displays aggregate, anonymized data about BEAM Coin activity.
              Individual user balances and transactions are private. All redemption
              requests are processed through Stripe Connect with proper KYC verification.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

