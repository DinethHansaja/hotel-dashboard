"use client";

import BusinessDirectory, {
  type DirectoryBusiness,
} from "@/components/directory/BusinessDirectory";

type RestaurantDirectoryProps = {
  restaurants: DirectoryBusiness[];
  initialArea?: string;
  initialSearch?: string;
};

export default function RestaurantDirectory({
  restaurants,
  initialArea,
  initialSearch,
}: RestaurantDirectoryProps) {
  return (
    <BusinessDirectory
      businesses={restaurants}
      kind="restaurant"
      initialArea={initialArea}
      initialSearch={initialSearch}
    />
  );
}
