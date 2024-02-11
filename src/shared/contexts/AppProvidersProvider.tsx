import { MeasurementSystemProvider } from "./MeasurementSystem";
import { IsAuthenticatedProvider } from "./IsAuthenticated";

export default function AppProvidersProvider({ children }: { children: any }) {
  return (
    <MeasurementSystemProvider>
      <IsAuthenticatedProvider>{children}</IsAuthenticatedProvider>
    </MeasurementSystemProvider>
  );
}
