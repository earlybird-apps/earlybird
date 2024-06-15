import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { forwardRef, useEffect, useRef, useState } from "react";
import { client } from "@db/client";

type CategoryInputProps = {
  value?: string;
  setValue(value: string): void;
  onCancel(): void;
  onSave(): void;
};
const CategoryInput = forwardRef<HTMLInputElement, CategoryInputProps>(
  function CategoryInput(props, ref) {
    return (
      <>
        <Input
          ref={ref}
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              props.onSave();
            } else if (e.key === "Escape") {
              props.onCancel();
            }
          }}
        />
        <div>
          <Button plain onClick={() => props.onCancel()}>
            <XMarkIcon className="w-2 h-2" />
          </Button>
          <Button plain onClick={() => props.onSave()}>
            <CheckIcon className="w-2 h-2" />
          </Button>
        </div>
      </>
    );
  }
);

export function CategoryNameInput({
  categoryName,
  categoryId,
}: {
  categoryName: string;
  categoryId: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState<string>(categoryName);
  //   TODO: Save on enter & cancel on escape
  useEffect(() => {
    if (showInput === true) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  return (
    <div className="gap-x-2 flex items-center min-h-10 justify-between">
      {!showInput && (
        <>
          <span>{categoryName}</span>
          <Button plain onClick={() => setShowInput(true)}>
            <PencilIcon className="w-2 h-2 group-hover:block hidden" />
          </Button>
        </>
      )}
      {showInput && (
        <CategoryInput
          ref={inputRef}
          value={inputValue}
          setValue={setInputValue}
          onCancel={() => {
            setInputValue(categoryName);
            setShowInput(false);
          }}
          onSave={() => {
            setShowInput(false);
            if (inputValue !== categoryName) {
              client.update("categories", categoryId, async (category) => {
                category.name = inputValue;
              });
            }
          }}
        />
      )}
    </div>
  );
}
