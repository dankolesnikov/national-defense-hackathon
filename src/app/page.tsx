import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import HomePage from "./homepage";

export default function App() {
  return (
    <MantineProvider>
      <HomePage />
    </MantineProvider>
  );
}
