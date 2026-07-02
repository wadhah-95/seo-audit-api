
import { z } from "zod";

export const createAuditSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "URL is required"),
});

export type CreateAuditInput = z.infer<typeof createAuditSchema>;