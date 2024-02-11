import { useContext, createContext } from "react";

import useLocalStorageState from "use-local-storage-state";

//type isAuthenticatedContextArg = [
//  true | false,
//  React.Dispatch<React.SetStateAction<true | false>>,
//];
const IsAuthenticatedContext = createContext<any | undefined>(undefined);

export function useIsAuthenticated() {
  return useContext(IsAuthenticatedContext);
}

export function IsAuthenticatedProvider({ children }: { children: any }) {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState<
    true | false
  >("isAuthenticated", { defaultValue: false });

  return (
    <IsAuthenticatedContext.Provider
      value={[isAuthenticated, setIsAuthenticated]}
    >
      {children}
    </IsAuthenticatedContext.Provider>
  );
}
