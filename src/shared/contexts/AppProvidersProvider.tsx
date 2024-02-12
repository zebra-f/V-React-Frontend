import { MeasurementSystemProvider } from "./MeasurementSystem";
import { IsAuthenticatedProvider } from "./IsAuthenticated";
import { VeesSpeedDataProvider } from "./VeesSpeedData";

export default function AppProvidersProvider({ children }: { children: any }) {
  return (
    <MeasurementSystemProvider>
      <IsAuthenticatedProvider>
        <VeesSpeedDataProvider>{children}</VeesSpeedDataProvider>
      </IsAuthenticatedProvider>
    </MeasurementSystemProvider>
  );
}
