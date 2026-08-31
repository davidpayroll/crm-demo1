import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin-client";

export const dynamic = "force-dynamic";

type Person = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  ok_to_contact: boolean;
  attributes: Record<string, string> | null;
  created_at: string;
};

function escapeForFilter(value: string) {
  return value.replace(/[%,()]/g, "");
}

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = createAdminClient();

  let query = supabase
    .from("people")
    .select(
      "id, name, email, phone, company, ok_to_contact, attributes, created_at"
    )
    .order("created_at", { ascending: false });

  if (q) {
    const term = escapeForFilter(q.trim());
    if (term) {
      query = query.or(
        `name.ilike.%${term}%,email.ilike.%${term}%,company.ilike.%${term}%`
      );
    }
  }

  const { data, error } = await query;
  const people = (data ?? []) as Person[];

  return (
    <div>
      <h2 className="text-xl font-bold text-[#29394D] mb-1">People</h2>
      <p className="text-sm text-[#808897] mb-6">
        Every contact captured, deduplicated by email.
      </p>

      <form className="mb-6 flex gap-2 max-w-md">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search by name, email, or company"
          className="flex-1 rounded border border-[#E1E5EC] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#485F88]"
        />
        <button
          type="submit"
          className="bg-[#485F88] text-white text-sm font-semibold rounded px-4 py-2 hover:bg-[#3a4d70] transition-colors"
        >
          Search
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
          Couldn&apos;t load people: {error.message}
        </p>
      )}

      {!error && people.length === 0 && (
        <div className="bg-white border border-[#E1E5EC] rounded-lg px-6 py-10 text-center text-sm text-[#808897]">
          No matching people.
        </div>
      )}

      <div className="space-y-3">
        {people.map((person) => {
          const attrs = person.attributes ?? {};
          return (
            <Link
              key={person.id}
              href={`/admin/people/${person.id}`}
              className="block bg-white border border-[#E1E5EC] rounded-lg px-6 py-4 hover:border-[#485F88] transition-colors"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="font-bold text-[#29394D]">
                    {person.name || "(no name)"}{" "}
                    <span className="font-normal text-[#808897]">
                      &lt;{person.email}&gt;
                    </span>
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#808897]">
                    {person.phone && <span>Phone: {person.phone}</span>}
                    {person.company && <span>Company: {person.company}</span>}
                    {attrs.business_size && (
                      <span>Business size: {attrs.business_size}</span>
                    )}
                    {attrs.payroll_software_in_use && (
                      <span>Software: {attrs.payroll_software_in_use}</span>
                    )}
                  </div>
                </div>
                {person.ok_to_contact && (
                  <span className="text-xs font-semibold uppercase tracking-wide bg-[#EEF4F3] text-[#467D79] px-2.5 py-1 rounded">
                    Subscribed
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
