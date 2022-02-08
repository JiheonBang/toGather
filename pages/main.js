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
      <div>
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
            <li>
              모든 모임은 당일 저녁이며, 매칭 수수료{" "}
              <span
                style={{
                  fontSize: "110%",
                  color: "#FFB800",
                  fontWeight: "600",
                }}
              >
                9,900원
              </span>
              이 부과됩니다.
            </li>
          </h3>

          <h3
            style={{
              marginTop: "1rem",
              fontWeight: "300",
              lineHeight: "1.6rem",
            }}
          >
            <li>
              <span
                style={{
                  fontSize: "110%",
                  color: "#FFB800",
                  fontWeight: "600",
                }}
              >
                오후 3시
              </span>
              까지 당일 신청이 가능하며, 3시 이후로는 다음 날로 신청됩니다.
            </li>

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
            <li>
              현재는{" "}
              <span
                style={{
                  fontSize: "110%",
                  color: "#FFB800",
                  fontWeight: "600",
                }}
              >
                서울
              </span>{" "}
              지역에서만 서비스를 이용하실 수 있습니다.
            </li>
          </h3>
          <h3
            style={{
              marginTop: "1rem",
              fontWeight: "300",
              lineHeight: "1.6rem",
            }}
          >
            <li>
              모든 모임은{" "}
              <span
                style={{
                  fontSize: "110%",
                  color: "#FFB800",
                  fontWeight: "600",
                }}
              >
                3~4인
              </span>
              으로 진행되며, 참가자 매칭은 작성해 주신 프로필에 기반하여
              진행됩니다.
            </li>
          </h3>
          <h3
            style={{
              marginTop: "1rem",
              fontWeight: "300",
              lineHeight: "1.6rem",
            }}
          >
            <li>
              모임의 성비는 랜덤이지만, 우선적으로{" "}
              <span
                style={{
                  fontSize: "110%",
                  color: "#FFB800",
                  fontWeight: "600",
                }}
              >
                혼성
              </span>
              으로 매칭됩니다.
            </li>
          </h3>
          <h3
            style={{
              marginTop: "1rem",
              fontWeight: "300",
              lineHeight: "1.6rem",
            }}
          >
            <li>
              매칭 결과는{" "}
              <span
                style={{
                  fontSize: "110%",
                  color: "#FFB800",
                  fontWeight: "600",
                }}
              >
                오후 4시
              </span>
              에 공개되며, 채팅방을 생성해 드립니다.
            </li>
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "5vh",
          }}
        >
          <div
            style={{
              zIndex: "2",
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
            }}
          >
            함께하러 가기
          </ContainedButton>
        </div>
      </div>
    </>
  );
}

export default Main;
