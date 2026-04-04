import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using NutriTrace, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.",
  },
  {
    title: "2. Use of Service",
    content:
      "NutriTrace provides AI-powered food ingredient analysis and health insights. Our recommendations are for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for medical decisions.",
  },
  {
    title: "3. User Account",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.",
  },
  {
    title: "4. Limitation of Liability",
    content:
      "NutriTrace is not liable for any health outcomes resulting from following our recommendations. Our analysis is based on publicly available data and AI models, which may contain inaccuracies. Users assume all risks associated with dietary changes.",
  },
  {
    title: "5. Intellectual Property",
    content:
      "All content, features, and functionality of NutriTrace are owned by NutriTrace Inc. and are protected by international copyright, trademark, and other intellectual property laws.",
  },
  {
    title: "6. Modifications to Service",
    content:
      "We reserve the right to modify or discontinue the service at any time without prior notice. We will not be liable if any part of the service is unavailable at any time.",
  },
  {
    title: "7. Termination",
    content:
      "We may terminate or suspend your account immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use the service will immediately cease.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--nt-border)] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-[var(--text-title)] hover:opacity-70 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-title)]">Terms of Service</h1>
            <p className="text-xs text-[var(--text-subtitle)]">Effective from Feb 1, 2026</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Agreed To Terms Card */}
        <div className="bg-[#ECFDF5] rounded-xl p-5 flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-[var(--nt-primary)] flex items-center justify-center flex-shrink-0">
            <Check size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-title)]">You Agreed to These Terms</h2>
            <p className="text-[11px] text-[#475569] mt-0.5">
              By using NutriTrace, you accept these terms of service
            </p>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-[var(--text-title)] mb-2">{section.title}</h2>
            <p className="text-[13px] text-[var(--text-body)] leading-relaxed">{section.content}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
