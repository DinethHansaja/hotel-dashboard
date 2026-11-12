"use client";

import BusinessDirectory, {
  type DirectoryBusiness,
} from "@/components/directory/BusinessDirectory";

type CafeDirectoryProps = {
  cafes: DirectoryBusiness[];
  initialArea?: string;
};

export default function CafeDirectory({
  cafes,
  initialArea,
}: CafeDirectoryProps) {
  return <BusinessDirectory businesses={cafes} kind="cafe" initialArea={initialArea} />;
}
