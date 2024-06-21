import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export function AllAssigned() {
  return (
    <div className="flex gap-2 text-xs text-gray-500">
      <CheckBadgeIcon className="w-4" />
      All dollars assigned
    </div>
  );
}
