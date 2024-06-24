import clsx from "clsx";

export function ProgressBar({
  progress,
  bgDestructive = false,
}: {
  progress: number;
  bgDestructive?: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-full w-full h-2",
        bgDestructive ? "bg-red-200/80" : "bg-gray-200",
      )}
    >
      <div
        className={clsx(
          "h-2 rounded-full bg-emerald-600",
          progress < 0 && "rounded-e-none",
        )}
        style={{
          width: `${progress > 100 ? 100 : progress}%`,
        }}
      />
    </div>
  );
}
