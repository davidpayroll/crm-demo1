"use client";

import { useActionState } from "react";
import { submitInquiry, type SubmitInquiryState } from "@/app/actions";

const initialState: SubmitInquiryState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitInquiry,
    initialState
  );

  if (state.status === "success") {
    return (
      <div className="bg-white border border-[#E1E5EC] border-l-4 border-l-[#467D79] rounded-lg px-6 py-8 text-center">
        <p className="text-lg font-bold text-[#29394D] mb-1">
          Thanks — we&apos;ve got it.
        </p>
        <p className="text-sm text-[#333132]">
          Your inquiry has been received. We&apos;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.status === "error" && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {state.message}
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" />
        <Field label="Company" name="company" />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#29394D] mb-1">
          What can we help with?
        </label>
        <select
          name="type"
          required
          className="w-full rounded border border-[#E1E5EC] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#485F88]"
          defaultValue=""
        >
          <option value="" disabled>
            Choose one
          </option>
          <option value="payroll_remediations">Payroll Remediation</option>
          <option value="general_question">General Question</option>
          <option value="compliance_review_audit">
            Compliance Review / Audit
          </option>
          <option value="system_setup_implementation">
            System Setup / Implementation
          </option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Industrial instrument in use"
          name="industrial_instrument_in_use"
          placeholder="e.g. Clerks Award"
        />
        <div>
          <label className="block text-sm font-medium text-[#29394D] mb-1">
            Business size
          </label>
          <select
            name="business_size"
            className="w-full rounded border border-[#E1E5EC] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#485F88]"
            defaultValue=""
          >
            <option value="">Not sure / prefer not to say</option>
            <option value="1-20">1–20 employees</option>
            <option value="21-100">21–100 employees</option>
            <option value="101-500">101–500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
        </div>
      </div>

      <Field
        label="Payroll software in use"
        name="payroll_software_in_use"
        placeholder="e.g. Xero, MYOB, ADP"
      />

      <div>
        <label className="block text-sm font-medium text-[#29394D] mb-1">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full rounded border border-[#E1E5EC] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#485F88]"
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-[#333132]">
        <input type="checkbox" name="ok_to_contact" className="mt-1" />
        Keep me on the mailing list for payroll updates.
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto bg-[#485F88] text-white text-sm font-semibold rounded px-6 py-2.5 hover:bg-[#3a4d70] transition-colors disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#29394D] mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded border border-[#E1E5EC] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#485F88]"
      />
    </div>
  );
}
