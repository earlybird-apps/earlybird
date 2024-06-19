import clsx from "clsx";
import { Currency } from "./Currency";
import { Subheading } from "./ui/heading";

export function ReadyToAssign({ value }: { value: number }) {
  const styles = {
    positive: "bg-emerald-100 border border-emerald-200",
    negative: "bg-red-100 border border-red-200",
  };

  return (
    <div
      className={clsx(
        "flex justify-between rounded-lg p-3 font-medium ",
        value > 0 && styles["positive"],
        value < 0 && styles["negative"]
      )}
    >
      <Subheading>Available to Assign</Subheading>
      <Currency value={value} />
    </div>
  );
}
