import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import moment from "moment";

import { authService, dbService } from "../firebase/initFirebase";
import Navbar from "../components/navbar";
import { ContainedButton } from "../components/styledButton";

function Apply() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [payingName, setPayingName] = useState();

  const [applyNum, setApplyNum] = useState(1);

  useEffect(() => {
    dbService
      .collection("userApply")
      .get()
      .then((snap) => {
        setApplyNum(applyNum + snap.size);
      });
  }, []);

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      alert("로그인이 필요한 페이지입니다.");
      router.push("/main");
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

  const getPayingName = async () => {
    if (currentUser) {
      const userData = await dbService
        .collection("userInfo")
        .doc(currentUser.uid)
        .get();
      userData.exists && setPayingName(userData.data().userName);
    }
  };

  useEffect(() => {
    checkOnboarding();
    getPayingName();
  }, [currentUser]);

  const onApplyClick = () => {
    if (currentUser) {
      if (isOnboarding) {
        const ok = window.confirm(
          `${moment(Date.now() + 31200000).format(
            "YYYY년 MM월 DD일"
          )} 모임에 신청하시겠습니까?`
        );
        if (ok) {
          dbService
            .collection("userApply")
            .add({
              userId: currentUser.uid,
              applyTime: moment(Date.now()).format("MM/DD HH:mm"),
              meetingDay: moment(Date.now() + 31200000).format("YY/MM/DD"),
              isPaid: false,
              groupNum: null,
            })
            .then(() => {
              fetch(process.env.NEXT_PUBLIC_SLACK_CONFIG_APPLY, {
                method: "POST",
                body: JSON.stringify({
                  text: `[${moment(Date.now()).format(
                    "YYMMDD HH:mm"
                  )}] ${payingName} 님이 신청하셨습니다.`,
                }),
              });
            })
            .then(router.push("/paying"));
        }
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
    <div>
      <Navbar />

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
      </div>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontWeight: "400", marginBottom: "0.3rem" }}>이용 규칙</h3>
        <div
          style={{
            backgroundColor: "#FFF8E7",
            width: "16rem",
            height: "20rem",
            padding: "1.5rem",
            lineHeight: "1.6",
            boxShadow:
              "0 10px 35px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div>1️⃣ 상대방을 존중하고 배려해요.</div>
          <div style={{ marginTop: "0.5rem" }}>
            2️⃣ 나와 다를 수 있음을 인정해요.
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            3️⃣ 상대방이 불쾌해 할 수 있는 말과 행동은 하지 않아요.
          </div>
          <div style={{ marginLeft: "1rem" }}></div>
          <div style={{ marginTop: "2rem", fontSize: "80%" }}>
            * 성적 수치심 또는 혐오감을 유발할 수 있는 대화와 행동, 성희롱,
            성추행, 장애인 비하, 폭력적인 대화와 행동에 대해서는 즉시 처벌 받을
            수 있습니다.
          </div>
          <div style={{ fontSize: "80%" }}>
            * 또한, 그 즉시 서비스를 영구적으로 이용할 수 없습니다.
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "15vh",
        }}
      >
        <div
          style={{
            zIndex: "2",
          }}
        >
          오늘 모임에{" "}
          <span style={{ fontSize: "120%", color: "#FFB800" }}>{applyNum}</span>{" "}
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
          규칙에 동의하고 신청하기
        </ContainedButton>
      </div>
    </div>
  );
}

export default Apply;
