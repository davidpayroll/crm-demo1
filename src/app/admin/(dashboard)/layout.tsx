import { logout } from "./logout/actions";

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
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
