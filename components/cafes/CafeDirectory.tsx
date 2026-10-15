"use client";

import BusinessDirectory, {
  type DirectoryBusiness,
} from "@/components/directory/BusinessDirectory";

type CafeDirectoryProps = {
  cafes: DirectoryBusiness[];
};

export default function CafeDirectory({
  cafes,
}: CafeDirectoryProps) {
  return <BusinessDirectory businesses={cafes} kind="cafe" />;
}