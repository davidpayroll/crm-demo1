import { ContactForm } from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F8FA]">
      <header className="border-b-[3px] border-[#485F88] bg-white">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#467D79] mb-1">
            Payroll Consulting &amp; Advisory
          </p>
          <h1 className="text-2xl font-bold text-[#29394D]">
            Australian Payroll Advisory
          </h1>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-xl font-bold text-[#29394D] mb-2">
          Get in touch
        </h2>
        <p className="text-sm text-[#333132] mb-8 max-w-xl">
          Payroll remediations, compliance reviews, system setups, or a
          general question — tell us what you need and we&apos;ll be in
          touch.
        </p>
        <div className="bg-white border border-[#E1E5EC] rounded-lg px-6 py-8">
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
