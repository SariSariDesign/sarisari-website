"use client";

import { useEffect, useRef, useState } from "react";
import { contact } from "@/content/site";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

const input =
  "w-full border border-neutral-400 bg-white px-4 py-3 text-body text-neutral-1000 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300";

/** Server-side caps in /api/contact; mirrored here so the browser stops at the same limit. */
const MAX = { name: 200, email: 254, company: 200, message: 5000 } as const;

/** Say Hello: posts to /api/contact (→ Attio). `website` is a visually hidden honeypot. */
export function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const f = contact.form;
  const statusRef = useRef<HTMLParagraphElement>(null);

  // The form unmounts on success, dropping focus; move it to the confirmation so it is announced.
  useEffect(() => {
    if (state.kind === "sent") statusRef.current?.focus();
  }, [state.kind]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: "sending" });
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) setState({ kind: "sent" });
      else setState({ kind: "error", message: json.error ?? f.fallbackError });
    } catch {
      setState({ kind: "error", message: f.fallbackError });
    }
  }

  if (state.kind === "sent") {
    return (
      <p ref={statusRef} tabIndex={-1} role="status" className="text-lead text-neutral-1000 outline-none">
        {f.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-[640px] flex-col gap-5" noValidate>
      {(["name", "email", "company"] as const).map((k) => (
        <label key={k} className="flex flex-col gap-2">
          <span className="ds-label text-label text-neutral-700">{f.fields[k]}</span>
          <input
            name={k}
            type={k === "email" ? "email" : "text"}
            required={k !== "company"}
            maxLength={MAX[k]}
            autoComplete={k === "company" ? "organization" : k}
            className={input}
          />
        </label>
      ))}
      <label className="flex flex-col gap-2">
        <span className="ds-label text-label text-neutral-700">{f.fields.message}</span>
        <textarea name="message" required rows={5} maxLength={MAX.message} className={input} />
      </label>
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.kind === "error" && (
        <p role="alert" className="text-body-s text-red-500">
          {state.message}
        </p>
      )}
      <div>
        <button
          type="submit"
          disabled={state.kind === "sending"}
          className="ds-label bg-primary-100 px-8 py-4 text-label text-primary-400 hover:bg-primary-200 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
        >
          {state.kind === "sending" ? f.sending : f.submit}
        </button>
      </div>
    </form>
  );
}
