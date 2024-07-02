import { createFileRoute } from "@tanstack/react-router";

import { CategoryItemList } from "@/components/CategoryItem";
import { NoCategories } from "@/components/NoCategories";
import { useCategories } from "@/hooks/categories";

export const Route = createFileRoute("/budget/")({
  component: BudgetNow,
});

function BudgetNow() {
  const { all, fetching } = useCategories();

  if (fetching) return <div>Loading...</div>;

  return (
    <>
      <div className="flex justify-between text-gray-700 text-sm m-2">
        <span className="p-1">Category</span>
        <span className="p-1 me-14 lg:me-12">Available</span>
      </div>
      {all.length > 0 ? (
        <>
          <CategoryItemList categories={all} />
        </>
      ) : (
        <NoCategories />
      )}
    </>
  );
}
