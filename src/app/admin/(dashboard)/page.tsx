import { createAdminClient } from "@/lib/supabase/admin-client";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  payroll_remediations: "Payroll Remediations",
  general_question: "General Question",
  compliance_review_audit: "Compliance Review/Audit",
  system_setup_implementation: "System Setup/Implementation",
};

const STATUS_LABELS: Record<string, string> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  discovery_call: "Discovery Call",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

type Lead = {
  id: string;
  type: string;
  subject: string | null;
  message: string | null;
  status: string;
  created_at: string;
  people: {
    name: string | null;
    email: string;
    phone: string | null;
    company: string | null;
    attributes: Record<string, string> | null;
  } | null;
};

export default async function AdminLeadsPage() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("contacts")
    .select(
      "id, type, subject, message, status, created_at, people:person_id ( name, email, phone, company, attributes )"
    )
    .order("created_at", { ascending: false });

  const leads = (data ?? []) as unknown as Lead[];

  return (
    <div>
      <h2 className="text-xl font-bold text-[#29394D] mb-1">Incoming leads</h2>
      <p className="text-sm text-[#808897] mb-6">
        Every inquiry submitted on the public site, newest first.
      </p>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
          Couldn&apos;t load leads: {error.message}
        </p>
      )}

      {!error && leads.length === 0 && (
        <div className="bg-white border border-[#E1E5EC] rounded-lg px-6 py-10 text-center text-sm text-[#808897]">
          No inquiries yet. Submit the contact form on the public site to see
          one appear here.
        </div>
      )}

      <div className="space-y-4">
        {leads.map((lead) => {
          const attrs = lead.people?.attributes ?? {};
          return (
            <div
              key={lead.id}
              className="bg-white border border-[#E1E5EC] border-l-4 border-l-[#485F88] rounded-lg px-6 py-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-bold text-[#29394D]">
                    {lead.people?.name || "(no name)"}{" "}
                    <span className="font-normal text-[#808897]">
                      &lt;{lead.people?.email}&gt;
                    </span>
                  </p>
                  <p className="text-sm text-[#485F88] font-semibold mt-0.5">
                    {TYPE_LABELS[lead.type] ?? lead.type}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide bg-[#F1F3F7] text-[#29394D] px-2.5 py-1 rounded">
                    {STATUS_LABELS[lead.status] ?? lead.status}
                  </span>
                  <span className="text-xs text-[#808897]">
                    {new Date(lead.created_at).toLocaleString("en-AU")}
                  </span>
                </div>
              </div>

              {lead.subject && (
                <p className="mt-3 text-sm font-medium text-[#29394D]">
                  {lead.subject}
                </p>
              )}
              {lead.message && (
                <p className="mt-1 text-sm text-[#333132] whitespace-pre-wrap">
                  {lead.message}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#808897] border-t border-[#E1E5EC] pt-3">
                {lead.people?.phone && <span>Phone: {lead.people.phone}</span>}
                {lead.people?.company && (
                  <span>Company: {lead.people.company}</span>
                )}
                {attrs.industrial_instrument_in_use && (
                  <span>
                    Industrial instrument: {attrs.industrial_instrument_in_use}
                  </span>
                )}
                {attrs.business_size && (
                  <span>Business size: {attrs.business_size}</span>
                )}
                {attrs.payroll_software_in_use && (
                  <span>
                    Payroll software: {attrs.payroll_software_in_use}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
