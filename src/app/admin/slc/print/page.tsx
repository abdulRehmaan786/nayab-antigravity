"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PrintableSLC from "@/components/admin/PrintableSLC";
import { SchoolLeavingCertificateData } from "@/lib/types";
import { ArrowLeft, Printer, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

function PrintSLCContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const autoPrint = searchParams.get("autoprint") === "true";

  const [slc, setSlc] = useState<SchoolLeavingCertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No Certificate ID provided.");
      setLoading(false);
      return;
    }

    const fetchCertificate = async () => {
      try {
        const res = await fetch(`/api/slc?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!res.ok || !data.ok || !data.certificate) {
          throw new Error(data.error || "Certificate not found.");
        }
        setSlc(data.certificate);

        // If autoprint requested, trigger window.print() after a brief delay for image render
        if (autoPrint) {
          setTimeout(() => {
            window.print();
          }, 600);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load certificate.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [id, autoPrint]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-[#0D1B3D] animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading Certificate for Print...</p>
      </div>
    );
  }

  if (error || !slc) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm max-w-md w-full text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">Certificate Error</h2>
          <p className="text-xs text-slate-500">{error || "Certificate not found."}</p>
          <div className="pt-2">
            <Link
              href="/admin/slc"
              className="inline-flex items-center gap-2 bg-[#0D1B3D] text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to SLC Register</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 print:p-0 print:m-0 print:bg-white">
      <PrintableSLC slc={slc} onBack={() => router.push("/admin/slc")} />
    </div>
  );
}

export default function PrintSLCPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <Loader2 className="w-8 h-8 text-[#0D1B3D] animate-spin mb-3" />
          <p className="text-sm font-semibold text-slate-700">Preparing Print Document...</p>
        </div>
      }
    >
      <PrintSLCContent />
    </Suspense>
  );
}
