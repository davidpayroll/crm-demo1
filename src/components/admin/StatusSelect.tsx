"use client";

const STATUS_LABELS: Record<string, string> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  discovery_call: "Discovery Call",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};

export function StatusSelect({
  action,
  statuses,
  currentStatus,
}: {
  action: (formData: FormData) => void;
  statuses: readonly string[];
  currentStatus: string;
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={currentStatus}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="text-xs font-semibold uppercase tracking-wide bg-[#F1F3F7] text-[#29394D] px-2.5 py-1 rounded border border-[#E1E5EC]"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s] ?? s}
          </option>
        ))}
      </select>
    </form>
  );
}
