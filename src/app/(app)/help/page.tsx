"use client";

import { HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const helpSections = [
  {
    title: "How to Scan a Product",
    content:
      "1. Tap the green scan button at the bottom center of your screen.\n2. Point your camera at the ingredients list on the packaging.\n3. Keep the text steady and within the frame.\n4. NutriTrace will automatically extract and analyze the ingredients.",
  },
  {
    title: "How Risk Score Works",
    content:
      "The Safety Score (0-100) is calculated based on:\n\u2022 Harmful additives and preservatives\n\u2022 High sugar, sodium, or unhealthy fat content\n\u2022 Potential allergens based on your profile\n\nA score of 70-100 means the product is safe to consume, 40-69 is moderate (consume with caution), and 0-39 is high risk (avoid if possible). The higher the score, the safer the product is for you.",
  },
  {
    title: "How Compare Works",
    content:
      "To compare products:\n1. Go to the Compare tab.\n2. Tap the plus icon on 'Product A' to scan the first item.\n3. Tap 'Product B' to scan the second item.\n4. NutriTrace will analyze both side-by-side and tell you which is the healthier option.",
  },
  {
    title: "Understanding Ingredients",
    content:
      "NutriTrace reads the ingredient list and detects harmful or suspicious items. You can tap on any individual ingredient in the Analysis Report to get a detailed explanation of what it is and why it might be harmful in simple terms.",
  },
  {
    title: "Data Privacy",
    content:
      "NutriTrace does not sell your personal data. Your scan history is private by default and used only to keep a log of your products. You can view our full Privacy Policy in settings.",
  },
  {
    title: "How to Delete Account",
    content:
      "If you wish to delete your account and all associated data, go to the Profile tab, scroll downwards, and tap the 'DELETE ACCOUNT' button at the bottom of the page. This action is irreversible.",
  },
];

export default function HelpPage() {
  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto space-y-5">
      <PageHeader
        title="Help & App Guide"
        subtitle="Learn how to use NutriTrace"
        showBack
      />

      {/* ── Welcome Card ── */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "linear-gradient(135deg, #00C4B4, #00D4A0)" }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <HelpCircle size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">
            Welcome to NutriTrace!
          </h2>
          <p className="text-sm text-white/90 mt-2 max-w-sm">
            Your AI-powered companion for making healthier food choices. Tap any
            section below to learn more.
          </p>
        </div>
      </div>

      {/* ── Expandable Sections ── */}
      <Accordion>
        {helpSections.map((section, index) => (
          <AccordionItem
            key={index}
            className="bg-white rounded-xl shadow-sm border border-[var(--nt-border)] mb-3 overflow-hidden not-last:border-b-0"
          >
            <AccordionTrigger className="px-4 py-3.5 text-sm font-semibold text-[var(--text-title)] hover:no-underline">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-[var(--text-body)] whitespace-pre-line leading-relaxed">
                {section.content}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
