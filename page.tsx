import Link from "next/link";
import { Leaf, ScanLine, Shield, GitCompareArrows, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--nt-border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-[var(--nt-primary)] flex items-center justify-center">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-[var(--nt-accent)]">Nutri</span>
              <span className="text-[var(--cyan)]">Trace</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--safe-bg)] text-[var(--safe-text)] text-sm font-medium mb-6">
            <Heart size={14} />
            AI-Powered Food Safety
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-title)] leading-tight">
            Scan. Understand.{" "}
            <span className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
              Choose Better.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-subtitle)] mt-6 max-w-2xl mx-auto">
            NutriTrace uses AI to analyze food ingredients and give you personalized health risk scores based on your unique health profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link href="/register">
              <Button size="lg" className="bg-[var(--nt-primary)] hover:bg-[var(--primary-hover)] px-8">
                Start Free <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-[var(--bg-main)]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How NutriTrace Works</h2>
          <p className="text-[var(--text-subtitle)] text-center mb-12 max-w-xl mx-auto">
            Three simple steps to make healthier food choices
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ScanLine,
                title: "Scan Ingredients",
                desc: "Take a photo of any food label or upload an image. Our AI reads and extracts every ingredient.",
                step: "01",
              },
              {
                icon: Shield,
                title: "Get Risk Analysis",
                desc: "Each ingredient is scored as SAFE, CAUTION, or AVOID based on your health conditions and allergies.",
                step: "02",
              },
              {
                icon: GitCompareArrows,
                title: "Compare Products",
                desc: "Compare two products side-by-side and get AI recommendations for the healthier choice.",
                step: "03",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-[var(--nt-border)] hover:shadow-md transition-shadow"
              >
                <div className="text-xs font-bold text-[var(--nt-primary)] mb-4">{feature.step}</div>
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-light)] flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-[var(--nt-primary)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-subtitle)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalization */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Personalized for Your Health</h2>
          <p className="text-[var(--text-subtitle)] mb-8 max-w-xl mx-auto">
            NutriTrace tailors every analysis to your unique health profile
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Blood Sugar", "Cardiovascular", "Digestive", "Allergies"].map((condition) => (
              <div
                key={condition}
                className="px-4 py-3 rounded-xl bg-[var(--safe-bg)] border border-[var(--safe-border)] text-sm font-medium text-[var(--safe-text)]"
              >
                {condition}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)]">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to eat smarter?</h2>
          <p className="text-white/80 mb-8">
            Join NutriTrace and start making informed food choices today.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-[var(--nt-primary)] hover:bg-white/90 px-8">
              Create Free Account <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[var(--text-title)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Leaf size={20} className="text-[var(--nt-accent)]" />
                <span className="text-lg font-bold text-white">
                  <span className="text-[var(--nt-accent)]">Nutri</span>
                  <span className="text-[var(--cyan)]">Trace</span>
                </span>
              </div>
              <p className="text-sm text-gray-400">Purity. Safety. Trust.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/delete-account" className="hover:text-white transition-colors">
                Delete Account
              </Link>
              <Link href="/support" className="hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} NutriTrace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
