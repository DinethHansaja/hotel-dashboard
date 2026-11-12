"use client";

import dynamic from "next/dynamic";
import type { DirectoryBusiness } from "@/components/directory/BusinessDirectory";

const BusinessMapClient = dynamic(
  () => import("@/components/directory/BusinessMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[380px] w-full items-center justify-center rounded-2xl bg-slate-100 lg:h-[560px]">
        <span className="text-sm text-slate-500">Loading map...</span>
      </div>
    ),
  }
);

export default function BusinessMap({
  businesses,
  kind,
  selectedBusinessId,
  onSelectBusiness,
}: {
  businesses: DirectoryBusiness[];
  kind: "cafe" | "restaurant";
  selectedBusinessId?: string | null;
  onSelectBusiness?: (id: string) => void;
}) {
  return (
    <div className="h-[380px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white surface-card p-2 shadow-sm lg:h-[560px]">
      <div className="h-full w-full overflow-hidden rounded-[18px]">
        <BusinessMapClient businesses={businesses} kind={kind} selectedBusinessId={selectedBusinessId} onSelectBusiness={onSelectBusiness} />
      </div>
    </div>
  );
}
