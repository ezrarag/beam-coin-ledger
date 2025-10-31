"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function searchUser(email: string) {
  const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

async function issueBEAM(userId: string, amount: number, note?: string) {
  const res = await fetch("/api/admin/issuance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, amount, note }),
  });
  if (!res.ok) throw new Error("Failed to issue BEAM");
  return res.json();
}

export default function AdminIssuancePage() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: searchUser,
    onSuccess: (data) => {
      setSelectedUser(data);
    },
  });

  const issuanceMutation = useMutation({
    mutationFn: ({ userId, amount, note }: { userId: string; amount: number; note?: string }) =>
      issueBEAM(userId, amount, note),
    onSuccess: () => {
      alert("BEAM coins issued successfully!");
      setAmount("");
      setNote("");
      setSelectedUser(null);
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    searchMutation.mutate(email);
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const amt = parseInt(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    issuanceMutation.mutate({
      userId: selectedUser.id,
      amount: amt,
      note: note || undefined,
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin: Issue BEAM Coins</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search User</CardTitle>
            <CardDescription>Find user by email to issue BEAM</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <Button type="submit" disabled={searchMutation.isPending}>
                {searchMutation.isPending ? "Searching..." : "Search"}
              </Button>
            </form>

            {searchMutation.error && (
              <div className="mt-4 text-red-600">
                User not found. Please check the email address.
              </div>
            )}

            {selectedUser && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="font-semibold">User Found:</div>
                <div>Name: {selectedUser.fullName || "N/A"}</div>
                <div>Email: {selectedUser.email}</div>
                <div>Current Balance: {selectedUser.wallet?.balance || 0} BEAM</div>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedUser && (
          <Card>
            <CardHeader>
              <CardTitle>Issue BEAM Coins</CardTitle>
              <CardDescription>Grant BEAM credits to this user</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleIssue} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount (BEAM)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="100"
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Note (optional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., Training completion reward"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={issuanceMutation.isPending}
                >
                  {issuanceMutation.isPending ? "Issuing..." : "Issue BEAM"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

