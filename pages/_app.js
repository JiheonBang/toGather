import "../styles/globals.css";
import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

function MyApp({ Component, pageProps }) {
  return (
    <div style={{ backgroundColor: "#202023" }}>
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
