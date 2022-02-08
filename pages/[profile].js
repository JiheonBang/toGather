import React, { useState, useEffect } from "react";
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
      alert("이름을 입력해 주세요.");
    } else if (userInfo.userNickName === "") {
      alert("닉네임을 입력해 주세요.");
    } else if (userInfo.userGender === "") {
      alert("성별을 선택해 주세요.");
    } else if (userInfo.userBirth === "") {
      alert("생년월을 선택해 주세요.");
    } else if (userInfo.userPhone === "") {
      alert("전화번호를 입력해 주세요.");
    } else if (userInfo.userBelong === "") {
      alert("소속을 입력해 주세요.");
    } else if (userInfo.userDescription === "") {
      alert("소개를 입력해 주세요.");
    } else if (userInfo.userInterest === "") {
      alert("관심사를 입력해 주세요.");
    } else {
      const ok = window.confirm("저장하시겠습니까?");
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
      <div
        style={{
          padding: "1rem 1.5rem",
          position: "fixed",
          zIndex: 3,
          cursor: "pointer",
          backgroundColor: "white",
          width: "93%",
          maxWidth: "24rem",
        }}
      >
        <Link href="/" passHref>
          <Image width="125px" height="30px" src={logobox} alt="logobox" />
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
          <h3>내 프로필</h3>
          {canModify ? (
            isModifying ? (
              <ContainedButton
                style={{ fontSize: "100%" }}
                onClick={onModifyClick}
              >
                저장하기
              </ContainedButton>
            ) : (
              <ContainedButton
                style={{ fontSize: "100%" }}
                onClick={() => {
                  setIsModifying(!isModifying);
                }}
              >
                수정하기
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
            <span style={{ marginRight: "3.5rem" }}>이름</span>
            <TextField
              required
              name="userName"
              id="userName"
              label="이름"
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
            <span style={{ marginRight: "2.6rem" }}>닉네임</span>
            <TextField
              required
              name="userNickName"
              id="userNickName"
              label="닉네임"
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
            <span style={{ marginRight: "3.5rem" }}>성별</span>

            <ToggleButtonGroup
              id="userGender"
              value={userInfo.userGender}
              exclusive
              onChange={onChangeText}
              disabled={!isModifying}
            >
              <ToggleButton id="userGender" value="male">
                남성
              </ToggleButton>
              <ToggleButton id="userGender" value="female">
                여성
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
            <span style={{ marginRight: "2.6rem" }}>생년월</span>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={["year", "month"]}
                label="생년월"
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
            <span style={{ marginRight: "1.7rem" }}>전화번호</span>
            <TextField
              required
              type="number"
              name="userPhone"
              id="userPhone"
              label="전화번호"
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
            <span style={{ marginRight: "3.5rem" }}>소속</span>
            <TextField
              required
              type="text"
              name="userBelong"
              id="userBelong"
              label="소속"
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
            <span style={{ marginRight: "1.7rem" }}>자기소개</span>
            <TextField
              required
              multiline
              rows={6}
              name="userDescription"
              id="userDescription"
              label="자기소개"
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
            <span style={{ marginRight: "2.5rem" }}>관심사</span>
            <TextField
              required
              multiline
              rows={6}
              name="userInterest"
              id="userInterest"
              label="관심사"
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
              로그아웃
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
