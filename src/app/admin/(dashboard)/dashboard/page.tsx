import { createAdminClient } from "@/lib/supabase/admin-client";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  discovery_call: "Discovery Call",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};
const STATUS_ORDER = [
  "new_lead",
  "contacted",
  "discovery_call",
  "proposal",
  "won",
  "lost",
];

const TYPE_LABELS: Record<string, string> = {
  payroll_remediations: "Payroll Remediations",
  general_question: "General Question",
  compliance_review_audit: "Compliance Review/Audit",
  system_setup_implementation: "System Setup/Implementation",
};

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(cents / 100);
}

function Bar({
  label,
  count,
  max,
  extra,
}: {
  label: string;
  count: number;
  max: number;
  extra?: string;
}) {
  const pct = max === 0 ? 0 : Math.round((count / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 shrink-0 text-sm text-[#333132]">{label}</div>
      <div className="flex-1 bg-[#F1F3F7] rounded h-5 overflow-hidden">
        <div
          className="bg-[#485F88] h-full rounded"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-24 shrink-0 text-sm text-right text-[#29394D] font-medium">
        {count}
        {extra ? ` ${extra}` : ""}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = createAdminClient();

  const [{ data: contacts }, { data: orders }, { data: people }] =
    await Promise.all([
      supabase.from("contacts").select("status, type, created_at"),
      supabase.from("orders").select("amount_cents, status, created_at"),
      supabase.from("people").select("ok_to_contact, created_at"),
    ]);

  const statusCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  for (const c of contacts ?? []) {
    statusCounts[c.status] = (statusCounts[c.status] ?? 0) + 1;
    typeCounts[c.type] = (typeCounts[c.type] ?? 0) + 1;
  }
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));
  const maxTypeCount = Math.max(1, ...Object.values(typeCounts));

  const revenueByStatus: Record<string, { count: number; cents: number }> = {};
  for (const o of orders ?? []) {
    const bucket = revenueByStatus[o.status] ?? { count: 0, cents: 0 };
    bucket.count += 1;
    bucket.cents += o.amount_cents;
    revenueByStatus[o.status] = bucket;
  }
  const paidCents = revenueByStatus.paid?.cents ?? 0;
  const totalOrderCents = (orders ?? []).reduce(
    (sum, o) => sum + o.amount_cents,
    0
  );

  const subscribers = (people ?? []).filter((p) => p.ok_to_contact);
  const monthKey = (iso: string) => iso.slice(0, 7);
  const monthlySubs: Record<string, number> = {};
  for (const p of subscribers) {
    const key = monthKey(p.created_at);
    monthlySubs[key] = (monthlySubs[key] ?? 0) + 1;
  }
  const months = Object.keys(monthlySubs).sort();
  const maxMonthlyCount = Math.max(1, ...Object.values(monthlySubs));

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold text-[#29394D] mb-1">Dashboard</h2>
        <p className="text-sm text-[#808897]">
          A quick read on the whole pipeline.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E1E5EC] rounded-lg px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-[#808897] mb-1">
            Total inquiries
          </p>
          <p className="text-2xl font-bold text-[#29394D]">
            {(contacts ?? []).length}
          </p>
        </div>
        <div className="bg-white border border-[#E1E5EC] rounded-lg px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-[#808897] mb-1">
            Paid revenue
          </p>
          <p className="text-2xl font-bold text-[#467D79]">
            {formatMoney(paidCents)}
          </p>
        </div>
        <div className="bg-white border border-[#E1E5EC] rounded-lg px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-[#808897] mb-1">
            Newsletter subscribers
          </p>
          <p className="text-2xl font-bold text-[#29394D]">
            {subscribers.length}
          </p>
        </div>
      </div>

      <section className="bg-white border border-[#E1E5EC] rounded-lg px-6 py-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#29394D] mb-4">
          Pipeline by stage
        </h3>
        <div className="space-y-2">
          {STATUS_ORDER.map((s) => (
            <Bar
              key={s}
              label={STATUS_LABELS[s]}
              count={statusCounts[s] ?? 0}
              max={maxStatusCount}
            />
          ))}
        </div>
      </section>

      <section className="bg-white border border-[#E1E5EC] rounded-lg px-6 py-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#29394D] mb-4">
          Inquiries by type
        </h3>
        <div className="space-y-2">
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <Bar
              key={key}
              label={label}
              count={typeCounts[key] ?? 0}
              max={maxTypeCount}
            />
          ))}
        </div>
      </section>

      <section className="bg-white border border-[#E1E5EC] rounded-lg px-6 py-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#29394D] mb-4">
          Orders by status
        </h3>
        <div className="space-y-2">
          {["paid", "pending", "refunded", "cancelled"].map((s) => {
            const bucket = revenueByStatus[s] ?? { count: 0, cents: 0 };
            return (
              <Bar
                key={s}
                label={s[0].toUpperCase() + s.slice(1)}
                count={bucket.count}
                max={Math.max(
                  1,
                  ...Object.values(revenueByStatus).map((b) => b.count)
                )}
                extra={bucket.cents ? `· ${formatMoney(bucket.cents)}` : ""}
              />
            );
          })}
        </div>
        <p className="text-xs text-[#808897] mt-4 border-t border-[#E1E5EC] pt-3">
          Total across all orders: {formatMoney(totalOrderCents)}
        </p>
      </section>

      <section className="bg-white border border-[#E1E5EC] rounded-lg px-6 py-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-[#29394D] mb-4">
          Newsletter growth by month
        </h3>
        {months.length === 0 && (
          <p className="text-sm text-[#808897]">No subscribers yet.</p>
        )}
        <div className="space-y-2">
          {months.map((m) => (
            <Bar
              key={m}
              label={m}
              count={monthlySubs[m]}
              max={maxMonthlyCount}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
