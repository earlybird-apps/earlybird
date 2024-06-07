import { createContext, useContext, useState } from "react";
import { Budget } from "triplit/types";

type CurrentBudgetContextState =
  | {
      budget: Budget | undefined;
      setBudget: (budget: Budget) => void;
    }
  | Record<string, never>;

const CurrentBudgetContext = createContext<CurrentBudgetContextState>({});

function CurrentBudgetContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [budget, setBudget] = useState<Budget | undefined>(undefined);
  return (
    <CurrentBudgetContext.Provider
      value={{
        budget,
        setBudget,
      }}
    >
      {children}
    </CurrentBudgetContext.Provider>
  );
}

function useCurrentBudget() {
  const context = useContext(CurrentBudgetContext);
  if (context === undefined) {
    throw new Error(
      "useEntityContext must be used within an EntityContextProvider"
    );
  }
  return context;
}

export { CurrentBudgetContextProvider, useCurrentBudget };
