import {
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import { HTMLProps, useMemo } from "react";

import { Category } from "@db/types";

import { Dialogs } from "@/constants";

import { Currency } from "./Currency";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "./ui/dropdown";

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
}

export function CategoryItem({ category, ...props }: CategoryItemProps) {
  const available = useMemo(
    () => category.assigned + category.activity,
    [category],
  );

  return (
    <CategoryCard {...props}>
      <CategoryName name={category.name} available={available} />
      <div className="flex gap-x-2 items-center">
        <CategoryAvailable value={available} />
        <Dropdown>
          <DropdownButton plain>
            <EllipsisVerticalIcon />
          </DropdownButton>
          <DropdownMenu anchor="bottom end">
            <DropdownItem
              href=""
              search={(prev) => ({
                ...prev,
                dialog: Dialogs.MoveMoney,
                id: category.id,
              })}
            >
              <ArrowDownTrayIcon />
              <DropdownLabel>Add Money</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </CategoryCard>
  );
}

export function CategoryItemList(props: { categories: Category[] }) {
  return (
    <ul className="flex flex-col gap-y-2">
      {props.categories.map((category) => (
        <li key={category.id}>
          <CategoryItem category={category} />
        </li>
      ))}
    </ul>
  );
}
