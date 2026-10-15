"use client";

import BusinessDirectory, {
  type DirectoryBusiness,
} from "@/components/directory/BusinessDirectory";

type RestaurantDirectoryProps = {
  restaurants: DirectoryBusiness[];
};

export default function RestaurantDirectory({
  restaurants,
}: RestaurantDirectoryProps) {
  return (
    <BusinessDirectory
      businesses={restaurants}
      kind="restaurant"
    />
  );
}