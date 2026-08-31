import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin-client";

export const dynamic = "force-dynamic";

type Person = {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  created_at: string;
};

export default async function NewsletterPage() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("people")
    .select("id, name, email, company, created_at")
    .eq("ok_to_contact", true)
    .order("created_at", { ascending: false });

  const people = (data ?? []) as Person[];

  return (
    <div>
      <h2 className="text-xl font-bold text-[#29394D] mb-1">Newsletter</h2>
      <p className="text-sm text-[#808897] mb-6">
        Everyone who opted in to hear from you.
      </p>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
          Couldn&apos;t load the list: {error.message}
        </p>
      )}

      {!error && people.length === 0 && (
        <div className="bg-white border border-[#E1E5EC] rounded-lg px-6 py-10 text-center text-sm text-[#808897]">
          No one has opted in yet.
        </div>
      )}

      <div className="bg-white border border-[#E1E5EC] rounded-lg divide-y divide-[#E1E5EC]">
        {people.map((p) => (
          <Link
            key={p.id}
            href={`/admin/people/${p.id}`}
            className="block px-6 py-3 hover:bg-[#F7F8FA] transition-colors"
          >
            <p className="text-sm font-medium text-[#29394D]">
              {p.name || "(no name)"}{" "}
              <span className="font-normal text-[#808897]">&lt;{p.email}&gt;</span>
            </p>
            {p.company && (
              <p className="text-xs text-[#808897]">{p.company}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
