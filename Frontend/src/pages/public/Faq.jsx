import { useState } from "react";

const faqData = [
  {
    category: "Registration",
    question: "How do I register as a vendor?",
    answer:
      "Go to the Register page, enter your email and password, then verify the OTP sent to your email.",
  },
  {
    category: "Registration",
    question: "I did not receive my OTP, what do I do?",
    answer:
      "Use the Resend OTP option on the verification page. Codes expire after 10 minutes.",
  },
  {
    category: "Licensing",
    question: "How many licenses can I hold?",
    answer:
      "You may apply for and hold multiple licenses across different zones simultaneously.",
  },
  {
    category: "Licensing",
    question: "What documents are required?",
    answer:
      "A valid National ID proof and your bank account details are required during application.",
  },
  {
    category: "Payments",
    question: "Can I pay later?",
    answer:
      'Yes, you may submit your application and choose "Pay Later", but the license is only issued after payment is confirmed.',
  },
  {
    category: "Renewals",
    question: "When can I renew my license?",
    answer:
      "Renewal becomes available 30 days before expiry. Early-bird discounts apply if renewed early.",
  },
  {
    category: "Complaints",
    question: "How do I track my complaint?",
    answer:
      'Every submitted complaint receives a tracking number visible under "My Complaints".',
  },
];

const categories = [
  "All",
  "Registration",
  "Licensing",
  "Payments",
  "Renewals",
  "Complaints",
];

export default function Faq() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const filtered = faqData.filter(
    (f) =>
      (category === "All" || f.category === category) &&
      (f.question.toLowerCase().includes(query.toLowerCase()) ||
        f.answer.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-slate-900">
        FAQ &amp; Help Center
      </h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              category === c
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search FAQs…"
        className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none"
      />

      <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200">
        {filtered.map((f, i) => (
          <div key={f.question}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-medium text-slate-800">{f.question}</span>
              <span className="text-slate-400">
                {openIndex === i ? "−" : "+"}
              </span>
            </button>
            {openIndex === i && (
              <p className="px-5 pb-4 text-sm text-slate-600">{f.answer}</p>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="px-5 py-6 text-sm text-slate-500">
            No matching FAQs found.
          </p>
        )}
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        Need more help? Download the{" "}
        <span className="font-semibold text-brand-700">User Guide (PDF)</span>{" "}
        or use the live chat widget once you are logged in.
      </div>
    </div>
  );
}
