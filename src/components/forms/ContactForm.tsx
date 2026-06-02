"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitLead } from "@/app/actions/leads";
import {
  leadSchema,
  SERVICE_OPTIONS_DISPLAY,
  type LeadFormData,
} from "@/lib/validations/lead";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────── */

const CONTACT_INFO = [
  // {
  //   icon: MapPin,
  //   label: "Visit Us",
  //   lines: [" 11112 Veterans Memorial Pkwy", "Lake Saint Louis", "MO63367"],
  // },
  {
    icon: Phone,
    label: "Call Us",
    lines: ["+1 (636) 369-2742"],
    href: "tel:+16363692742",
  },
  {
    icon: Mail,
    label: "Email Us",
    lines: ["thegentlemenshousebarbershop@gmail.com"],
    href: "mailto:thegentlemenshousebarbershop@gmail.com",
  },
];

const HOURS = [
  { days: "Monday – Thursday", time: "9:00 AM – 8:00 PM" },
  { days: "Friday - Saturday", time: "9:00 AM – 9:00 PM" },
  { days: "Sunday", time: "9:00 AM – 7:00 PM" },
];

/* ─── Input / Textarea shared class builder ─────────────────── */
function fieldClass(hasError: boolean) {
  return [
    "w-full px-5 py-4",
    "font-outfit text-sm text-luxury-ivory",
    "bg-luxury-graphite",
    "border border-transparent",
    hasError
      ? "border-red-500/40 focus:ring-red-500/30"
      : "border-luxury-graphite hover:border-luxury-amber/30 focus:border-luxury-amber",
    "focus:outline-none focus:ring-1 focus:ring-luxury-amber/40",
    "transition-all duration-300",
    "placeholder:text-luxury-pearl/25",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" ");
}

function FieldLabel({
  htmlFor,
  children,
  optional,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="flex items-center gap-2 mb-2">
      <span
        className="font-mono text-luxury-pearl/50 text-xs uppercase"
        style={{ letterSpacing: "0.18em" }}
      >
        {children}
      </span>
      {optional && (
        <span
          className="font-mono text-luxury-pearl/25 text-xs"
          style={{ letterSpacing: "0.12em" }}
        >
          — Optional
        </span>
      )}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 font-outfit text-xs text-red-400/80">
      <span className="w-1 h-1 rounded-full bg-red-400/80 shrink-0" />
      {message}
    </p>
  );
}

/* ─── Success State ─────────────────────────────────────────── */
function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center border border-luxury-amber/15 bg-luxury-graphite/30"
    >
      {/* Amber ring + check */}
      <div className="relative mb-8">
        <div className="w-16 h-16 border border-luxury-amber/30 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-luxury-amber" />
        </div>
        <div className="absolute -inset-2 border border-luxury-amber/10" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-px bg-luxury-amber/40" />
        <span
          className="font-mono text-luxury-amber/60 text-xs uppercase"
          style={{ letterSpacing: "0.25em" }}
        >
          Message Received
        </span>
        <div className="w-6 h-px bg-luxury-amber/40" />
      </div>

      <h3 className="font-playfair text-2xl md:text-3xl text-luxury-ivory mb-3">
        Thank You
      </h3>
      <p className="font-outfit text-luxury-pearl/60 text-sm leading-relaxed max-w-sm">
        Your message has been received. We&apos;ll be in touch within 24 hours
        to arrange your experience.
      </p>
    </motion.div>
  );
}
interface FormError {
  message?: string;
}

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error" | "rate-limited"
  >("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    mode: "onBlur",
  });

  async function onSubmit(data: LeadFormData) {
    setServerError(null);
    setSubmitStatus("idle");

    const result = await submitLead(data);

    if (result.success) {
      setSubmitStatus("success");
      reset();
      // Auto-dismiss success message after 6 seconds
      setTimeout(() => setSubmitStatus("idle"), 6000);
    } else if ("error" in result) {
      if (result.error?.includes("Too many submissions")) {
        setSubmitStatus("rate-limited");
      } else {
        setSubmitStatus("error");
      }
      setServerError(result.error || "Failed to submit. Please try again.");
    } else if ("errors" in result) {
      // Validation errors handled by form state
      setSubmitStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="bg-luxury-midnight py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-luxury mx-auto px-6 lg:px-12" ref={sectionRef}>
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14 lg:mb-20"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: "0.25em" }}
            >
              Get In Touch
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2
              className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-ivory"
              style={{ lineHeight: "1.15" }}
            >
              Book Your{" "}
              <span className="italic text-luxury-amber">Experience</span>
            </h2>
            <p className="font-outfit text-luxury-pearl/40 text-sm max-w-xs leading-relaxed lg:text-right">
              Reserve your appointment or send us an enquiry — our team responds
              within 24 hours.
            </p>
          </div>
        </motion.div>

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* ── Left: Info Panel (2/5) ── */}
          <motion.aside
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="lg:col-span-2 flex flex-col gap-0"
          >
            <div className="w-full h-96 bg-secondary rounded-lg border border-border overflow-hidden flex items-center justify-center">
              <iframe
                title="The Gentry House Barbershop Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.1234567890123!2d-90.8!3d38.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87f5e7c9e7c9e7c9%3A0x1234567890!2s11112%20Veterans%20Memorial%20Pkwy%2C%20Lake%20Saint%20Louis%2C%20MO%2063367!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              />
            </div>

            {/* Contact blocks */}
            <div className="border-t border-luxury-graphite">
              {CONTACT_INFO.map(({ icon: Icon, label, lines, href }) => (
                <div
                  key={label}
                  className="group flex items-start gap-5 py-7 border-b border-luxury-graphite"
                >
                  <div className="w-9 h-9 border border-luxury-graphite flex items-center justify-center shrink-0 group-hover:border-luxury-amber/40 transition-colors duration-300">
                    <Icon
                      size={15}
                      className="text-luxury-amber/60 group-hover:text-luxury-amber transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <span
                      className="font-mono text-luxury-pearl/35 text-xs uppercase block mb-1.5"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      {label}
                    </span>
                    {lines.map((line, i) =>
                      href && i === 0 ? (
                        <a
                          key={line}
                          href={href}
                          className="block font-outfit text-luxury-pearl/70 text-sm hover:text-luxury-amber transition-colors duration-300"
                        >
                          {line}
                        </a>
                      ) : (
                        <p
                          key={line}
                          className="font-outfit text-luxury-pearl/70 text-sm"
                        >
                          {line}
                        </p>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            {/* <div className="mt-8">
              <div className="flex items-center gap-3 mb-5">
                <Clock size={13} className="text-luxury-amber/50" />
                <span
                  className="font-mono text-luxury-pearl/35 text-xs uppercase"
                  style={{ letterSpacing: "0.2em" }}
                >
                  Opening Hours
                </span>
              </div>
              <div className="space-y-3">
                {HOURS.map(({ days, time }) => (
                  <div key={days} className="flex items-center gap-2">
                    <span className="font-outfit text-luxury-pearl/60 text-sm whitespace-nowrap">
                      {days}
                    </span>
                    <span
                      className="flex-1"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, rgba(201,169,98,0.25) 1px, transparent 1px)",
                        backgroundSize: "6px 1px",
                        backgroundRepeat: "repeat-x",
                        backgroundPosition: "center",
                        height: "1px",
                      }}
                    />
                    <span className="font-outfit text-luxury-pearl/40 text-sm whitespace-nowrap">
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Divider ornament */}
            <div className="flex items-center gap-4 mt-10">
              <div className="h-px flex-1 bg-luxury-graphite" />
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 rotate-45 bg-luxury-amber/30" />
                <div className="w-1.5 h-1.5 rotate-45 bg-luxury-amber/50" />
                <div className="w-1 h-1 rotate-45 bg-luxury-amber/30" />
              </div>
              <div className="h-px flex-1 bg-luxury-graphite" />
            </div>
          </motion.aside>

          {/* ── Right: Form (3/5) ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="lg:col-span-3"
          >
            {submitStatus === "success" ? (
              <SuccessState />
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="space-y-0"
              >
                {/* Server Error */}
                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 px-5 py-4 border border-red-500/20 bg-red-500/5 mb-6"
                  >
                    <AlertCircle
                      size={16}
                      className="text-red-400 shrink-0 mt-0.5"
                    />
                    <p className="font-outfit text-red-400/80 text-sm">
                      {serverError}
                    </p>
                  </motion.div>
                )}

                {/* Name + Email (2-col on md+) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-px">
                  <div className="bg-luxury-charcoal px-6 pt-6 pb-6">
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <input
                      id="name"
                      type="text"
                      placeholder="James Thornton"
                      {...register("name", { required: "Name is required" })}
                      className={fieldClass(!!errors.name)}
                      disabled={isSubmitting}
                    />
                    <FieldError message={errors.name?.message} />
                  </div>

                  <div className="bg-luxury-charcoal px-6 pt-6 pb-6">
                    <FieldLabel htmlFor="email">Email Address</FieldLabel>
                    <input
                      id="email"
                      type="email"
                      placeholder="james@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Enter a valid email address",
                        },
                      })}
                      className={fieldClass(!!errors.email)}
                      disabled={isSubmitting}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>
                </div>

                {/* Phone + Service (2-col on md+) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px mb-px">
                  <div className="bg-luxury-charcoal px-6 pt-6 pb-6">
                    <FieldLabel htmlFor="phone" optional>
                      Phone Number
                    </FieldLabel>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      {...register("phone")}
                      className={fieldClass(!!errors.phone)}
                      disabled={isSubmitting}
                    />
                    <FieldError message={errors.phone?.message} />
                  </div>

                  <div className="bg-luxury-charcoal px-6 pt-6 pb-6">
                    <FieldLabel htmlFor="service_interest" optional>
                      Service
                    </FieldLabel>
                    <div className="relative">
                      <select
                        id="service_interest"
                        {...register("service_interest")}
                        className={[
                          fieldClass(!!errors.service_interest),
                          "appearance-none cursor-pointer pr-10",
                        ].join(" ")}
                        disabled={isSubmitting}
                        style={{ backgroundColor: "#2D2D2D" }}
                      >
                        <option value="">Select a service…</option>
                        {SERVICE_OPTIONS_DISPLAY.map((s) => (
                          <option
                            key={s}
                            value={s}
                            style={{ backgroundColor: "#1A1A1A" }}
                          >
                            {s}
                          </option>
                        ))}
                      </select>
                      {/* Custom caret */}
                      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                        <svg
                          width="10"
                          height="6"
                          viewBox="0 0 10 6"
                          fill="none"
                        >
                          <path
                            d="M1 1L5 5L9 1"
                            stroke="#C9A962"
                            strokeOpacity="0.5"
                            strokeWidth="1.5"
                            strokeLinecap="square"
                          />
                        </svg>
                      </div>
                    </div>
                    <FieldError message={errors.service_interest?.message} />
                  </div>
                </div>

                {/* Message */}
                <div className="bg-luxury-charcoal px-6 pt-6 pb-6 mb-px">
                  <FieldLabel htmlFor="message">Your Message</FieldLabel>
                  <textarea
                    id="message"
                    placeholder="Tell us about your grooming goals and how we can assist you…"
                    rows={5}
                    {...register("message", {
                      required: "Please include a message",
                    })}
                    className={[
                      fieldClass(!!errors.message),
                      "resize-none min-h-[140px]",
                    ].join(" ")}
                    disabled={isSubmitting}
                  />
                  <FieldError message={errors.message?.message} />
                </div>

                {/* Honeypot */}
                <input
                  type="text"
                  {...register("honeypot")}
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none w-0 h-0"
                  aria-hidden="true"
                />

                {/* Submit row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={[
                      "group flex items-center justify-center gap-3",
                      "px-10 py-4",
                      "font-outfit font-medium text-sm uppercase",
                      "transition-all duration-300",
                      isSubmitting
                        ? "bg-luxury-graphite text-luxury-pearl/30 cursor-not-allowed"
                        : "bg-luxury-amber text-luxury-midnight hover:bg-luxury-whiskey hover:scale-105",
                    ].join(" ")}
                    style={{ letterSpacing: "0.12em" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight
                          size={15}
                          className="group-hover:translate-x-1 transition-transform duration-300"
                        />
                      </>
                    )}
                  </button>

                  <p
                    className="font-mono text-luxury-pearl/25 text-xs leading-relaxed sm:max-w-[200px]"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    Your details are secure and will never be shared.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
