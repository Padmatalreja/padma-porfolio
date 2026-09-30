"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function submit(values: ContactInput) {
    setStatus(null);
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setStatus({ ok: false, message: "Please review the highlighted fields." });
      return;
    }
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });
    const result = await response.json().catch(() => ({ message: "Unable to send your message." }));
    setStatus({ ok: response.ok, message: result.message });
    if (response.ok) reset();
  }

  const labelStyle: React.CSSProperties = {
    display:      "block",
    marginBottom: "0.5rem",
    fontSize:     "0.875rem",
    fontWeight:   600,
    color:        "var(--text-secondary)",
  };

  const errorStyle: React.CSSProperties = {
    marginTop: "0.375rem",
    fontSize:  "0.75rem",
    color:     "var(--error)",
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="cf-name" style={labelStyle}>
          Name <span style={{ color: "var(--magenta)" }} aria-hidden="true">*</span>
        </label>
        <Input
          id="cf-name"
          placeholder="Your full name"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "cf-name-error" : undefined}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Use at least 2 characters" },
          })}
        />
        {errors.name && (
          <p id="cf-name-error" role="alert" style={errorStyle}>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="cf-email" style={labelStyle}>
          Email <span style={{ color: "var(--magenta)" }} aria-hidden="true">*</span>
        </label>
        <Input
          id="cf-email"
          type="email"
          placeholder="your@email.com"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "cf-email-error" : undefined}
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p id="cf-email-error" role="alert" style={errorStyle}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="cf-subject" style={labelStyle}>
          Subject <span style={{ color: "var(--magenta)" }} aria-hidden="true">*</span>
        </label>
        <Input
          id="cf-subject"
          placeholder="What is this about?"
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "cf-subject-error" : undefined}
          {...register("subject", {
            required: "Subject is required",
            minLength: { value: 2, message: "At least 2 characters" },
          })}
        />
        {errors.subject && (
          <p id="cf-subject-error" role="alert" style={errorStyle}>
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cf-message" style={labelStyle}>
          Message <span style={{ color: "var(--magenta)" }} aria-hidden="true">*</span>
        </label>
        <Textarea
          id="cf-message"
          placeholder="Your message here…"
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-error" : undefined}
          style={{ minHeight: "140px" }}
          {...register("message", {
            required: "Message is required",
            minLength: { value: 10, message: "Use at least 10 characters" },
          })}
        />
        {errors.message && (
          <p id="cf-message-error" role="alert" style={errorStyle}>
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from all users including screen readers */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center"
        style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send size={18} aria-hidden="true" />
            Send Message
          </>
        )}
      </button>

      {/* Status message — role="status" for success, role="alert" for errors */}
      {status && (
        <div
          className="flex items-start gap-3 rounded-xl p-4 text-sm"
          style={{
            background: status.ok ? "var(--success-bg)" : "var(--error-bg)",
            border:     `1px solid ${status.ok ? "var(--success-border)" : "var(--error-border)"}`,
            color:      status.ok ? "var(--success)" : "var(--error)",
          }}
          role={status.ok ? "status" : "alert"}
          aria-live={status.ok ? "polite" : "assertive"}
        >
          {status.ok ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          )}
          {status.message}
        </div>
      )}
    </form>
  );
}
