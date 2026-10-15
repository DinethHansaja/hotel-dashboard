"use client";

import dynamic from "next/dynamic";
import type { DirectoryBusiness } from "@/components/directory/BusinessDirectory";

const BusinessMapClient = dynamic(
  () => import("@/components/directory/BusinessMapClient"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[440px] w-full items-center justify-center rounded-2xl bg-slate-100">
        <span className="text-sm text-slate-500">Loading map...</span>
      </div>
    ),
  }
);

export default function BusinessMap({
  businesses,
  kind,
}: {
  businesses: DirectoryBusiness[];
  kind: "cafe" | "restaurant";
}) {
  return (
    <div className="h-[440px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="h-full w-full overflow-hidden rounded-[18px]">
        <BusinessMapClient businesses={businesses} kind={kind} />
      </div>
    </div>
  );
}