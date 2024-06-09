import { PlusIcon } from "@heroicons/react/20/solid";
import { SquaresPlusIcon } from "@heroicons/react/24/outline";

export function EmptyCategories() {
  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-50 border p-6 lg:p-10">
      <SquaresPlusIcon className="w-10 h-10" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        No categories
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new budget category.
      </p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          New Category
        </button>
      </div>
    </div>
  );
}
