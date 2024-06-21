import { ChevronDownIcon, PlusIcon } from "@heroicons/react/16/solid";
import { FolderIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

import { useBudgets } from "@/hooks/useBudgets";
import { useCurrentBudget } from "@/hooks/useCurrentBudget";

import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "../ui/dropdown";
import { SidebarItem, SidebarLabel } from "../ui/sidebar";

export const Budgets = () => {
  const { results: budgets, fetching } = useBudgets();
  const { budget } = useCurrentBudget();
  return (
    <Dropdown>
      <DropdownButton
        as={SidebarItem}
        disabled={fetching}
        className={clsx("lg:mb-2.5", fetching && "animate-pulse cursor-wait")}
      >
        <FolderIcon />
        <SidebarLabel className={clsx(!budget && "text-gray-700")}>
          {/* TODO: Address Sidebar dependency? */}
          {fetching ? "Loading..." : budget?.name || "Select a Budget"}
        </SidebarLabel>
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
        {/* TODO: Display something when there are no options */}
        {budgets &&
          Array.from(budgets).map(([id, budget]) => (
            <DropdownItem key={id} href="/$budgetId" params={{ budgetId: id }}>
              <DropdownLabel>{budget.name}</DropdownLabel>
            </DropdownItem>
          ))}
        <DropdownDivider />
        <DropdownItem>
          {/* TODO: Make this do something */}
          <PlusIcon />
          <DropdownLabel>New Budget</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
