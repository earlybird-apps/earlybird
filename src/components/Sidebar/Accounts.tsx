import { useAccounts } from "@/hooks/useAccounts";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { SidebarHeading, SidebarItem } from "../ui/sidebar";

export function Accounts() {
  const { results, fetching } = useAccounts();

  return (
    <>
      <SidebarHeading>
        <span className="flex justify-between">
          Accounts{" "}
          <ArrowPathIcon
            className={clsx(fetching ? "w-3 animate-spin" : "hidden")}
          />
        </span>
      </SidebarHeading>

      {Array.from(results || []).map(([id, account]) => (
        <SidebarItem key={id} href="/accounts">
          {account.name}
        </SidebarItem>
      ))}
    </>
  );
}
