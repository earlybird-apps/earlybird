import clsx from "clsx";
import { HTMLProps } from "react";

import { Category } from "@db/types";

import { useAvailableFor } from "@/hooks/useAvailableFor";

import { Currency } from "./Currency";

function CategoryAvailable({ value }: { value: number }) {
  return (
    <Currency
      className={clsx(
        "font-extrabold text-end",
        value === 0 && "text-gray-600",
        value < 0 && "text-red-600 animate-pulse",
      )}
      value={value}
    />
  );
}

function CategoryName({
  name,
  available,
  className,
}: {
  name: string;
  available: number;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "font-medium",
        available === 0 && "text-gray-600",
        className,
      )}
    >
      {name}
    </span>
  );
}

function CategoryCard({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "border p-4 rounded-lg items-center gap-y-4 flex justify-between",
        className,
      )}
      {...props}
    />
  );
}

interface CategoryItemProps extends HTMLProps<HTMLDivElement> {
  category: Category;
  display: "now" | "later" | "total";
}

export function CategoryItem({
  category,
  display,
  ...props
}: CategoryItemProps) {
  const { now, later, total } = useAvailableFor(category);
  let available;
  switch (display) {
    case "now":
      available = now;
      break;
    case "later":
      available = later;
      break;
    case "total":
      available = total;
      break;
  }
  return (
    <CategoryCard {...props}>
      <CategoryName name={category.name} available={available} />
      <CategoryAvailable value={available} />
    </CategoryCard>
  );
}
