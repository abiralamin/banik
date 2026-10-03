import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/api";

const benefits = [
  {
    title: "Transparency",
    desc: "Every application, payment and decision is tracked and visible to vendors.",
    icon: "🔍",
  },
  {
    title: "Fast Process",
    desc: "Digital applications and reviews cut approval times from weeks to days.",
    icon: "⚡",
  },
  {
    title: "Fair Allocation",
    desc: "Zone assignment follows clear rules and real-time occupancy data.",
    icon: "⚖️",
  },
  {
    title: "Easy Monitoring",
    desc: "Authorities get live dashboards for vendors, zones, and compliance.",
    icon: "📊",
  },
];

const features = [
  "Vendor Registration & Profile",
  "License Application & Approval",
  "Digital License Issuance",
  "License Renewal",
  "Zone Management",
  "Payment Management",
  "Complaint Management",
  "Notifications",
  "Inspection & Compliance",
];

const steps = [
  {
    step: "1",
    title: "Register & Apply",
    desc: "Create an account, verify your email, and apply for a vending license in minutes.",
  },
  {
    step: "2",
    title: "Get Reviewed",
    desc: "The authority reviews your documents, zone availability, and background.",
  },
  {
    step: "3",
    title: "Start Vending",
    desc: "Receive your digital license with QR code and start vending at your assigned zone.",
  },
];

export default function Home() {
  const [stats, setStats] = useState({
    vendors: "—",
    licenses: "—",
    zones: "—",
  });

  useEffect(() => {
    api
      .get("/api/public/zones")
      .then((res) => setStats((s) => ({ ...s, zones: res.data.length })))
      .catch(() => {});
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full bg-brand-100 px-4 py-1 text-sm font-semibold text-brand-700">
            Digital Governance for Street Vendors
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Streamlining Street Vending For A Better Tomorrow
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Banik connects street vendors and municipal authorities on one
            platform for license applications, zone allocation, payments, and
            complaint resolution.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white shadow hover:bg-brand-700"
            >
              Register as Vendor
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-slate-200 p-6 text-left shadow-sm"
            >
              <div className="text-3xl">{b.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-900">{b.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 text-center text-white sm:grid-cols-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-4xl font-bold">1,200+</p>
            <p className="mt-1 text-sm text-slate-300">Vendors Registered</p>
          </div>
          <div>
            <p className="text-4xl font-bold">850+</p>
            <p className="mt-1 text-sm text-slate-300">Licenses Issued</p>
          </div>
          <div>
            <p className="text-4xl font-bold">{stats.zones}</p>
            <p className="mt-1 text-sm text-slate-300">Active Zones</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900">
          Everything you need in one platform
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f}
              className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm"
            >
              {f}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            How It Works
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                  {s.step}
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
