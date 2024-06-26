import { useMemo } from "react";

import { useAccounts } from "./useAccounts";
import { useCategoriesV2 } from "./useCategoriesV2";

export function useReadyToBudget() {
  const { results: accounts, fetching: fetchingAccounts } = useAccounts();
  const { results: categories, fetching: fetchingCategories } =
    useCategoriesV2();

  const result = useMemo(() => {
    if (!accounts || !categories) return;
    const accountsTotalBalance = Array.from(accounts.values()).reduce(
      (acc, account) => acc + account.balance,
      0,
    );
    const categoriesTotalAssigned = Array.from(categories.values()).reduce(
      (acc, category) => acc + category.for_now + category.for_later,
      0,
    );

    return accountsTotalBalance - categoriesTotalAssigned;
  }, [accounts, categories]);

  return {
    result,
    fetching: fetchingAccounts || fetchingCategories,
  };
}
