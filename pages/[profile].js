import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import Navbar from "../components/navbar";
import { authService, dbService } from "../firebase/initFirebase";
import logobox from "../public/logo.png";
import { ContainedButton, OutlinedButton } from "../components/styledButton";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

function Profile({ givenLink }) {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState();
  const [canModify, setCanModify] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userId: "",
    userEmail: "",
    userName: "",
    userNickName: "",
    userGender: "",
    userBirth: "",
    userPhone: "",
    userBelong: "",
    userDescription: "",
    userInterest: "",
  });

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    }
  });

  useEffect(() => {
    dbService.collection("userInfo").onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        if (givenLink === doc.data().userLink) {
          setUserInfo(doc.data());
        }
        if (currentUser) {
          if (currentUser.uid === doc.data().userId) {
            setCanModify(true);
          }
        }
      });
    });
  }, [currentUser]);

  const onChangeText = (e) => {
    e.preventDefault();
    const { id, value } = e.currentTarget;
    setUserInfo({ ...userInfo, [id]: value });
  };

  const onChangeBirth = (newValue) => {
    setUserInfo({ ...userInfo, userBirth: newValue.toString().substr(3, 12) });
  };

  const onModifyClick = (e) => {
    e.preventDefault();
    if (userInfo.userName === "") {
      alert("????????? ????????? ?????????.");
    } else if (userInfo.userNickName === "") {
      alert("???????????? ????????? ?????????.");
    } else if (userInfo.userGender === "") {
      alert("????????? ????????? ?????????.");
    } else if (userInfo.userBirth === "") {
      alert("???????????? ????????? ?????????.");
    } else if (userInfo.userPhone === "") {
      alert("??????????????? ????????? ?????????.");
    } else if (userInfo.userBelong === "") {
      alert("????????? ????????? ?????????.");
    } else if (userInfo.userDescription === "") {
      alert("????????? ????????? ?????????.");
    } else if (userInfo.userInterest === "") {
      alert("???????????? ????????? ?????????.");
    } else {
      const ok = window.confirm("?????????????????????????");
      if (ok) {
        dbService
          .collection("userInfo")
          .doc(`${currentUser.uid}`)
          .update({
            userId: currentUser.uid,
            userEmail: currentUser.email,
            userName: userInfo.userName,
            userNickName: userInfo.userNickName,
            userGender: userInfo.userGender,
            userBirth: userInfo.userBirth,
            userPhone: userInfo.userPhone,
            userBelong: userInfo.userBelong,
            userDescription: userInfo.userDescription,
            userInterest: userInfo.userInterest,
          })
          .then(setIsModifying(!isModifying));
      }
    }
  };

  return (
    <>
      <Head>
        <title>Profile | toGather</title>
      </Head>
      <div
        style={{
          position: "fixed",
          zIndex: 3,
          cursor: "pointer",
          backgroundColor: "white",
          width: "93%",
          maxWidth: "24rem",
          padding: "1.5rem 0.5rem",
        }}
      >
        <Link href="/" passHref>
          <Image width="120px" height="35px" src={logobox} alt="logobox" />
        </Link>
      </div>
      <div style={{ paddingTop: "5rem" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1rem",
          }}
        >
          <h3>??? ?????????</h3>
          {canModify ? (
            isModifying ? (
              <ContainedButton
                style={{ fontSize: "100%" }}
                onClick={onModifyClick}
              >
                ????????????
              </ContainedButton>
            ) : (
              <ContainedButton
                style={{ fontSize: "100%" }}
                onClick={() => {
                  setIsModifying(!isModifying);
                }}
              >
                ????????????
              </ContainedButton>
            )
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "2.5rem 0 0 1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ marginRight: "3.5rem" }}>??????</span>
            <TextField
              required
              name="userName"
              id="userName"
              label="??????"
              variant="outlined"
              value={userInfo.userName}
              onChange={onChangeText}
              disabled={!isModifying}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ marginRight: "2.6rem" }}>?????????</span>
            <TextField
              required
              name="userNickName"
              id="userNickName"
              label="?????????"
              variant="outlined"
              value={userInfo.userNickName}
              onChange={onChangeText}
              disabled={!isModifying}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ marginRight: "3.5rem" }}>??????</span>

            <ToggleButtonGroup
              id="userGender"
              value={userInfo.userGender}
              exclusive
              onChange={onChangeText}
              disabled={!isModifying}
            >
              <ToggleButton id="userGender" value="male">
                ??????
              </ToggleButton>
              <ToggleButton id="userGender" value="female">
                ??????
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ marginRight: "2.6rem" }}>?????????</span>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year", "month"]}
                label="?????????"
                minDate={new Date("1950-01-01")}
                maxDate={new Date("2020-12-01")}
                value={userInfo.userBirth}
                onChange={(newValue) => onChangeBirth(newValue)}
                disabled={!isModifying}
                renderInput={(params) => (
                  <TextField {...params} helperText={null} />
                )}
              />
            </LocalizationProvider>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ marginRight: "1.7rem" }}>????????????</span>
            <TextField
              required
              type="number"
              name="userPhone"
              id="userPhone"
              label="????????????"
              variant="outlined"
              value={userInfo.userPhone}
              onChange={onChangeText}
              disabled={!isModifying}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ marginRight: "3.5rem" }}>??????</span>
            <TextField
              required
              type="text"
              name="userBelong"
              id="userBelong"
              label="??????"
              variant="outlined"
              value={userInfo.userBelong}
              onChange={onChangeText}
              disabled={!isModifying}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ marginRight: "1.7rem" }}>????????????</span>
            <TextField
              required
              multiline
              rows={6}
              name="userDescription"
              id="userDescription"
              label="????????????"
              variant="outlined"
              value={userInfo.userDescription}
              onChange={onChangeText}
              disabled={!isModifying}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ marginRight: "2.5rem" }}>?????????</span>
            <TextField
              required
              multiline
              rows={6}
              name="userInterest"
              id="userInterest"
              label="?????????"
              variant="outlined"
              value={userInfo.userInterest}
              onChange={onChangeText}
              disabled={!isModifying}
            />
          </div>
        </div>
        {canModify ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <OutlinedButton
              style={{
                borderRadius: "1rem",
                maxWidth: "24rem",
                width: "90%",
                zIndex: "2",
                border: "1px solid #afafaf",
                color: "#afafaf",
                fontSize: "100%",
                marginBottom: "1rem",
              }}
              onClick={() => {
                authService.signOut().then(() => router.push("/"));
              }}
            >
              ????????????
            </OutlinedButton>
          </div>
        ) : null}
      </div>
    </>
  );
}
export default Profile;

export async function getServerSideProps(context) {
  const givenLink = context.params.profile;

  return {
    props: {
      key: givenLink,
      givenLink: givenLink,
    },
  };
}
