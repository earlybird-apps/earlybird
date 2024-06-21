import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { forwardRef, useEffect, useRef, useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
            <XMarkIcon className="h-2 w-2" />
          </Button>
          <Button plain onClick={() => props.onSave()}>
            <CheckIcon className="h-2 w-2" />
          </Button>
        </div>
      </>
    );
  },
);

export function CategoryAssignment({
  value,
  onSave,
}: {
  value: string;
  onSave: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState<string>(value);

  useEffect(() => {
    if (showInput === true) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  return (
    <div className="flex min-h-10 items-center justify-between gap-x-2">
      {!showInput && (
        <>
          <span>{value}</span>
          <Button plain onClick={() => setShowInput(true)}>
            <PencilIcon className="hidden h-2 w-2 group-hover:block" />
          </Button>
        </>
      )}
      {showInput && (
        <CategoryInput
          ref={inputRef}
          value={inputValue}
          setValue={setInputValue}
          onCancel={() => {
            setInputValue(value);
            setShowInput(false);
          }}
          onSave={() => {
            setShowInput(false);
            if (inputValue !== value) onSave(inputValue);
          }}
        />
      )}
    </div>
  );
}
