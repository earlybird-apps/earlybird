import { Button } from "./ui/button";
import { PlusIcon } from "@heroicons/react/20/solid";
import { SquaresPlusIcon } from "@heroicons/react/24/outline";
import { Subheading } from "./ui/heading";
import { Text } from "./ui/text";

export function EmptyState(props: {
  title: string;
  description: string;
  buttonText: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-gray-50 border p-6 lg:p-10">
      <SquaresPlusIcon className="w-10 h-10" />
      <Subheading>{props.title}</Subheading>
      <Text>{props.description}</Text>
      <div className="mt-6">
        <Button color="indigo">
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          {props.buttonText}
        </Button>
      </div>
    </div>
  );
}
