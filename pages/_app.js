import "../styles/globals.css";
import React, { useEffect } from "react";
import * as gtag from "../lib/gtag";
import Head from "next/head";
import { useRouter } from "next/router";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <div style={{ backgroundColor: "#202023" }}>
      <Head>
        <title>toGather</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        maxWidth="xs"
        sx={{
          bgcolor: "white",
          height: "fit-content",
          minHeight: "100vh",
          paddingBottom: "3vh",
        }}
      >
        <Component {...pageProps} />
      </Container>
    </div>
  );
}

export default MyApp;
