import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F7F8FA] px-4">
      <div className="w-full max-w-sm bg-white border border-[#E1E5EC] rounded-lg p-8 shadow-sm">
        <h1 className="text-xl font-bold text-[#29394D] mb-1">Admin login</h1>
        <p className="text-sm text-[#808897] mb-6">
          Australian Payroll Advisory — CRM
        </p>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#29394D] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded border border-[#E1E5EC] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#485F88]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#29394D] mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded border border-[#E1E5EC] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#485F88]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#485F88] text-white text-sm font-semibold rounded py-2 hover:bg-[#3a4d70] transition-colors"
          >
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}
