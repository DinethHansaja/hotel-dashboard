"use client";

import BusinessDirectory, {
  type DirectoryBusiness,
} from "@/components/directory/BusinessDirectory";

type RestaurantDirectoryProps = {
  restaurants: DirectoryBusiness[];
  initialArea?: string;
};

export default function RestaurantDirectory({
  restaurants,
  initialArea,
}: RestaurantDirectoryProps) {
  return (
    <BusinessDirectory
      businesses={restaurants}
      kind="restaurant"
      initialArea={initialArea}
    />
  );
}
