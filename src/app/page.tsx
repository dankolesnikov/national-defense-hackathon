import Image from "next/image";
import styles from "./page.module.css";
import "@mantine/core/styles.css";

import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import HomePage from "./homepage";

export default function App() {
  return (
    <MantineProvider>
      <HomePage />
    </MantineProvider>
  );
}
