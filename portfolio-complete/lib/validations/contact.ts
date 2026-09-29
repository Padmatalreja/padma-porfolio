import { z } from "zod";
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(200),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional().default("")
});
export type ContactInput = z.infer<typeof contactSchema>;
