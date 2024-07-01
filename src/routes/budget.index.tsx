import { createFileRoute } from "@tanstack/react-router";

import { CategoryItemList } from "@/components/CategoryItem";
import { NoCategories } from "@/components/NoCategories";
import { Divider } from "@/components/ui/divider";
import { useCategories } from "@/hooks/categories";
import { useBudgetSettings } from "@/hooks/useBudgetSettings";

export const Route = createFileRoute("/budget/")({
  component: BudgetNow,
});

function BudgetNow() {
  const { funded, underfunded, fetching, empty } = useCategories();
  const { showEmpty } = useBudgetSettings();

  if (fetching) return <div>Loading...</div>;

  return (
    <>
      <div className="flex justify-between text-gray-700 text-sm m-2">
        <span className="p-1">Category</span>
        <span className="p-1 me-14 lg:me-12">Available</span>
      </div>
      {funded.length > 0 || underfunded.length > 0 ? (
        <>
          <CategoryItemList categories={underfunded} />
          <CategoryItemList categories={funded} />
        </>
      ) : (
        <NoCategories />
      )}
      {showEmpty && (
        <>
          <Divider soft className="my-8" />
          <CategoryItemList categories={empty} />
        </>
      )}
    </>
  );
}
