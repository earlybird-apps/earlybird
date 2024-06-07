import { ChevronDownIcon, PlusIcon } from "@heroicons/react/16/solid";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDivider,
} from "./ui/dropdown";
import { SidebarItem, SidebarLabel } from "./ui/sidebar";
import { useBudgets } from "@/hooks/useBudgets";
import clsx from "clsx";
import { FolderIcon } from "@heroicons/react/24/outline";

export const BudgetsDropdown = () => {
  const { results = [], fetching } = useBudgets();

  return (
    <Dropdown>
      <DropdownButton
        as={SidebarItem}
        // {/* TODO: Address Sidebar dependency? */}
        disabled={fetching}
        className={clsx("lg:mb-2.5", fetching && "animate-pulse cursor-wait")}
      >
        <FolderIcon />
        <SidebarLabel>
          {/* TODO: Address Sidebar dependency? */}
          {fetching ? "Loading..." : results?.values().next().value.name}
        </SidebarLabel>
        <ChevronDownIcon />
      </DropdownButton>
      <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
        {Array.from(results || []).map(([id, budget]) => (
          <DropdownItem key={id}>
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
