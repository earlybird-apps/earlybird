import {
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/16/solid";
import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { HTMLProps } from "react";

import { Category } from "@db/types";

import { useAvailableFor } from "@/hooks/useAvailableFor";

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
  display: "now" | "later" | "total";
  disableActions?: boolean;
}

export function CategoryItem({
  category,
  display,
  disableActions = false,
  ...props
}: CategoryItemProps) {
  const navigate = useNavigate();
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
      <div className="flex gap-x-2 items-center">
        <CategoryAvailable value={available} />
        {!disableActions && (
          <Dropdown>
            <DropdownButton plain>
              <EllipsisVerticalIcon />
            </DropdownButton>
            <DropdownMenu anchor="bottom end">
              <DropdownItem
                onClick={() => {
                  if (display === "total") return;
                  navigate({
                    search: {
                      showAddMoney: true,
                      categoryId: category.id,
                      view: display,
                    },
                  });
                }}
              >
                <ArrowDownTrayIcon />
                <DropdownLabel>Add Money</DropdownLabel>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </div>
    </CategoryCard>
  );
}

export function CategoryItemList(props: {
  categories: Category[];
  display: "now" | "later" | "total";
  disableActions?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-y-2">
      {props.categories.map((category) => (
        <li key={category.id}>
          <CategoryItem
            category={category}
            display={props.display}
            disableActions={props.disableActions || false}
          />
        </li>
      ))}
    </ul>
  );
}
