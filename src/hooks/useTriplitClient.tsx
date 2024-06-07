import { createContext, useContext } from "react";
import { client } from "../../triplit/client";

const TriplitContext = createContext({ client });

function TriplitContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <TriplitContext.Provider value={{ client }}>
      {children}
    </TriplitContext.Provider>
  );
}

function useTriplitClient() {
  const context = useContext(TriplitContext);
  if (context === undefined) {
    throw new Error(
      "useEntityContext must be used within an EntityContextProvider"
    );
  }
  return context;
}

export { TriplitContextProvider, useTriplitClient };
