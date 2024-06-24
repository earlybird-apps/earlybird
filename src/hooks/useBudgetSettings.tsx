import { useLocalStorage } from "@uidotdev/usehooks";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

type BudgetSettingsContext = {
  showEmpty: boolean;
  setShowEmpty: Dispatch<SetStateAction<boolean>> | undefined;
};

const BudgetSettings = createContext<BudgetSettingsContext>({
  showEmpty: false,
  setShowEmpty: undefined,
});

function BudgetSettingsProvider({ children }: { children: React.ReactNode }) {
  const [showEmpty, setShowEmpty] = useLocalStorage("showEmpty", false);
  return (
    <BudgetSettings.Provider value={{ showEmpty, setShowEmpty }}>
      {children}
    </BudgetSettings.Provider>
  );
}

function useBudgetSettings() {
  const context = useContext(BudgetSettings);
  if (context === undefined) {
    throw new Error(
      "useBudgetSettings must be used within a BudgetSettingsProvider",
    );
  }
  return context;
}

export { BudgetSettingsProvider, useBudgetSettings };
