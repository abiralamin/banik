const featureList = [
  {
    title: "Vendor Registration & Profile",
    desc: "Vendors sign up, verify their email with OTP, and manage a complete business profile.",
  },
  {
    title: "License Application & Approval",
    desc: "A guided 7-step application flow from personal info to payment.",
  },
  {
    title: "Digital License Issuance",
    desc: "QR-coded digital licenses that can be downloaded, printed, and verified.",
  },
  {
    title: "License Renewal",
    desc: "Renewal reminders, discounted early-bird pricing, and flexible periods.",
  },
  {
    title: "Zone Management",
    desc: "Interactive maps with live occupancy status for every vending zone.",
  },
  {
    title: "Payment Management",
    desc: "Application fees and renewal payments with a pay-later option.",
  },
  {
    title: "Complaint Management",
    desc: "Track complaints from submission to resolution with a tracking number.",
  },
  {
    title: "Notifications",
    desc: "Stay updated on license status, renewals, and system announcements.",
  },
  {
    title: "Inspection & Compliance",
    desc: "Admins can schedule inspections and record compliance findings.",
  },
];

export default function Features() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold text-slate-900">
        Platform Features
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
        A complete toolkit for vendors and municipal authorities to manage the
        entire vending lifecycle.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featureList.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-slate-200 p-6 shadow-sm"
          >
            <h3 className="font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
