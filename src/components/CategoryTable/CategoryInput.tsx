import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ComponentProps, useEffect, useRef, useState } from "react";

import { Currency } from "../Currency";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface BaseCategoryInputProps extends ComponentProps<typeof Input> {
  onSave: (value: string | number | undefined) => void;
}

interface CurrencyInputProps extends BaseCategoryInputProps {
  value: number;
  currency: true;
}

interface NonCurrencyInputProps extends BaseCategoryInputProps {
  value: string | number;
  currency?: false;
}

type CategoryInputProps = CurrencyInputProps | NonCurrencyInputProps;

export const CategoryInput = function CategoryInput({
  value,
  onSave,
  currency = false,
  ...props
}: CategoryInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (showInput === true) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  const handleSave = () => {
    setShowInput(false);
    onSave(inputValue);
  };

  const handleCancel = () => {
    setShowInput(false);
    setInputValue(value);
  };

  return showInput ? (
    <>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSave();
          } else if (e.key === "Escape") {
            handleCancel();
          }
        }}
        {...props}
      />
      <div>
        <Button plain onClick={() => handleCancel()}>
          <XMarkIcon className="h-2 w-2" />
        </Button>
        <Button
          plain
          onClick={() => {
            handleSave();
          }}
        >
          <CheckIcon className="h-2 w-2" />
        </Button>
      </div>
    </>
  ) : (
    <>
      {currency && typeof value === "number" ? (
        <Currency value={value} />
      ) : (
        <span>{value}</span>
      )}
      <Button
        plain
        onClick={() => setShowInput(true)}
        className="hidden group-hover:block"
      >
        <PencilIcon className="h-2 w-2" />
      </Button>
    </>
  );
};
