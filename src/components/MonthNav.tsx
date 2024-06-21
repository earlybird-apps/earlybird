import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { Button } from "./ui/button";

export function MonthNav(props: {
  onSelect: (action: "previous" | "next" | "today") => void;
}) {
  return (
    <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
      <Button
        outline
        className="rounded-r-none border-r-0"
        onClick={() => props.onSelect("previous")}
      >
        <span className="sr-only">Previous week</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </Button>
      <Button
        outline
        className="rounded-l-none rounded-r-none border-x-0"
        onClick={() => props.onSelect("today")}
      >
        Today
      </Button>
      <Button
        outline
        className="rounded-l-none border-l-0"
        onClick={() => props.onSelect("next")}
      >
        <span className="sr-only">Next week</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
}
