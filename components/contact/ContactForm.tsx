"use client";

import { useActionState } from "react";

import { submitContact } from "@/app/contact/actions";
import {
  initialContactState,
  type ContactFormState,
} from "@/app/contact/form-state";
import { ArrowRight, Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Progressively-enhanced contact form.
 *
 * Built on `useActionState` over a Server Action, so it submits without JS and
 * the same Zod schema validates in both cases — there is no second,
 * drifting client-side validation.
 *
 * Errors are wired with `aria-describedby` + `aria-invalid`, and the summary is
 * `role="status"` so success and failure are both announced.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(
    submitContact,
    initialContactState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="name"
          label="Your name"
          autoComplete="name"
          required
          error={state.errors.name}
          defaultValue={state.values.name}
        />
        <Field
          name="email"
          label="Work email"
          type="email"
          autoComplete="email"
          required
          error={state.errors.email}
          defaultValue={state.values.email}
        />
      </div>

      <Field
        name="company"
        label="Company"
        autoComplete="organization"
        error={state.errors.company}
        defaultValue={state.values.company}
      />

      <Field
        name="message"
        label="What are you trying to solve?"
        multiline
        required
        error={state.errors.message}
        defaultValue={state.values.message}
      />

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
          {pending ? "Sending…" : "Send message"}
          <ArrowRight />
        </Button>
        <p className="text-xs text-ink-faint">
          We reply within one business day.
        </p>
      </div>

      {state.status !== "idle" ? (
        <p
          role="status"
          className={cn(
            "rounded-card border px-4 py-3 text-sm",
            state.status === "success"
              ? "border-positive/30 bg-positive/10 text-positive"
              : "border-danger/30 bg-danger/10 text-danger",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  name,
  label,
  error,
  multiline = false,
  type = "text",
  required = false,
  autoComplete,
  defaultValue,
}: {
  name: string;
  label: string;
  error?: string;
  multiline?: boolean;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
}) {
  const errorId = `${name}-error`;

  const shared = cn(
    "w-full rounded-card border bg-surface/50 px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-faint",
    error ? "border-danger/60" : "border-edge hover:border-edge-strong",
  );

  return (
    <div className={cn("flex flex-col gap-2", multiline && "sm:col-span-2")}>
      <label htmlFor={name} className="text-sm font-medium text-ink-soft">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-accent-via">
            *
          </span>
        ) : null}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={6}
          required={required}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(shared, "resize-y")}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={shared}
        />
      )}

      {error ? (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
