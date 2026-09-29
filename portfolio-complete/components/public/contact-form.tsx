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
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "var(--text-secondary)",
  };

  const errorStyle: React.CSSProperties = {
    marginTop: "0.375rem",
    fontSize: "0.75rem",
    color: "var(--error)",
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label htmlFor="name" style={labelStyle}>
          Name <span style={{ color: "var(--magenta)" }}>*</span>
        </label>
        <Input
          id="name"
          placeholder="Your full name"
          aria-invalid={!!errors.name}
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Use at least 2 characters" },
          })}
        />
        {errors.name && <p style={errorStyle}>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" style={labelStyle}>
          Email <span style={{ color: "var(--magenta)" }}>*</span>
        </label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          aria-invalid={!!errors.email}
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" style={labelStyle}>
          Subject <span style={{ color: "var(--magenta)" }}>*</span>
        </label>
        <Input
          id="subject"
          placeholder="What is this about?"
          aria-invalid={!!errors.subject}
          {...register("subject", {
            required: "Subject is required",
            minLength: { value: 2, message: "At least 2 characters" },
          })}
        />
        {errors.subject && <p style={errorStyle}>{errors.subject.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" style={labelStyle}>
          Message <span style={{ color: "var(--magenta)" }}>*</span>
        </label>
        <Textarea
          id="message"
          placeholder="Your message here…"
          aria-invalid={!!errors.message}
          style={{ minHeight: "140px" }}
          {...register("message", {
            required: "Message is required",
            minLength: { value: 10, message: "Use at least 10 characters" },
          })}
        />
        {errors.message && <p style={errorStyle}>{errors.message.message}</p>}
      </div>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full justify-center"
        style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </button>

      {/* Status message */}
      {status && (
        <div
          className="flex items-start gap-3 rounded-xl p-4 text-sm"
          style={{
            background: status.ok ? "var(--success-bg)" : "var(--error-bg)",
            border: `1px solid ${status.ok ? "var(--success-border)" : "var(--error-border)"}`,
            color: status.ok ? "var(--success)" : "var(--error)",
          }}
          role="status"
        >
          {status.ok ? (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          )}
          {status.message}
        </div>
      )}
    </form>
  );
}
