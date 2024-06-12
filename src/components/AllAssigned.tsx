import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export function AllAssigned() {
  return (
    <div className="p-4 text-xs text-gray-500 border rounded-xl flex gap-2">
      <CheckBadgeIcon className="w-4" />
      All dollars assigned
    </div>
  );
}
