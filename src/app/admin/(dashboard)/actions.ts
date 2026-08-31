"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin-client";
import { createSessionClient } from "@/lib/supabase/server-client";
import { CONTACT_STATUSES, ORDER_STATUSES } from "./constants";

export async function updateContactStatus(
  contactId: string,
  personId: string,
  fromStatus: string,
  formData: FormData
) {
  const toStatus = String(formData.get("status") ?? "");

  if (
    !CONTACT_STATUSES.includes(toStatus as (typeof CONTACT_STATUSES)[number]) ||
    toStatus === fromStatus
  ) {
    return;
  }

  const session = await createSessionClient();
  const {
    data: { user },
  } = await session.auth.getUser();
  const actor = user?.email ?? "unknown";

  const admin = createAdminClient();

  const { error: updateError } = await admin
    .from("contacts")
    .update({ status: toStatus })
    .eq("id", contactId);

  if (updateError) throw new Error(updateError.message);

  const { error: logError } = await admin.from("activity_log").insert({
    contact_id: contactId,
    person_id: personId,
    from_status: fromStatus,
    to_status: toStatus,
    actor,
  });

  if (logError) throw new Error(logError.message);

  revalidatePath("/admin");
  revalidatePath(`/admin/people/${personId}`);
}

export async function addOrder(personId: string, formData: FormData) {
  const productName = String(formData.get("product_name") ?? "").trim();
  const amountDollars = Number(formData.get("amount"));
  const status = String(formData.get("status") ?? "pending");

  if (!productName || Number.isNaN(amountDollars) || amountDollars < 0) {
    return;
  }
  if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
    return;
  }

  const admin = createAdminClient();
  const { error } = await admin.from("orders").insert({
    person_id: personId,
    product_name: productName,
    amount_cents: Math.round(amountDollars * 100),
    currency: "AUD",
    status,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/people/${personId}`);
  revalidatePath("/admin/orders");
}
