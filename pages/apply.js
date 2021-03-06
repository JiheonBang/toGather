import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import moment from "moment";

import { authService, dbService } from "../firebase/initFirebase";
import Navbar from "../components/navbar";
import { ContainedButton } from "../components/styledButton";

function Apply() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [applyingName, setApplyingName] = useState();
  const [isDuplicated, setIsDuplicated] = useState(false);
  const [dDayApply, setDDayApply] = useState(0);

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    }
  });

  const getApplyNum = async () => {
    let applyDB = 0;
    const a = await dbService.collection("userApply").get();
    a.docs.map((doc) => {
      if (
        moment(Date.now() + 31200000).format("YY/MM/DD") ===
        doc.data().meetingDay
      ) {
        applyDB = applyDB + 1;
      }
    });
    setDDayApply(applyDB);
  };

  const checkOnboarding = async () => {
    if (currentUser) {
      const userData = await dbService
        .collection("userInfo")
        .doc(currentUser.uid)
        .get();
      userData.exists && setIsOnboarding(true);
    }
  };

  const getApplyingName = async () => {
    if (currentUser) {
      const userData = await dbService
        .collection("userInfo")
        .doc(currentUser.uid)
        .get();
      userData.exists && setApplyingName(userData.data().userName);
    }
  };

  const duplicationTest = async () => {
    if (currentUser) {
      dbService.collection("userApply").onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          if (
            moment(Date.now() + 31200000).format("YY/MM/DD") ===
            doc.data().meetingDay
          ) {
            if (currentUser.uid === doc.data().userId) {
              setIsDuplicated(true);
            }
          }
        });
      });
    }
  };

  useEffect(() => {
    getApplyNum();
    checkOnboarding();
    getApplyingName();
    duplicationTest();
  }, [currentUser]);

  const onApplyClick = () => {
    if (currentUser) {
      if (isOnboarding) {
        if (!isDuplicated) {
          const ok = window.confirm(
            `${moment(Date.now() + 31200000).format(
              "YYYY??? MM??? DD???"
            )} ????????? ?????????????????????????`
          );
          if (ok) {
            dbService
              .collection("userApply")
              .add({
                userId: currentUser.uid,
                applyTime: Date.now(),
                meetingDay: moment(Date.now() + 31200000).format("YY/MM/DD"),
                isPaid: false,
                isReviewed: false,
                groupNum: null,
              })
              .then(() => {
                fetch(process.env.NEXT_PUBLIC_SLACK_CONFIG_APPLY, {
                  method: "POST",
                  body: JSON.stringify({
                    text: `[${moment(Date.now()).format(
                      "YYMMDD HH:mm"
                    )}] ${applyingName} ?????? ?????????????????????.`,
                  }),
                });
              })
              .then(router.push("/paying"));
          }
        } else {
          alert(
            `${moment(Date.now() + 31200000).format(
              "YYYY??? MM??? DD???"
            )} ????????? ?????? ?????????????????????.`
          );
          router.push("/paying");
        }
      } else {
        const ok = window.confirm("??? ????????? ?????????????????????????");
        if (ok) {
          router.push("/onboarding");
        }
      }
    } else {
      const ok = window.confirm("????????? ???????????????????");
      if (ok) {
        router.push("/login");
      }
    }
  };

  console.log(dDayApply);

  return (
    <div>
      <Head>
        <title>Apply | toGather</title>
      </Head>
      <Navbar />

      <div style={{ padding: "1rem 2rem" }}>
        <h2 style={{ paddingTop: "5rem", fontWeight: "400" }}>
          {moment(Date.now() + 31200000).format("YYYY??? MM??? DD???")}
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
        <h3 style={{ fontWeight: "400", marginBottom: "0.3rem" }}>?????? ??????</h3>
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
          <div>1?????? ???????????? ???????????? ????????????.</div>
          <div style={{ marginTop: "0.5rem" }}>
            2?????? ?????? ?????? ??? ????????? ????????????.
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            3?????? ???????????? ????????? ??? ??? ?????? ?????? ????????? ?????? ?????????.
          </div>
          <div style={{ marginLeft: "1rem" }}></div>
          <div style={{ marginTop: "2rem", fontSize: "80%" }}>
            * ?????? ????????? ?????? ???????????? ????????? ??? ?????? ????????? ??????, ?????????,
            ?????????, ????????? ??????, ???????????? ????????? ????????? ???????????? ?????? ?????? ??????
            ??? ????????????.
          </div>
          <div style={{ fontSize: "80%" }}>
            * ??????, ??? ?????? ???????????? ??????????????? ????????? ??? ????????????.
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
          ?????? ?????????{" "}
          <span style={{ fontSize: "120%", color: "#FFB800" }}>
            {dDayApply && 6 + dDayApply}
          </span>{" "}
          ?????? ???????????????.
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
          ????????? ???????????? ????????????
        </ContainedButton>
      </div>
    </div>
  );
}

export default Apply;
