"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Spline,
  FlaskConical,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useScanDetail, useUpdateScan } from "@/hooks/use-scan";
import { getScoreColor, getIngredientStatusColor } from "@/lib/risk-helpers";
import { getImageUrl } from "@/lib/config";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Ingredient, ScanResult } from "@/types";

// ─── Ingredient status badge ─────────────────────────────────────────
function StatusBadge({ status }: { status: Ingredient["status"] }) {
  const colors = getIngredientStatusColor(status);
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold rounded-full border"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {status}
    </span>
  );
}

// ─── Stat card component ─────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-[var(--nt-border)] p-3 flex flex-col items-center gap-1.5">
      <div className="w-9 h-9 rounded-xl bg-[var(--bg-light-green)] flex items-center justify-center">
        {icon}
      </div>
      <span className="text-lg font-bold text-[var(--text-title)]">
        {value}
      </span>
      <span className="text-[11px] text-[var(--text-subtitle)] text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── Image preview dialog ────────────────────────────────────────────
function ImagePreviewDialog({
  open,
  onOpenChange,
  imagePath,
  productName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imagePath: string;
  productName: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg p-0 overflow-hidden bg-black"
        showCloseButton={false}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <img
          src={getImageUrl(imagePath)}
          alt={productName}
          className="w-full h-auto max-h-[80vh] object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit name dialog ────────────────────────────────────────────────
function EditNameDialog({
  open,
  onOpenChange,
  currentName,
  scanId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  scanId: number;
  onSuccess: (newName: string) => void;
}) {
  const [name, setName] = useState(currentName);
  const updateMutation = useUpdateScan();

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      await updateMutation.mutateAsync({
        scanId,
        data: { product_name: name.trim() },
      });
      onSuccess(name.trim());
      onOpenChange(false);
      toast.success("Product name updated");
    } catch {
      toast.error("Failed to update product name");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product Name</DialogTitle>
        </DialogHeader>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          className="h-10"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || !name.trim()}
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Overview tab ────────────────────────────────────────────────────
function OverviewTab({ scan }: { scan: ScanResult }) {
  const { risk_breakdown } = scan;

  return (
    <div className="space-y-4">
      {scan.overview && (
        <p className="text-sm text-[var(--text-body)] leading-relaxed">
          {scan.overview}
        </p>
      )}

      {/* Risk breakdown */}
      {risk_breakdown && (
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: "var(--high-risk)" }}
            />
            <span className="font-semibold text-[var(--high-risk-text)]">
              {risk_breakdown.avoid_count}
            </span>
            <span className="text-[var(--text-subtitle)]">Avoid</span>
          </span>
          <span className="text-[var(--text-subtitle)]">&bull;</span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: "var(--moderate)" }}
            />
            <span className="font-semibold text-[var(--moderate-text)]">
              {risk_breakdown.caution_count}
            </span>
            <span className="text-[var(--text-subtitle)]">Caution</span>
          </span>
          <span className="text-[var(--text-subtitle)]">&bull;</span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: "var(--safe)" }}
            />
            <span className="font-semibold text-[var(--safe-text)]">
              {risk_breakdown.safe_count}
            </span>
            <span className="text-[var(--text-subtitle)]">Safe</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Ingredients tab ─────────────────────────────────────────────────
function IngredientsTab({ ingredients }: { ingredients: Ingredient[] }) {
  if (!ingredients || ingredients.length === 0) {
    return (
      <p className="text-sm text-[var(--text-subtitle)] py-4">
        No ingredients data available.
      </p>
    );
  }

  return (
    <Accordion>
      {ingredients.map((ingredient, index) => (
        <AccordionItem key={index} value={`ingredient-${index}`}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm font-medium text-[var(--text-title)] truncate">
                {ingredient.ingredient_name}
              </span>
              <StatusBadge status={ingredient.status} />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-[var(--text-body)] pl-0.5">
              {ingredient.reason}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// ─── Guidance tab ────────────────────────────────────────────────────
function GuidanceTab({ guidance }: { guidance: string[] }) {
  if (!guidance || guidance.length === 0) {
    return (
      <p className="text-sm text-[var(--text-subtitle)] py-4">
        No guidance available.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {guidance.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span
            className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0"
            style={{ backgroundColor: "var(--nt-primary)" }}
          />
          <span className="text-sm text-[var(--text-body)] leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

// ─── Loading Skeleton ────────────────────────────────────────────────
function ResultSkeleton() {
  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 bg-gray-200 rounded-lg" />
          <div className="h-4 w-32 bg-gray-200 rounded-lg" />
        </div>
      </div>
      <div className="h-24 rounded-2xl bg-gray-200" />
      <div className="grid grid-cols-3 gap-3">
        <div className="h-28 rounded-2xl bg-gray-200" />
        <div className="h-28 rounded-2xl bg-gray-200" />
        <div className="h-28 rounded-2xl bg-gray-200" />
      </div>
      <div className="h-10 rounded-lg bg-gray-200" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function ScanResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const scanId = parseInt(id, 10);

  const { data, isLoading, error } = useScanDetail(
    isNaN(scanId) ? null : scanId
  );

  const [editOpen, setEditOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  if (isLoading) {
    return <ResultSkeleton />;
  }

  if (error || !data?.scan) {
    return (
      <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-[var(--text-subtitle)] mb-4">
            {error ? "Failed to load scan result." : "Scan not found."}
          </p>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const scan = data.scan;
  const scoreColors = getScoreColor(scan.score);
  const productName = displayName || scan.product_name;

  return (
    <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl mx-auto space-y-5">
      {/* ── Header ── */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[var(--text-title)]" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[var(--text-title)] truncate">
              {productName}
            </h1>
            <button
              onClick={() => setEditOpen(true)}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4 text-[var(--text-subtitle)]" />
            </button>
          </div>
          {scan.brand_name && (
            <p className="text-sm text-[var(--text-subtitle)] mt-0.5">
              {scan.brand_name}
            </p>
          )}
        </div>
      </div>

      {/* ── Score + Image Row ── */}
      <div className="flex items-center gap-4">
        {/* Score badge */}
        <div
          className="flex items-center justify-center rounded-2xl px-5 py-3"
          style={{ backgroundColor: `${scoreColors.primary}15` }}
        >
          <span
            className="text-3xl font-bold"
            style={{ color: scoreColors.primary }}
          >
            {scan.score}
          </span>
          <span
            className="text-sm font-medium ml-1 mt-1"
            style={{ color: scoreColors.dark }}
          >
            /100
          </span>
        </div>

        {/* Image thumbnail */}
        {scan.image_path && (
          <button
            onClick={() => setImagePreviewOpen(true)}
            className="w-[60px] h-[80px] rounded-xl overflow-hidden border border-[var(--nt-border)] flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <img
              src={getImageUrl(scan.image_path)}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </button>
        )}
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-3">
        <StatCard
          icon={<Spline className="w-5 h-5 text-[var(--nt-primary)]" />}
          label="Sugar Estimate"
          value={scan.sugar_estimate || "N/A"}
        />
        <StatCard
          icon={
            <FlaskConical className="w-5 h-5 text-[var(--nt-primary)]" />
          }
          label="Additives"
          value={scan.additives_count ?? 0}
        />
        <StatCard
          icon={
            <AlertTriangle className="w-5 h-5 text-[var(--nt-primary)]" />
          }
          label="Allergens"
          value={scan.allergens_found?.length ?? 0}
        />
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">
            Overview
          </TabsTrigger>
          <TabsTrigger value="ingredients" className="flex-1">
            Ingredients
          </TabsTrigger>
          <TabsTrigger value="guidance" className="flex-1">
            Guidance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab scan={scan} />
        </TabsContent>

        <TabsContent value="ingredients" className="mt-4">
          <IngredientsTab ingredients={scan.ingredients} />
        </TabsContent>

        <TabsContent value="guidance" className="mt-4">
          <GuidanceTab guidance={scan.guidance} />
        </TabsContent>
      </Tabs>

      {/* ── Save to History Button ── */}
      <button
        onClick={() => router.push("/history")}
        className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        style={{ backgroundColor: "var(--nt-primary)" }}
      >
        <CheckCircle2 className="w-5 h-5" />
        Save to History
      </button>

      {/* ── Dialogs ── */}
      <EditNameDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        currentName={productName}
        scanId={scanId}
        onSuccess={(newName) => setDisplayName(newName)}
      />

      {scan.image_path && (
        <ImagePreviewDialog
          open={imagePreviewOpen}
          onOpenChange={setImagePreviewOpen}
          imagePath={scan.image_path}
          productName={productName}
        />
      )}
    </div>
  );
}
