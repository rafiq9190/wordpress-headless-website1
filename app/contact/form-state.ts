import { z } from "zod";

/**
 * Shared contract between the contact form and its Server Action.
 *
 * This lives outside `actions.ts` on purpose: a `"use server"` module may only
 * export async functions. Exporting the initial-state object from there makes
 * it `undefined` on the client, which fails at the first `state.errors` read.
 */

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().pipe(z.email("Please enter a valid email address.")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Please give us a little more detail (at least 20 characters).")
    .max(4000),
});

export type ContactField = "name" | "email" | "company" | "message";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message: string;
  /** Field-level errors, keyed by input name. */
  errors: Partial<Record<ContactField, string>>;
  /** Echoed back so inputs keep their values after a failed submit. */
  values: Record<ContactField, string>;
}

export const initialContactState: ContactFormState = {
  status: "idle",
  message: "",
  errors: {},
  values: { name: "", email: "", company: "", message: "" },
};
