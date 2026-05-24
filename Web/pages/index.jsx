import Head from "next/head";
import { Landing } from "../components/Landing/Landing";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>AquaCore — акваріумний помічник</title>
        <meta
          name="description"
          content="AquaCore — платформа для моніторингу, планування, калькуляторів та догляду за акваріумами."
        />
      </Head>

      <Landing />
    </>
  );
}