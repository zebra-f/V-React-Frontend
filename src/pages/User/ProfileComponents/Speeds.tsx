interface props {
  measurementSystem: "metric" | "imperial";
}
export default function Speeds({ measurementSystem }: props) {
  return (
    <>
      <h1>Speeds Placeholder {measurementSystem}</h1>
    </>
  );
}
