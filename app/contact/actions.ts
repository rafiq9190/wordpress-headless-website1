"use server";

import {
  contactSchema,
  type ContactField,
  type ContactFormState,
} from "./form-state";

/**
 * Contact form handling.
 *
 * IMPORTANT — not yet wired to a delivery backend. The WordPress install
 * exposes WPForms under the `wpforms/v1` REST namespace, but submitting to it
 * needs a form ID and a nonce issued by a rendered WordPress page, which a
 * headless frontend does not have. Until that is connected, submissions are
 * validated and logged server-side only.
 *
 * To finish this: create the form in WPForms, then POST the validated payload
 * to your own transactional email provider (or a WordPress endpoint you add)
 * from inside `submitContact`. The validation and UI contract stay the same.
 *
 * This module exports only async functions — a `"use server"` file may not
 * export anything else, which is why the schema and state shape live in
 * ./form-state.ts.
 */
export async function submitContact(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    company: String(formData.get("company") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(values);

  if (!parsed.success) {
    const errors: ContactFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in errors)) {
        errors[field as ContactField] = issue.message;
      }
    }

    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      errors,
      values,
    };
  }

  // Replace this with real delivery — see the note above.
  console.info("[contact] validated submission", {
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company || null,
    messageLength: parsed.data.message.length,
  });

  return {
    status: "success",
    message:
      "Thanks — your message has been received. Developer note: delivery is not yet connected, so this submission was only logged on the server.",
    errors: {},
    values: { name: "", email: "", company: "", message: "" },
  };
}
