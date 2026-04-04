import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  HelpCircle,
  ScanLine,
  ShieldAlert,
  GitCompareArrows,
  List,
  Lock,
  Trash2,
  ChevronRight,
} from "lucide-react";

const faqTopics = [
  {
    icon: ScanLine,
    title: "How to Scan Products",
    description: "Learn how to scan food labels and get ingredient analysis",
  },
  {
    icon: ShieldAlert,
    title: "Understanding Risk Levels",
    description: "What SAFE, CAUTION, and AVOID mean for your health",
  },
  {
    icon: GitCompareArrows,
    title: "Comparing Products",
    description: "How to compare two products and find the healthier option",
  },
  {
    icon: List,
    title: "Reading Ingredients",
    description: "Understanding ingredient details and status badges",
  },
  {
    icon: Lock,
    title: "Privacy & Data",
    description: "How your data is collected, used, and protected",
  },
  {
    icon: Trash2,
    title: "Deleting Your Account",
    description: "How to permanently delete your account and data",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--nt-border)] px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link href="/" className="text-[var(--text-title)] hover:opacity-70 transition-opacity">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-title)]">Support</h1>
            <p className="text-xs text-[var(--text-subtitle)]">Get help with NutriTrace</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Contact Card */}
        <div className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-2xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <HelpCircle size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-1">Need Help?</h2>
              <p className="text-white/80 text-sm mb-4">
                We&apos;re here to help you get the most out of NutriTrace. Browse our FAQ topics below or contact us directly.
              </p>
              <a
                href="mailto:nutritrace.info@gmail.com"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors rounded-lg px-4 py-2 text-sm font-medium"
              >
                <Mail size={16} />
                nutritrace.info@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Topics */}
        <div>
          <h2 className="text-base font-bold text-[var(--text-title)] mb-3">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {faqTopics.map((topic) => (
              <div
                key={topic.title}
                className="bg-white rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
                  <topic.icon size={20} className="text-[var(--nt-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--text-title)]">{topic.title}</h3>
                  <p className="text-xs text-[var(--text-subtitle)] mt-0.5">{topic.description}</p>
                </div>
                <ChevronRight size={16} className="text-[var(--text-subtitle)] flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[var(--text-title)] mb-2">Additional Resources</h2>
          <div className="space-y-2 text-sm">
            <p className="text-[var(--text-body)]">
              For detailed information about how we handle your data, visit our{" "}
              <Link href="/privacy-policy" className="text-[var(--nt-primary)] font-medium hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="text-[var(--text-body)]">
              Review the{" "}
              <Link href="/terms-of-service" className="text-[var(--nt-primary)] font-medium hover:underline">
                Terms of Service
              </Link>{" "}
              for usage guidelines.
            </p>
            <p className="text-[var(--text-body)]">
              To permanently remove your account, visit the{" "}
              <Link href="/delete-account" className="text-[var(--nt-primary)] font-medium hover:underline">
                Delete Account
              </Link>{" "}
              page.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center pt-2 pb-8">
          <Link href="/" className="text-sm text-[var(--nt-primary)] font-medium hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
