"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function fetchPendingRedemptions() {
  const res = await fetch("/api/admin/redemptions");
  if (!res.ok) throw new Error("Failed to fetch redemptions");
  return res.json();
}

async function approveRedemption(redemptionId: string) {
  const res = await fetch("/api/redemptions/approve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ redemptionId }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to approve redemption");
  }
  return res.json();
}

export default function AdminRedemptionsPage() {
  const queryClient = useQueryClient();

  const { data: redemptions, isLoading } = useQuery({
    queryKey: ["admin-redemptions"],
    queryFn: fetchPendingRedemptions,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const approveMutation = useMutation({
    mutationFn: approveRedemption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-redemptions"] });
      queryClient.invalidateQueries({ queryKey: ["impact"] });
      alert("Redemption approved and processed!");
    },
    onError: (error: Error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleApprove = (redemptionId: string) => {
    if (confirm("Approve and process this redemption?")) {
      approveMutation.mutate(redemptionId);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin: Pending Redemptions</h1>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pending Redemption Requests</CardTitle>
              <CardDescription>
                Review and approve redemption requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {redemptions?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">User</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Fee (0.5%)</th>
                        <th className="text-left p-2">Net Payout</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {redemptions.map((redemption: any) => {
                        const feeAmount = Math.floor(
                          (redemption.amount * redemption.feeBps) / 10000
                        );
                        const netPayout = redemption.amount - feeAmount;
                        return (
                          <tr key={redemption.id} className="border-b">
                            <td className="p-2">
                              {new Date(redemption.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-2">
                              {redemption.user?.email || "N/A"}
                            </td>
                            <td className="p-2">{redemption.amount} BEAM</td>
                            <td className="p-2">-{feeAmount} BEAM</td>
                            <td className="p-2 font-semibold">
                              {netPayout} BEAM (${netPayout} USD)
                            </td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  redemption.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : redemption.status === "COMPLETED"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {redemption.status}
                              </span>
                            </td>
                            <td className="p-2">
                              {redemption.status === "PENDING" ? (
                                <Button
                                  onClick={() => handleApprove(redemption.id)}
                                  disabled={approveMutation.isPending}
                                  size="sm"
                                >
                                  {approveMutation.isPending
                                    ? "Processing..."
                                    : "Approve & Pay"}
                                </Button>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No pending redemption requests
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

