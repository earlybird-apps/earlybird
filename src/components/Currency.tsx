import clsx from "clsx";

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function Currency(props: { value: number; className?: string }) {
  return (
    <span className={clsx("font-mono", props.className)}>
      {USDollar.format(props.value)}
    </span>
  );
}
