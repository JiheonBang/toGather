import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { dbService, authService } from "../firebase/initFirebase";
import logobox from "../public/logo.png";
import {
  ContainedButton,
  TextButton,
  OutlinedButton,
} from "../components/styledButton";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

function Onboarding() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  });

  const [onbNum, setOnbNum] = useState(1);
  const [userInfo, setUserInfo] = useState({
    userName: "",
    userNickName: "",
    userGender: "",
    userBirth: "",
    userPhone: "",
    userBelong: "",
    userDescription: "",
    userInterest: "",
  });
  console.log(userInfo);

  const onChangeText = (e) => {
    e.preventDefault();
    const { id, value } = e.currentTarget;
    setUserInfo({ ...userInfo, [id]: value });
  };

  const onChangeBirth = (newValue) => {
    setUserInfo({ ...userInfo, userBirth: newValue.toString().substr(3, 12) });
  };

  const onPreviousClick = (e) => {
    e.preventDefault();
    setOnbNum((prev) => prev - 1);
  };

  const onNextClick1 = (e) => {
    e.preventDefault();
    if (userInfo.userName === "") {
      alert("이름을 입력해 주세요.");
    } else if (userInfo.userNickName === "") {
      alert("닉네임을 입력해 주세요.");
    } else if (userInfo.userGender === "") {
      alert("성별을 선택해 주세요.");
    } else if (userInfo.userBirth === "") {
      alert("생년월을 선택해 주세요.");
    } else {
      setOnbNum((prev) => prev + 1);
    }
  };

  const onNextClick2 = (e) => {
    e.preventDefault();
    if (userInfo.userPhone === "") {
      alert("전화번호를 입력해 주세요.");
    } else {
      setOnbNum((prev) => prev + 1);
    }
  };

  const onNextClick3 = (e) => {
    e.preventDefault();
    if (userInfo.userBelong === "") {
      alert("소속을 입력해 주세요.");
    } else {
      setOnbNum((prev) => prev + 1);
    }
  };

  const onNextClick4 = (e) => {
    e.preventDefault();
    if (userInfo.userDescription === "") {
      alert("소개를 입력해 주세요.");
    } else {
      setOnbNum((prev) => prev + 1);
    }
  };

  const onFinishClick = (e) => {
    e.preventDefault();
    if (userInfo.userInterest === "") {
      alert("관심사를 입력해 주세요.");
    } else {
      const ok = window.confirm("저장하시겠습니까?");
      if (ok) {
        dbService
          .collection("userInfo")
          .doc(`${currentUser.uid}`)
          .set({
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
            userLink: Math.random().toString(36).substr(2, 11),
          })
          .then(() => {
            fetch(process.env.NEXT_PUBLIC_SLACK_CONFIG_ONBOARDING, {
              method: "POST",
              body: JSON.stringify({
                text: `${userInfo.userName} 님이 온보딩하셨습니다.`,
              }),
            });
          })
          .then(() => {
            router.push("/main");
          });
      }
    }
  };

  const progressCircle = (
    <div
      style={{
        width: "10px",
        height: "10px",
        margin: "6px",
        borderRadius: "50%",
        backgroundColor: "#FFE9B0",
      }}
    ></div>
  );

  const currentCircle = (
    <div
      style={{
        width: "12px",
        height: "12px",
        margin: "6px",
        borderRadius: "50%",
        backgroundColor: "#FFB800",
      }}
    ></div>
  );

  return (
    <>
      <div
        style={{
          padding: "1rem 1.5rem",
          position: "fixed",
          zIndex: 1,
          cursor: "pointer",
        }}
      >
        <Link href="/" passHref>
          <Image width="125px" height="30px" src={logobox} alt="logobox" />
        </Link>
      </div>

      <div style={{ height: "100vh", paddingTop: "9rem" }}>
        {onbNum === 1 ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              {currentCircle}
              {progressCircle}
              {progressCircle}
              {progressCircle}
              {progressCircle}
            </div>
            <h2 style={{ marginLeft: "1rem", fontWeight: "600" }}>
              기본 정보를 알려 주세요.
            </h2>
            <div
              style={{
                marginLeft: "1rem",
                marginTop: "1rem",
                lineHeight: "1.7",
              }}
            >
              <div>이름은 입금자명 확인 시에,</div>
              <div>생년월은 매칭 시 활용됩니다.</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "2.5rem 0 0 2rem",
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
                <span style={{ marginRight: "3rem" }}>이름</span>
                <TextField
                  required
                  name="userName"
                  id="userName"
                  label="이름"
                  variant="outlined"
                  defaultValue={userInfo.userName}
                  onChange={onChangeText}
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
                <span style={{ marginRight: "2.1rem" }}>닉네임</span>
                <TextField
                  required
                  name="userNickName"
                  id="userNickName"
                  label="닉네임"
                  variant="outlined"
                  defaultValue={userInfo.userNickName}
                  onChange={onChangeText}
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
                <span style={{ marginRight: "3rem" }}>성별</span>

                <ToggleButtonGroup
                  id="userGender"
                  value={userInfo.userGender}
                  exclusive
                  onChange={onChangeText}
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
                }}
              >
                <span style={{ marginRight: "2.1rem" }}>생년월</span>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    views={["year", "month"]}
                    label="생년월"
                    minDate={new Date("1950-01-01")}
                    maxDate={new Date("2020-12-01")}
                    value={userInfo.userBirth}
                    onChange={(newValue) => onChangeBirth(newValue)}
                    renderInput={(params) => (
                      <TextField {...params} helperText={null} />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div
              style={{
                margin: "10vh 0 10vh 0",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <ContainedButton onClick={onNextClick1}>다음</ContainedButton>
            </div>
          </>
        ) : onbNum === 2 ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              {progressCircle}
              {currentCircle}
              {progressCircle}
              {progressCircle}
              {progressCircle}
            </div>
            <h2 style={{ marginLeft: "1rem", fontWeight: "600" }}>
              전화번호를 알려 주세요.
            </h2>
            <div
              style={{
                marginLeft: "1rem",
                marginTop: "1rem",
                lineHeight: "1.7",
              }}
            >
              <div>안내사항을 보내드리기 위함이며,</div>
              <div>다른 용도로 사용되지 않습니다.</div>
              <div>숫자로만 입력해 주세요😎</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: "3rem",
              }}
            >
              <TextField
                required
                type="number"
                name="userPhone"
                id="userPhone"
                label="전화번호"
                variant="outlined"
                value={userInfo.userPhone}
                onChange={onChangeText}
                sx={{ width: "20rem" }}
              />
            </div>
            <div
              style={{
                marginTop: "20vh",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <TextButton
                style={{
                  width: "fit-content",
                  color: "#AFAFAF",
                }}
                onClick={onPreviousClick}
              >
                이전
              </TextButton>
              <ContainedButton onClick={onNextClick2}>다음</ContainedButton>
            </div>
          </>
        ) : onbNum === 3 ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              {progressCircle}
              {progressCircle}
              {currentCircle}
              {progressCircle}
              {progressCircle}
            </div>
            <h2 style={{ marginLeft: "1rem", fontWeight: "600" }}>
              현재 소속을 알려 주세요.
            </h2>
            <div
              style={{
                marginLeft: "1rem",
                marginTop: "1rem",
                lineHeight: "1.7",
              }}
            >
              <div>재직 중인 회사나, 재학 중인 학교를</div>
              <div>정확하게 알려 주세요.</div>
              <div>같은 소속 매칭 피하기 등에 이용돼요.</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: "3rem",
              }}
            >
              <TextField
                required
                type="text"
                name="userBelong"
                id="userBelong"
                label="소속"
                variant="outlined"
                value={userInfo.userBelong}
                onChange={onChangeText}
                sx={{ width: "20rem" }}
              />
            </div>
            <div
              style={{
                marginTop: "20vh",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <TextButton
                style={{
                  width: "fit-content",
                  color: "#AFAFAF",
                }}
                onClick={onPreviousClick}
              >
                이전
              </TextButton>
              <ContainedButton onClick={onNextClick3}>다음</ContainedButton>
            </div>
          </>
        ) : onbNum === 4 ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              {progressCircle}
              {progressCircle}
              {progressCircle}
              {currentCircle}
              {progressCircle}
            </div>
            <h2 style={{ marginLeft: "1rem", fontWeight: "600" }}>
              나를 소개해 주세요.
            </h2>
            <div
              style={{
                marginLeft: "1rem",
                marginTop: "1rem",
                lineHeight: "1.7",
              }}
            >
              <div>자세할수록 매칭 정확도가 올라가며,</div>
              <div>매칭 상대방에게 공개됩니다.</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: "3rem",
              }}
            >
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
                sx={{ width: "20rem" }}
              />
            </div>
            <div
              style={{
                marginTop: "10vh",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <TextButton
                style={{
                  width: "fit-content",
                  color: "#AFAFAF",
                }}
                onClick={onPreviousClick}
              >
                이전
              </TextButton>
              <ContainedButton onClick={onNextClick4}>다음</ContainedButton>
            </div>
          </>
        ) : onbNum === 5 ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "2rem",
              }}
            >
              {progressCircle}
              {progressCircle}
              {progressCircle}
              {progressCircle}
              {currentCircle}
            </div>
            <h2 style={{ marginLeft: "1rem", fontWeight: "600" }}>
              요즘 어떤 것에 관심이 있나요?
            </h2>
            <div
              style={{
                marginLeft: "1rem",
                marginTop: "1rem",
                lineHeight: "1.7",
              }}
            >
              <div>자세할수록 매칭 정확도가 올라가며,</div>
              <div>매칭 상대방에게 공개됩니다.</div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: "3rem",
              }}
            >
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
                sx={{ width: "20rem" }}
              />
            </div>
            <div
              style={{
                marginTop: "10vh",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <TextButton
                style={{
                  width: "fit-content",
                  color: "#AFAFAF",
                }}
                onClick={onPreviousClick}
              >
                이전
              </TextButton>
              <ContainedButton onClick={onFinishClick}>완료</ContainedButton>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export default Onboarding;
