"use server";

import { createAdminClient } from "@/lib/supabase/admin-client";

export type SubmitInquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const VALID_TYPES = [
  "payroll_remediations",
  "general_question",
  "compliance_review_audit",
  "system_setup_implementation",
] as const;

export async function submitInquiry(
  _prevState: SubmitInquiryState,
  formData: FormData
): Promise<SubmitInquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const message = String(formData.get("message") ?? "").trim();
  const okToContact = formData.get("ok_to_contact") === "on";

  const industrialInstrument = String(
    formData.get("industrial_instrument_in_use") ?? ""
  ).trim();
  const businessSize = String(formData.get("business_size") ?? "").trim();
  const payrollSoftware = String(
    formData.get("payroll_software_in_use") ?? ""
  ).trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Name, email, and message are required." };
  }

  if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return { status: "error", message: "Please choose a valid inquiry type." };
  }

  const supabase = createAdminClient();

  const attributes: Record<string, string> = {};
  if (industrialInstrument) attributes.industrial_instrument_in_use = industrialInstrument;
  if (businessSize) attributes.business_size = businessSize;
  if (payrollSoftware) attributes.payroll_software_in_use = payrollSoftware;

  const { data: person, error: personError } = await supabase
    .from("people")
    .upsert(
      {
        email,
        name,
        phone: phone || null,
        company: company || null,
        source_site: "apa-marketing-site",
        ok_to_contact: okToContact,
        attributes,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  if (personError || !person) {
    return {
      status: "error",
      message: `Couldn't save your details: ${personError?.message ?? "unknown error"}`,
    };
  }

  const { error: contactError } = await supabase.from("contacts").insert({
    person_id: person.id,
    type,
    message,
    source: "apa-marketing-site",
    status: "new_lead",
  });

  if (contactError) {
    return {
      status: "error",
      message: `Couldn't save your inquiry: ${contactError.message}`,
    };
  }

  return { status: "success" };
}
