"use client";

import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { DIAGNOSTIC_BOOKING_URL, scorecard } from "@/content/site";
import {
  EMPTY_FORM,
  validateScorecardForm,
  type FormErrors,
  type FormState,
} from "@/lib/scorecard/formValidation";
import { ScorecardCover } from "./ScorecardCover";

type Step = "form" | "submitting" | "done" | "duplicate" | "error";

// www's Button is link-only, so the submit and retry actions are native buttons
// sharing the primary pill styling.
const actionCls =
  "ds-label inline-flex items-center justify-center rounded-full bg-primary-400 text-label text-neutral-100 hover:bg-primary-500 active:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300 transition-colors duration-150 ease-out cursor-pointer";

/**
 * The free Activation Scorecard lead form + its submit state machine, rendered
 * on the standalone `/scorecard-preview` page: the report cover beside the
 * headline and form, stacked on small screens.
 */
// Ad click IDs and UTM tags read from the landing URL so each request traces back to its ad.
const ATTRIBUTION_KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function ScorecardForm({
  source = "scorecard-preview",
  compact = false,
}: { source?: string; compact?: boolean } = {}) {
  const [step, setStep] = useState<Step>("form");
  const attribution = useRef<Record<string, string>>({});
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const found: Record<string, string> = { source, landing_path: window.location.pathname };
    for (const k of ATTRIBUTION_KEYS) {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, 200);
    }
    attribution.current = found;
  }, [source]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const headingId = useId();

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Honeypot filled → pretend success without hitting the API.
    if (form.faxNumber) {
      setStep("done");
      return;
    }
    const nextErrors = validateScorecardForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setStep("submitting");
    try {
      const res = await fetch("/api/scorecard-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          stage: form.stage,
          url: form.url.trim(),
          faxNumber: form.faxNumber,
          attribution: attribution.current,
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json().catch(() => ({}))) as { duplicate?: boolean };
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "scorecard_submit", ...attribution.current });
      setStep(data.duplicate ? "duplicate" : "done");
    } catch {
      setStep("error");
    }
  }

  if (step === "submitting") return <LoadingScreen titleId={headingId} />;

  if (step === "done" || step === "duplicate") {
    return <ConfirmationScreen titleId={headingId} variant={step} />;
  }

  if (step === "error") {
    return <ErrorScreen titleId={headingId} onRetry={() => setStep("form")} />;
  }

  return (
    <FormScreen
      compact={compact}
      titleId={headingId}
      form={form}
      errors={errors}
      update={update}
      onSubmit={handleSubmit}
    />
  );
}

/* -------------------------------------------------------------------------- */

function FormScreen({
  compact = false,
  titleId,
  form,
  errors,
  update,
  onSubmit,
}: {
  compact?: boolean;
  titleId: string;
  form: FormState;
  errors: FormErrors;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const { form: f } = scorecard;

  const fields = (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      <Field label={f.fields.name} error={errors.name}>
        <input
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={inputCls(!!errors.name)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={f.fields.company} error={errors.company}>
          <input
            type="text"
            autoComplete="organization"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            className={inputCls(!!errors.company)}
          />
        </Field>
        <Field label={f.fields.email} error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputCls(!!errors.email)}
          />
        </Field>
      </div>

      <Field label={f.fields.stage} error={errors.stage}>
        <select
          value={form.stage}
          onChange={(e) => update("stage", e.target.value)}
          className={inputCls(!!errors.stage)}
        >
          <option value="" disabled>
            Select…
          </option>
          {f.stageOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </Field>

      <Field label={f.fields.url} error={errors.url}>
        <input
          type="url"
          inputMode="url"
          placeholder={f.urlPlaceholder}
          value={form.url}
          onChange={(e) => update("url", e.target.value)}
          className={inputCls(!!errors.url)}
        />
      </Field>

      {/* Honeypot — hidden from users, catches bots. */}
      <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Fax number
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.faxNumber}
            onChange={(e) => update("faxNumber", e.target.value)}
          />
        </label>
      </div>

      <div className="mt-1">
        <button type="submit" className={`${actionCls} group w-full gap-2 px-8 py-4`}>
          {f.submitLabel}
          <Arrow />
        </button>
      </div>

      <LegalFooter />
    </form>
  );

  // Compact: just the fields; the host page supplies the heading (e.g. /start).
  if (compact) return fields;

  const formPane = (
    <div className="flex flex-col gap-5">
      <span className="ds-label text-label text-primary-400">{scorecard.eyebrow}</span>
      <h2 id={titleId} className="font-brand text-heading-l text-neutral-900">
        {scorecard.headline}
      </h2>
      <div className="flex flex-col gap-3">
        {scorecard.body.map((p) => (
          <p key={p.slice(0, 24)} className="text-body-s text-neutral-700">
            {p}
          </p>
        ))}
      </div>
      {fields}
    </div>
  );

  // Left pane presents the packaged report cover, stacked above the form on
  // small screens.
  const coverPane = (
    <div className="flex items-center justify-center py-2 md:py-0">
      <ScorecardCover />
    </div>
  );

  return (
    <div className="grid items-center gap-8 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:gap-12">
      {coverPane}
      {formPane}
    </div>
  );
}

function LoadingScreen({ titleId }: { titleId: string }) {
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-20 text-center">
      <h2 id={titleId} className="font-brand text-heading-l text-neutral-900">
        Submitting…
      </h2>
      <div className="h-[3px] w-56 overflow-hidden rounded-full bg-neutral-300">
        <div className="h-full w-1/3 animate-[scorecard-load_1.1s_ease-in-out_infinite] rounded-full bg-primary-400" />
      </div>
      <p className="text-body-s text-neutral-700">Sending your request to our analyst.</p>
    </div>
  );
}

function ConfirmationScreen({
  titleId,
  variant,
}: {
  titleId: string;
  variant: "done" | "duplicate";
}) {
  const confirmation = variant === "duplicate" ? scorecard.duplicate : scorecard.confirmation;
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-200">
        <svg width="30" height="30" viewBox="0 0 22 22" fill="none" aria-hidden>
          <path
            d="M6 11.5l3.2 3.2L16 8"
            stroke="var(--color-success-500)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 id={titleId} className="font-brand text-heading-l text-neutral-900">
        {confirmation.headline}
      </h2>
      <p className="max-w-[46ch] text-body text-neutral-700">{confirmation.body}</p>
      <div className="flex flex-col items-center gap-3 pt-2">
        <span className="ds-label text-label text-neutral-700">
          {confirmation.bookPrompt}
        </span>
        <Button href={DIAGNOSTIC_BOOKING_URL} external variant="secondary" size="medium" className="rounded-full">
          {scorecard.bookLabel}
        </Button>
      </div>
    </div>
  );
}

function ErrorScreen({
  titleId,
  onRetry,
}: {
  titleId: string;
  onRetry: () => void;
}) {
  const { error } = scorecard;
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-16 text-center">
      <h2 id={titleId} className="font-brand text-heading-l text-neutral-900">
        {error.headline}
      </h2>
      <p className="max-w-[46ch] text-body text-neutral-700">{error.body}</p>
      <button type="button" onClick={onRetry} className={`${actionCls} px-6 py-3`}>
        {error.retryLabel}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const errId = `${id}-err`;
  const field = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errId : undefined,
      })
    : children;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="ds-label text-label text-neutral-800">
        {label}
      </label>
      {field}
      {error && (
        <span id={errId} className="text-body-s text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-lg border bg-neutral-100 px-4 py-3 text-body text-neutral-900",
    "placeholder:text-neutral-500",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400",
    hasError ? "border-red-400" : "border-neutral-400",
  ].join(" ");
}

function LegalFooter() {
  const { legal } = scorecard;
  return (
    <p className="text-body-s text-neutral-700">
      {legal.entity}. {legal.note}{" "}
      <a href={legal.privacyHref} className="underline underline-offset-2 hover:text-neutral-900">
        Privacy Policy
      </a>{" "}
      &amp;{" "}
      <a href={legal.termsHref} className="underline underline-offset-2 hover:text-neutral-900">
        Terms of Service
      </a>
      .
    </p>
  );
}

function Arrow() {
  return (
    <svg
      width="18"
      height="16"
      viewBox="0 0 18 16"
      fill="none"
      aria-hidden
      className="line-icon nudge-x"
    >
      <path d="M10 1l7 7-7 7M17 8H1" stroke="currentColor" strokeWidth="2" strokeLinecap="square" pathLength={1} />
    </svg>
  );
}
