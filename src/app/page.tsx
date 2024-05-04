import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import HomePage from "./homepage";
import { getMessages } from "@/utils/parsingUtils";

export default function App() {
  console.log(getMessages());
  return (
    <MantineProvider>
      <HomePage />
    </MantineProvider>
  );
}
