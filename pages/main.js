import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import moment from "moment";

import { authService, dbService } from "../firebase/initFirebase";
import Navbar from "../components/navbar";
import { ContainedButton } from "../components/styledButton";

function Main() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [applyNum, setApplyNum] = useState(1);

  useEffect(() => {
    dbService
      .collection("userApply")
      .get()
      .then((snap) => {
        setApplyNum(applyNum + 3 * snap.size);
      });
  }, []);

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    }
  });

  const checkOnboarding = async () => {
    if (currentUser) {
      const userData = await dbService
        .collection("userInfo")
        .doc(currentUser.uid)
        .get();
      userData.exists && setIsOnboarding(true);
    }
  };

  useEffect(() => {
    checkOnboarding();
  }, [currentUser]);

  const onApplyClick = () => {
    if (currentUser) {
      if (isOnboarding) {
        router.push("/apply");
      } else {
        const ok = window.confirm("내 정보를 입력하시겠습니까?");
        if (ok) {
          router.push("/onboarding");
        }
      }
    } else {
      const ok = window.confirm("로그인 하시겠습니까?");
      if (ok) {
        router.push("/login");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ height: "100vh" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              zIndex: "2",
              position: "fixed",
              marginTop: "90vh",
              textAlign: "center",
            }}
          >
            오늘 모임에{" "}
            <span style={{ fontSize: "120%", color: "#FFB800" }}>
              {applyNum}
            </span>{" "}
            명이 신청했어요.
          </div>
          <ContainedButton
            onClick={onApplyClick}
            style={{
              borderRadius: "1rem",
              maxWidth: "24rem",
              width: "90%",
              zIndex: "2",
              position: "fixed",
              marginTop: "93vh",
            }}
          >
            함께하러 가기
          </ContainedButton>
        </div>
        <div style={{ padding: "1rem 2rem" }}>
          <h2 style={{ paddingTop: "5rem", fontWeight: "400" }}>
            {moment(Date.now() + 31200000).format("YYYY년 MM월 DD일")}
          </h2>
          <div
            style={{
              backgroundColor: "#FFE9B0",
              width: "12.5rem",
              height: "0.8rem",
              margin: "-2.1rem 0 0 -0.4rem ",
              zIndex: "-100",
            }}
          />

          <h3
            style={{
              marginTop: "3rem",
              fontWeight: "300",
              lineHeight: "1.6rem",
            }}
          >
            <li>모든 모임은 당일 저녁이며,</li>
            <div style={{ marginLeft: "1.6rem" }}>
              매칭 수수료 9,900원이 부과됩니다.
            </div>
          </h3>

          <h3
            style={{
              marginTop: "1rem",
              fontWeight: "300",
              lineHeight: "1.6rem",
            }}
          >
            <li>오후 3시까지 당일 신청이 가능하며,</li>
            <div style={{ marginLeft: "1.6rem" }}>
              3시 이후로는 다음 날로 신청됩니다.
            </div>
            <div style={{ marginLeft: "1.6rem" }}>
              (위 날짜를 확인해 주세요.)
            </div>
          </h3>
          <h3
            style={{
              marginTop: "1rem",
              fontWeight: "300",
              lineHeight: "1.6rem",
            }}
          >
            <li>현재는 서울 지역에서만</li>
            <div style={{ marginLeft: "1.6rem" }}>
              서비스를 이용하실 수 있습니다.
            </div>
          </h3>
          <h3
            style={{
              marginTop: "1rem",
              fontWeight: "300",
              lineHeight: "1.6rem",
            }}
          >
            <li>모든 모임은 3~4인으로 진행되며,</li>
            <div style={{ marginLeft: "1.6rem" }}>
              참가자 매칭은 작성해 주신 프로필에
            </div>
            <div style={{ marginLeft: "1.6rem" }}>기반하여 진행됩니다.</div>
          </h3>
          <h3
            style={{
              marginTop: "1rem",
              fontWeight: "300",
              lineHeight: "1.6rem",
            }}
          >
            <li>모임의 성비는 랜덤이지만,</li>
            <div style={{ marginLeft: "1.6rem" }}>
              우선적으로 혼성으로 매칭됩니다.
            </div>
          </h3>
          <h3
            style={{
              marginTop: "1rem",
              fontWeight: "300",
              lineHeight: "1.6rem",
            }}
          >
            <li>매칭 결과는 오후 4시에 공개되며,</li>
            <div style={{ marginLeft: "1.6rem" }}>
              채팅방을 생성해 드립니다.
            </div>
          </h3>
        </div>
      </div>
    </>
  );
}

export default Main;
