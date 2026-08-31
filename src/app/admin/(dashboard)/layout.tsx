import Link from "next/link";
import { logout } from "./logout/actions";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Leads" },
  { href: "/admin/people", label: "People" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/newsletter", label: "Newsletter" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b-[3px] border-[#485F88] bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-[#467D79]">
              Admin
            </p>
            <h1 className="text-lg font-bold text-[#29394D]">
              Australian Payroll Advisory
            </h1>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-[#485F88] hover:underline"
            >
              Log out
            </button>
          </form>
        </div>
        <nav className="max-w-5xl mx-auto px-6 flex gap-6 border-t border-[#E1E5EC]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#485F88] py-3 border-b-2 border-transparent hover:border-[#485F88]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
