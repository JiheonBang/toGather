import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import logobox from "../public/logo.png";
import { OutlinedButton, ContainedButton } from "./styledButton";
import { authService, dbService } from "../firebase/initFirebase";

export default function Navbar() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState();
  const [nickName, setNickName] = useState();
  const [userLink, setUserLink] = useState();

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    }
  });

  const getNickName = async () => {
    if (currentUser) {
      const userData = await dbService
        .collection("userInfo")
        .doc(currentUser.uid)
        .get();
      userData.exists
        ? (setNickName(userData.data().userNickName),
          setUserLink(userData.data().userLink))
        : setNickName("닉네임");
    }
  };

  useEffect(() => {
    getNickName();
  }, [currentUser]);

  return (
    <nav
      style={{
        maxWidth: "24rem",
        width: "93%",
        height: "60px",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        zIndex: 2,
        backgroundColor: "white",
      }}
    >
      <div style={{ cursor: "pointer", paddingTop: "1rem" }}>
        <Link href="/" passHref>
          <Image width="120px" height="35px" src={logobox} alt="logobox" />
        </Link>
      </div>
      {currentUser ? (
        <>
          <OutlinedButton
            onClick={() => {
              router.push(`/${userLink}`);
            }}
            sx={{ fontSize: "100%", borderRadius: "1rem" }}
          >
            {nickName}
          </OutlinedButton>
        </>
      ) : (
        <ContainedButton variant="contained" href="/signup">
          Sign Up
        </ContainedButton>
      )}
    </nav>
  );
}
