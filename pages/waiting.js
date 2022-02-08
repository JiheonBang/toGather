import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import moment from "moment";

import { authService, dbService } from "../firebase/initFirebase";
import Navbar from "../components/navbar";
import { ContainedButton, OutlinedButton } from "../components/styledButton";
import waiting from "../public/waiting.png";

function Waiting() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState();
  const [currentUserInfo, setCurrentUserInfo] = useState();

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    }
  });

  useEffect(() => {
    if (currentUser) {
      dbService.collection("userApply").onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          if (doc.data().userId === currentUser.uid) {
            setCurrentUserInfo(doc.data());
          }
        });
      });
    }
  }, [currentUser]);

  const onResultClick = () => {
    const currentTime = moment(Date.now()).format("HHmm");
    if (currentUserInfo) {
      if (currentUserInfo.isPaid) {
        if (currentTime >= 1600) {
          router.push("/matching");
        } else {
          alert("오후 4시 이후에 확인하실 수 있습니다.");
        }
      } else {
        if (currentTime >= 1600) {
          alert("오늘 매칭은 종료되었습니다.");
          router.push("/main");
        } else {
          alert(
            "입금 확인 중입니다.\n아직 입금하지 않으셨다면,\n입금을 부탁드립니다."
          );
        }
      }
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <div style={{ padding: "1rem 2rem" }}>
          <h2 style={{ paddingTop: "5rem", fontWeight: "400" }}>
            {moment(Date.now() + 24000000).format("YYYY년 MM월 DD일")}
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
            height: "65vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontWeight: "400" }}>매칭을 진행 중입니다.</h3>
          <div>
            <Image src={waiting} alt="waiting" width="260px" height="250px" />
          </div>
          <h3 style={{ fontWeight: "400" }}>오후 4시에 매칭 결과를</h3>
          <h3 style={{ fontWeight: "400", marginTop: "-0.5rem" }}>
            확인하실 수 있습니다.
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <OutlinedButton
            style={{
              borderRadius: "1rem",
              maxWidth: "24rem",
              width: "90%",
              border: "1px solid #afafaf",
              color: "#afafaf",
              fontSize: "100%",
            }}
            href="/paying"
          >
            아직 입금을 안하셨나요?
          </OutlinedButton>
          <ContainedButton
            onClick={onResultClick}
            style={{
              borderRadius: "1rem",
              maxWidth: "24rem",
              width: "90%",
              marginTop: "0.5rem",
            }}
          >
            매칭 결과 확인하기
          </ContainedButton>
        </div>
      </div>
    </>
  );
}

export default Waiting;
