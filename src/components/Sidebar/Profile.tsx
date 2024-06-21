import { ChevronUpIcon } from "@heroicons/react/16/solid";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";

import { Avatar } from "../ui/avatar";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "../ui/dropdown";
import { SidebarItem } from "../ui/sidebar";

export function Profile() {
  return (
    <Dropdown>
      <DropdownButton as={SidebarItem}>
        <Avatar initials="N" />
        Nick
        {/* TODO: Use logged in user */}
        <ChevronUpIcon />
      </DropdownButton>
      <DropdownMenu className="min-w-64" anchor="top start">
        <DropdownItem href="/">
          {/* TODO: Enable Logout */}
          <ArrowRightEndOnRectangleIcon />
          <DropdownLabel>Logout</DropdownLabel>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
