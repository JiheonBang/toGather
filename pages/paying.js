import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import moment from "moment";

import Navbar from "../components/navbar";
import { ContainedButton, OutlinedButton } from "../components/styledButton";
import { authService, dbService } from "../firebase/initFirebase";
import flag from "../public/paying.png";

function Paying() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState();
  const [payingName, setPayingName] = useState();
  const [userGatherings, setUserGatherings] = useState();
  const [discountStatus, setDiscountStatus] = useState();

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    }
  });

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
    getPayingName();
  }, [currentUser]);

  const getUserApplies = async () => {
    let a = [];
    if (currentUser) {
      const appliesDB = await dbService
        .collection("userApply")
        .orderBy("meetingDay")
        .get();
      appliesDB.docs.map((doc) => {
        if (doc.data().groupNum) {
          if (doc.data().userId === currentUser.uid) {
            a.push({ ...doc.data(), docId: doc.id });
          }
        }
      });
      setUserGatherings(a.reverse());
    }
  };

  useEffect(() => {
    getUserApplies();
  }, [currentUser]);

  const onPaidClick = (e) => {
    e.preventDefault();
    fetch(process.env.NEXT_PUBLIC_SLACK_CONFIG_PAYING, {
      method: "POST",
      body: JSON.stringify({
        text: `[${moment(Date.now()).format(
          "YYMMDD HH:mm"
        )}] ${payingName} 님이 입금하셨습니다.`,
      }),
    });
    router.push("/waiting");
  };

  useEffect(() => {
    if (userGatherings) {
      if (userGatherings[0].isReviewed) {
        setDiscountStatus("reviewed");
      } else {
        setDiscountStatus("not reviewed");
      }
    } else {
      setDiscountStatus("first");
    }
  }, [userGatherings]);

  return (
    <>
      <Head>
        <title>Paying | toGather</title>
      </Head>
      <Navbar />
      <div
        style={{
          paddingTop: "7rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3 style={{ fontWeight: "400" }}>신청해주셔서 대단히 감사합니다.</h3>
        <div style={{ width: "5rem" }}>
          <Image src={flag} alt="flag_paying" />
        </div>
        <div
          style={{
            marginTop: "-1.5rem",
            backgroundColor: "#FFF8E7",
            width: "20rem",
            height: "fit-content",
            padding: "4rem 0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: "1.6",
            boxShadow:
              "0 10px 35px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "60%",
            }}
          >
            <div>기존 금액</div>
            <div>6,600원</div>
          </div>
          {discountStatus && discountStatus === "first" ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <div>첫 구매 할인</div>
                <div style={{ color: "red" }}>-6,600원</div>
              </div>
              <div
                style={{
                  backgroundColor: "#202023",
                  width: "70%",
                  height: "0.1rem",
                  zIndex: "1",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <div>결제 금액</div>
                <div>0원</div>
              </div>
            </>
          ) : discountStatus === "reviewed" ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <div>리뷰 할인</div>
                <div style={{ color: "red" }}>-3,300원</div>
              </div>
              <div
                style={{
                  backgroundColor: "#202023",
                  width: "70%",
                  height: "0.1rem",
                  zIndex: "1",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <div>결제 금액</div>
                <div>3,300원</div>
              </div>
            </>
          ) : discountStatus === "not reviewed" ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <div>할인</div>
                <div style={{ color: "red" }}>0원</div>
              </div>
              <div
                style={{
                  backgroundColor: "#202023",
                  width: "70%",
                  height: "0.1rem",
                  zIndex: "1",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "60%",
                }}
              >
                <div>결제 금액</div>
                <div>6,600원</div>
              </div>
            </>
          ) : null}

          <div style={{ marginTop: "2rem" }}>
            아래 계좌번호로 위 결제 금액을
          </div>
          <div>입금해 주시면 신청이 확정됩니다.</div>
          <div style={{ marginTop: "3vh" }}>
            우리은행 1002-450-590122 방지헌
          </div>
        </div>
        <div
          style={{
            lineHeight: "1.7",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            marginTop: "6vh",
            marginLeft: "-2vw",
          }}
        >
          <div>
            작성해 주신 입금자명 :{" "}
            <span style={{ color: "#ffb800", fontSize: "130%" }}>
              {payingName}
            </span>
          </div>
          <div style={{ marginTop: "2vh" }}>위 이름으로 입금을 완료하시고,</div>
          <div style={{ marginBottom: "5vh" }}>
            아래 버튼을 클릭해 주시면 감사드리겠습니다.
          </div>
        </div>
        {discountStatus === "not reviewed" ? (
          <>
            <OutlinedButton
              style={{
                borderRadius: "1rem",
                maxWidth: "24rem",
                width: "90%",
                border: "1px solid #afafaf",
                color: "#afafaf",
                fontSize: "100%",
                marginBottom: "0.5rem",
              }}
              href="/review"
            >
              리뷰 쓰고 3,300원 할인 받기
            </OutlinedButton>
          </>
        ) : null}

        <ContainedButton
          style={{
            borderRadius: "1rem",
            maxWidth: "24rem",
            width: "90%",
          }}
          onClick={onPaidClick}
        >
          입금 완료했습니다.
        </ContainedButton>
      </div>
    </>
  );
}

export default Paying;
