import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

import firebase, { authService, dbService } from "../firebase/initFirebase";
import { ContainedButton, TextButton } from "../components/styledButton";
import googleLogo from "../public/google_logo_2_littledeep.png";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import logobox from "../public/logo.png";
import Chip from "@mui/material/Chip";

function Login() {
  const router = useRouter();
  authService.onAuthStateChanged(async (user) => {
    if (user) {
      router.push(`/main`);
    }
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await authService.signInWithEmailAndPassword(email, password).then(() => {
        router.push("/main");
      });
    } catch (err) {
      if (
        err.message ===
        "Firebase: The email address is badly formatted. (auth/invalid-email)."
      ) {
        alert("이메일 형식이 올바르지 않습니다.");
      } else if (
        err.message ===
        "Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found)."
      ) {
        alert("가입되지 않은 계정입니다.");
      } else if (
        err.message ===
        "Firebase: The password is invalid or the user does not have a password. (auth/wrong-password)."
      ) {
        alert("잘못된 비밀번호입니다. 비밀번호를 확인해 주세요.");
      } else {
        alert(err.message);
      }
    }
  };

  const socialClick = async (event) => {
    event.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    await authService
      .signInWithPopup(provider)
      .then(() => {
        fetch(process.env.NEXT_PUBLIC_SLACK_CONFIG_SIGNUP, {
          method: "POST",
          body: JSON.stringify({ text: "로그인을 했습니다." }),
        });
      })
      .then(() => {
        router.push("/main");
      });
  };

  return (
    <>
      <Head>
        <title>Login | toGather</title>
      </Head>
      <div
        style={{
          padding: "1.5rem 0.5rem",
          position: "fixed",
          zIndex: 1,
          cursor: "pointer",
        }}
      >
        <Link href="/" passHref>
          <Image width="120px" height="35px" src={logobox} alt="logobox" />
        </Link>
      </div>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={socialClick}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "20rem",
            padding: "1rem",
            cursor: "pointer",
            backgroundColor: "#ffffff",
            border: "1.5px solid #e1e1e1",
            borderRadius: "10px",
            marginBottom: "1rem",
          }}
        >
          <Image width="18px" height="18px" src={googleLogo} alt="googleLogo" />
          <span style={{ fontSize: "1rem", marginLeft: "1rem" }}>
            Continue with Google
          </span>
        </button>
        <Box
          sx={{
            "& > :not(style)": { m: 1, width: "20rem" },
          }}
        >
          <Divider>
            <span style={{ color: "#AFAFAF" }}>or</span>
          </Divider>
        </Box>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "20rem" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TextField
            required
            name="email"
            id="outlined-basic"
            label="이메일"
            variant="outlined"
            value={email}
            onChange={onChange}
          />
          <TextField
            required
            name="password"
            type="password"
            id="outlined-basic"
            label="비밀번호"
            variant="outlined"
            value={password}
            onChange={onChange}
          />

          <ContainedButton
            style={{ padding: "0.5rem 0rem", fontSize: "130%" }}
            type="submit"
          >
            Login
          </ContainedButton>
        </Box>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "20rem",
            fontSize: "1rem",
            marginTop: "1rem",
          }}
        >
          <span style={{ marginRight: "10px" }}>계정이 없으신가요?</span>
          <Link href="/signup" passHref>
            <a
              style={{
                color: "#FFB800",
                borderRadius: "0%",
                borderBottom: "0.5px solid",
              }}
            >
              회원가입하기
            </a>
          </Link>
        </div>
      </div>
    </>
  );
}
export default Login;
