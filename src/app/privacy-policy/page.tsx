import Link from "next/link";
import { ArrowLeft, Lock, Eye, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--nt-border)] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-[var(--text-title)] hover:opacity-70 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-title)]">Privacy Policy</h1>
            <p className="text-xs text-[var(--text-subtitle)]">Last updated: Feb 21, 2026</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Key Privacy Points Card */}
        <div className="bg-[#ECFDF5] rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[var(--text-title)] mb-4">Key Privacy Points</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--nt-primary)] flex items-center justify-center flex-shrink-0">
                <Lock size={16} className="text-white" />
              </div>
              <p className="text-[13px] text-[#475569]">Your food scan history stays private.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--nt-primary)] flex items-center justify-center flex-shrink-0">
                <Eye size={16} className="text-white" />
              </div>
              <p className="text-[13px] text-[#475569]">Your health preferences are used only to improve recommendations.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--nt-primary)] flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={16} className="text-white" />
              </div>
              <p className="text-[13px] text-[#475569]">You can delete your data anytime.</p>
            </div>
          </div>
        </div>

        {/* Data Collection */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[var(--text-title)] mb-2">Data Collection</h2>
          <p className="text-[13px] text-[var(--text-body)] leading-relaxed whitespace-pre-line">
            {"Your app collects:\n\u2022 Name and email (account creation)\n\u2022 Food products you scan\n\u2022 Health preferences (diet goals, allergies)\n\u2022 App usage data"}
          </p>
        </div>

        {/* How We Use Your Data */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[var(--text-title)] mb-2">How We Use Your Data</h2>
          <p className="text-[13px] text-[var(--text-body)] leading-relaxed whitespace-pre-line">
            {"We use your data to:\n\u2022 analyze food ingredients\n\u2022 provide health risk scores\n\u2022 suggest safer product alternatives\n\u2022 personalize recommendations"}
          </p>
        </div>

        {/* Data Security */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[var(--text-title)] mb-2">Data Security</h2>
          <p className="text-[13px] text-[var(--text-body)] leading-relaxed">
            All user data is encrypted and stored securely using modern security practices.
          </p>
        </div>

        {/* Third-Party Services */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[var(--text-title)] mb-2">Third-Party Services</h2>
          <p className="text-[13px] text-[var(--text-body)] leading-relaxed whitespace-pre-line">
            {"We only use trusted third-party services for:\n\u2022 authentication services\n\u2022 analytics tools\n\u2022 AI ingredient analysis services"}
          </p>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[var(--text-title)] mb-2">Your Rights</h2>
          <p className="text-[13px] text-[var(--text-body)] leading-relaxed whitespace-pre-line">
            {"You can:\n\u2022 access your data\n\u2022 edit preferences\n\u2022 delete your account\n\u2022 remove scan history"}
          </p>
        </div>
      </main>
    </div>
  );
}
