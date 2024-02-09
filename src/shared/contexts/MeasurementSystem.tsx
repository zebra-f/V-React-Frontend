import { useContext, createContext } from "react";

import useLocalStorageState from "use-local-storage-state";

// type measurementSystemContextArg = [
//   "metric" | "imperial",
//   React.Dispatch<React.SetStateAction<"metric" | "imperial">>,
// ];
const MeasurementSystemContext = createContext<any | undefined>(undefined);

export function useMeasurementSystem() {
  return useContext(MeasurementSystemContext);
}

export function MeasurementSystemProvider({ children }: { children: any }) {
  const [measurementSystem, setMeasurementSystem] = useLocalStorageState<
    "metric" | "imperial"
  >("measurementSystem", {
    defaultValue: "metric",
  });

  return (
    <MeasurementSystemContext.Provider
      value={[measurementSystem, setMeasurementSystem]}
    >
      {children}
    </MeasurementSystemContext.Provider>
  );
}
