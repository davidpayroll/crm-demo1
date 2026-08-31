import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin-client";

export const dynamic = "force-dynamic";

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

type Order = {
  id: string;
  product_name: string;
  amount_cents: number;
  currency: string;
  status: string;
  created_at: string;
  person_id: string;
  people: { name: string | null; email: string } | null;
};

export default async function OrdersPage() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, product_name, amount_cents, currency, status, created_at, person_id, people:person_id ( name, email )"
    )
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as unknown as Order[];

  return (
    <div>
      <h2 className="text-xl font-bold text-[#29394D] mb-1">Orders</h2>
      <p className="text-sm text-[#808897] mb-6">
        Everything people have bought, newest first.
      </p>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
          Couldn&apos;t load orders: {error.message}
        </p>
      )}

      {!error && orders.length === 0 && (
        <div className="bg-white border border-[#E1E5EC] rounded-lg px-6 py-10 text-center text-sm text-[#808897]">
          No orders yet. Add one from a person&apos;s record.
        </div>
      )}

      <div className="space-y-3">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white border border-[#E1E5EC] rounded-lg px-6 py-4 flex items-center justify-between gap-4 flex-wrap"
          >
            <div>
              <p className="text-sm font-medium text-[#29394D]">
                {o.product_name}
              </p>
              <Link
                href={`/admin/people/${o.person_id}`}
                className="text-xs text-[#485F88] hover:underline"
              >
                {o.people?.name || o.people?.email || "(unknown person)"}
              </Link>
              <p className="text-xs text-[#808897] mt-0.5">
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
    </div>
  );
}
