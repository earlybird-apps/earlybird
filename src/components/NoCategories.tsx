import { EmptyState } from "./EmptyState";

export function NoCategories() {
  return (
    <EmptyState
      title="No categories"
      description="No categories found with money assigned. Try showing empty categories or creating a new category."
    />
  );
}
