export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">About Banik</h1>
      <p className="mt-4 text-slate-600">
        Banik is a digital platform that helps municipal authorities manage
        street vendors, vending zones, license applications, payments,
        complaints, and compliance in one place — replacing paper-based
        processes with a transparent, trackable system.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900">Our Mission</h2>
          <p className="mt-2 text-sm text-slate-600">
            To make street vending a safe, dignified, and well-regulated
            livelihood by giving vendors easy access to licensing, zones, and
            support services.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900">Our Vision</h2>
          <p className="mt-2 text-sm text-slate-600">
            A city where every street vendor operates under a fair, transparent
            system — and every citizen enjoys organized, accessible public
            spaces.
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="font-semibold text-slate-900">Contact</h2>
        <p className="mt-2 text-sm text-slate-600">
          Email: support@banik.gov.bd
        </p>
        <p className="text-sm text-slate-600">Phone: +880 1700-000000</p>
        <p className="text-sm text-slate-600">
          Address: City Corporation Office, Dhaka
        </p>
      </div>
    </div>
  );
}
