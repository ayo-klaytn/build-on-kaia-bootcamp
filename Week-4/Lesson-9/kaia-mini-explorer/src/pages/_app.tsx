import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "@/components/Provider";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Navbar />
      <Component {...pageProps} />
    </Provider>
  );
}
