import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { addOrder } from "../../actions";
import { ORDER_STATUSES } from "../../constants";

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

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: person }, { data: contacts }, { data: activity }, { data: orders }] =
    await Promise.all([
      supabase.from("people").select("*").eq("id", id).single(),
      supabase
        .from("contacts")
        .select("id, type, subject, message, status, created_at")
        .eq("person_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("activity_log")
        .select("contact_id, from_status, to_status, actor, created_at")
        .eq("person_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select("id, product_name, amount_cents, currency, status, created_at")
        .eq("person_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!person) {
    notFound();
  }

  const attrs = (person.attributes ?? {}) as Record<string, string>;
  const activityByContact = new Map<string, typeof activity>();
  for (const entry of activity ?? []) {
    const list = activityByContact.get(entry.contact_id) ?? [];
    list.push(entry);
    activityByContact.set(entry.contact_id, list);
  }

  const boundAddOrder = addOrder.bind(null, id);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[#29394D] mb-1">
          {person.name || "(no name)"}
        </h2>
        <p className="text-sm text-[#808897]">{person.email}</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#333132]">
          {person.phone && <span>Phone: {person.phone}</span>}
          {person.company && <span>Company: {person.company}</span>}
          {person.ok_to_contact && (
            <span className="text-[#467D79] font-semibold">
              Subscribed to newsletter
            </span>
          )}
        </div>
        {(attrs.industrial_instrument_in_use ||
          attrs.business_size ||
          attrs.payroll_software_in_use) && (
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#808897]">
            {attrs.industrial_instrument_in_use && (
              <span>
                Industrial instrument: {attrs.industrial_instrument_in_use}
              </span>
            )}
            {attrs.business_size && (
              <span>Business size: {attrs.business_size}</span>
            )}
            {attrs.payroll_software_in_use && (
              <span>Payroll software: {attrs.payroll_software_in_use}</span>
            )}
          </div>
        )}
      </div>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#29394D] mb-3">
          Inquiries
        </h3>
        {(contacts ?? []).length === 0 && (
          <p className="text-sm text-[#808897]">No inquiries yet.</p>
        )}
        <div className="space-y-3">
          {(contacts ?? []).map((c) => (
            <div
              key={c.id}
              className="bg-white border border-[#E1E5EC] rounded-lg px-5 py-4"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <p className="text-sm font-semibold text-[#485F88]">
                  {TYPE_LABELS[c.type] ?? c.type}
                </p>
                <span className="text-xs font-semibold uppercase tracking-wide bg-[#F1F3F7] text-[#29394D] px-2.5 py-1 rounded">
                  {STATUS_LABELS[c.status] ?? c.status}
                </span>
              </div>
              {c.message && (
                <p className="mt-1 text-sm text-[#333132] whitespace-pre-wrap">
                  {c.message}
                </p>
              )}
              <p className="mt-2 text-xs text-[#808897]">
                {new Date(c.created_at).toLocaleString("en-AU")}
              </p>
              {(activityByContact.get(c.id) ?? []).length > 0 && (
                <ul className="mt-3 border-t border-[#E1E5EC] pt-2 space-y-1">
                  {(activityByContact.get(c.id) ?? []).map((a, i) => (
                    <li key={i} className="text-xs text-[#808897]">
                      {STATUS_LABELS[a.from_status] ?? a.from_status} →{" "}
                      {STATUS_LABELS[a.to_status] ?? a.to_status} by{" "}
                      {a.actor ?? "unknown"} on{" "}
                      {new Date(a.created_at).toLocaleString("en-AU")}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#29394D] mb-3">
          Orders
        </h3>
        {(orders ?? []).length === 0 && (
          <p className="text-sm text-[#808897] mb-4">No orders yet.</p>
        )}
        <div className="space-y-2 mb-4">
          {(orders ?? []).map((o) => (
            <div
              key={o.id}
              className="bg-white border border-[#E1E5EC] rounded-lg px-5 py-3 flex items-center justify-between gap-4 flex-wrap"
            >
              <div>
                <p className="text-sm font-medium text-[#29394D]">
                  {o.product_name}
                </p>
                <p className="text-xs text-[#808897]">
                  {new Date(o.created_at).toLocaleString("en-AU")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#29394D]">
                  {formatMoney(o.amount_cents, o.currency)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide bg-[#F1F3F7] text-[#29394D] px-2.5 py-1 rounded">
                  {ORDER_STATUS_LABELS[o.status] ?? o.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <form
          action={boundAddOrder}
          className="bg-white border border-[#E1E5EC] rounded-lg px-5 py-4 flex flex-wrap items-end gap-4"
        >
          <div className="flex-1 min-w-[160px]">
            <label className="block text-xs font-medium text-[#29394D] mb-1">
              Product / service
            </label>
            <input
              type="text"
              name="product_name"
              required
              className="w-full rounded border border-[#E1E5EC] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#485F88]"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs font-medium text-[#29394D] mb-1">
              Amount (AUD)
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0"
              required
              className="w-full rounded border border-[#E1E5EC] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#485F88]"
            />
          </div>
          <div className="w-40">
            <label className="block text-xs font-medium text-[#29394D] mb-1">
              Status
            </label>
            <select
              name="status"
              defaultValue="pending"
              className="w-full rounded border border-[#E1E5EC] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#485F88]"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ORDER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-[#485F88] text-white text-sm font-semibold rounded px-5 py-2 hover:bg-[#3a4d70] transition-colors"
          >
            Add order
          </button>
        </form>
      </section>
    </div>
  );
}
