import { z } from "zod";

export const redemptionRequestSchema = z.object({
  amount: z.number().int().positive().min(100).max(500),
});

export const issuanceSchema = z.object({
  userId: z.string().cuid(),
  amount: z.number().int().positive(),
  note: z.string().optional(),
});

export const approveRedemptionSchema = z.object({
  redemptionId: z.string().cuid(),
});

