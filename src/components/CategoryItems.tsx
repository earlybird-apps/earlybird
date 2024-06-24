import {
  ArrowDownTrayIcon,
  ArrowPathRoundedSquareIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { format } from "date-fns";
import { HTMLProps, useMemo } from "react";

import { CategoryV2 } from "@db/types";

import { Currency } from "./Currency";
import { ProgressBar } from "./ProgressBar";
import { Button } from "./ui/button";

function Available({ value }: { value: number }) {
  return (
    <Currency
      className={clsx(
        "font-extrabold",
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
      className={clsx("border p-4 rounded-lg items-center gap-y-4", className)}
      {...props}
    />
  );
}

function ButtonGroup({ className, ...props }: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "border rounded-md divide-x divide-gray *:border-none *:rounded-none first:rounded-s-md last:rounded-e-md ",
        className,
      )}
      {...props}
    />
  );
}

export function NowCategoryItem({ category }: { category: CategoryV2 }) {
  const available = useMemo(
    () => category.for_now + category.activity,
    [category.activity, category.for_now],
  );
  return (
    <CategoryCard className="grid grid-cols-2 lg:grid-cols-4 ">
      <div className="col-span-1">
        <CategoryName name={category.name} available={available} />
      </div>
      <div className="col-span-1 text-end lg:text-start">
        <Available value={available} />
      </div>
      <div className="col-span-2 lg:col-span-1 flex gap-x-4 text-xs text-gray-700 justify-between">
        {category.for_now ? (
          <div className="flex flex-col w-full gap-y-2">
            <ProgressBar
              bgDestructive
              progress={
                100 - ((category.activity * -1) / category.for_now) * 100
              }
            />
            <div className="flex justify-between">
              <div className="flex gap-x-2">
                <Currency value={category.activity} />
                /
                <Currency className="ms-auto" value={category.for_now} />
              </div>
              <div className="text-center flex gap-2">
                <span>since</span>
                <span className="font-medium">
                  {format(category.last_reset, "M/dd/yy")}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <ButtonGroup className="hidden lg:col-span-1 lg:flex ms-auto">
        <Button outline disabled={available <= 0}>
          <span className="sr-only">Move Cash</span>
          <ArrowUpTrayIcon />
        </Button>
        <Button outline>
          <span className="sr-only">Add Cash</span>
          <ArrowDownTrayIcon />
        </Button>
        <Button outline>
          <ArrowPathRoundedSquareIcon />
        </Button>
      </ButtonGroup>
    </CategoryCard>
  );
}

export function LaterCategoryItem({ category }: { category: CategoryV2 }) {
  return (
    <CategoryCard className="grid grid-cols-2 lg:grid-cols-4">
      <div className="col-span-1">
        <CategoryName name={category.name} available={category.for_later} />
      </div>
      <div className="col-span-1 text-end lg:text-start">
        <Available value={category.for_later} />
      </div>
      <div className="col-span-2 lg:col-span-1 flex gap-x-4 text-xs text-gray-700 justify-between">
        {category.later_goal && (
          <div className="flex flex-col w-full gap-y-2">
            <ProgressBar
              progress={(category.for_later / category.later_goal) * 100}
            />
            <div className="flex justify-between">
              <span>Goal</span>
              <Currency className="ms-auto" value={category.later_goal} />
            </div>
          </div>
        )}
      </div>
      <ButtonGroup className="hidden lg:flex lg:col-span-1 ms-auto">
        <Button outline disabled={category.for_later <= 0}>
          <span className="sr-only">Move Cash</span>
          <ArrowUpTrayIcon />
        </Button>
        <Button outline>
          <span className="sr-only">Add Cash</span>
          <ArrowDownTrayIcon />
        </Button>
        <Button outline>
          <FlagIcon />
        </Button>
      </ButtonGroup>
    </CategoryCard>
  );
}

export function TotalCategoryItem({ category }: { category: CategoryV2 }) {
  const available = useMemo(
    () => category.for_later + category.for_now + category.activity,
    [category.activity, category.for_later, category.for_now],
  );
  return (
    <CategoryCard className="grid grid-cols-2 lg:grid-cols-5">
      <div className="col-span-1">
        <CategoryName name={category.name} available={available} />
      </div>
      <div className="col-span-1 text-end lg:text-start">
        <Available value={available} />
      </div>
      <div className="hidden lg:col-span-1 lg:flex gap-x-4">
        <Currency
          className="font-medium text-sm text-gray-700"
          value={category.for_now + category.activity}
        />
      </div>
      <div className="hidden lg:col-span-1 lg:flex gap-x-4">
        <Currency
          className="font-medium text-sm text-gray-700"
          value={category.for_later}
        />
      </div>
      <div className="col-span-2 lg:hidden flex gap-x-4 text-sm text-gray-700">
        <div className="text-center flex gap-2 lg:flex-col lg:capitalize">
          <Currency
            className="font-medium"
            value={category.for_now + category.activity}
          />
          <span>now</span>
        </div>
        <div className="text-center flex gap-2 lg:flex-col lg:capitalize">
          <Currency className="font-medium" value={category.for_later} />
          <span>later</span>
        </div>
      </div>
      <ButtonGroup className="hidden lg:flex col-span-1 ms-auto">
        <Button
          outline
          disabled={category.for_later === 0 && category.for_now === 0}
        >
          <span className="sr-only">Transfer Cash</span>
          <ArrowsRightLeftIcon />
        </Button>
        <Button outline disabled={available <= 0}>
          <span className="sr-only">Move Cash</span>
          <ArrowUpTrayIcon />
        </Button>
      </ButtonGroup>
    </CategoryCard>
  );
}
