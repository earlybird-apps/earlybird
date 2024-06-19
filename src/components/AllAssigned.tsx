import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export function AllAssigned() {
  return (
    <div className="text-xs text-gray-500 flex gap-2">
      <CheckBadgeIcon className="w-4" />
      All dollars assigned
    </div>
  );
}
