import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

import { dbService } from "../firebase/initFirebase";
import Navbar from "../components/navbar";
import { ContainedButton } from "../components/styledButton";
import main from "../public/index_main.png";
import sub1 from "../public/index_sub_1.png";
import sub2 from "../public/index_sub_2.png";
import sub3 from "../public/index_sub_3.png";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function Home() {
  const router = useRouter();

  const [applyNum, setApplyNum] = useState(43);

  useEffect(() => {
    dbService
      .collection("userApply")
      .get()
      .then((snap) => {
        setApplyNum(applyNum + snap.size);
      });
  }, []);

  const [reviewNum, setReviewNum] = useState(1);
  const rightReviewNum = () => {
    if (reviewNum < 4) {
      setReviewNum((prev) => prev + 1);
    } else {
      setReviewNum(1);
    }
  };

  const leftReviewNum = () => {
    if (reviewNum > 1) {
      setReviewNum((prev) => prev - 1);
    } else {
      setReviewNum(4);
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
      <Head>
        <title>toGather</title>
      </Head>
      <Navbar />
      <div>
        <div
          style={{
            paddingTop: "5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontWeight: "600" }}>????????? ??????,</h1>
          <h1 style={{ marginTop: "-0.7rem", fontWeight: "600" }}>
            ????????? ?????????.
          </h1>
          <Image src={main} alt="index_main" />
        </div>
        <div
          style={{
            height: "45vh",
            backgroundColor: "#eeeeee",
            margin: "2.5rem -0.5rem",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            style={{ border: "none", cursor: "pointer", boxShadow: "none" }}
            onClick={leftReviewNum}
          >
            <ArrowBackIosNewIcon />
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "17rem",
                height: "33vh",
                backgroundColor: "white",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: "10px",
                boxShadow:
                  "0 10px 35px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {reviewNum === 1 ? (
                <>
                  <h3>?????? ?????? ????????? / ????????????</h3>
                  <h4 style={{ marginTop: "1rem", fontWeight: "300" }}>
                    ????????? ????????? ?????? ??????
                  </h4>
                  <h4 style={{ marginTop: "-1rem", fontWeight: "300" }}>
                    ??? ?????? ?????? ??? ????????? ????????????
                  </h4>
                  <h4 style={{ marginTop: "-1rem", fontWeight: "300" }}>
                    ??????????????? ?????? ?????? ????????????!
                  </h4>
                </>
              ) : reviewNum === 2 ? (
                <>
                  <h3>????????? ?????? / ?????????</h3>
                  <h4 style={{ marginTop: "1rem", fontWeight: "300" }}>
                    ????????? ??? ????????? ?????? ??????
                  </h4>
                  <h4 style={{ marginTop: "-1rem", fontWeight: "300" }}>
                    ????????? ?????? ????????? ?????????
                  </h4>
                  <h4 style={{ marginTop: "-1rem", fontWeight: "300" }}>
                    ??????????????? ????????? ??? ?????????.
                  </h4>
                </>
              ) : reviewNum === 3 ? (
                <>
                  <h3>????????? ????????? / ????????????</h3>
                  <h4 style={{ marginTop: "1rem", fontWeight: "300" }}>
                    ?????? ????????? ????????? ?????? ??????,
                  </h4>
                  <h4 style={{ marginTop: "-1rem", fontWeight: "300" }}>
                    ?????? ?????? ????????? ????????????
                  </h4>
                  <h4 style={{ marginTop: "-1rem", fontWeight: "300" }}>
                    ??????????????? ?????? ?????? ????????????!
                  </h4>
                </>
              ) : (
                <>
                  <h3>?????? ????????? / ?????????</h3>
                  <h4 style={{ marginTop: "1rem", fontWeight: "300" }}>
                    ?????? ????????? ????????? ?????????
                  </h4>
                  <h4 style={{ marginTop: "-1rem", fontWeight: "300" }}>
                    ???????????? ?????? ?????? ?????????
                  </h4>
                  <h4 style={{ marginTop: "-1rem", fontWeight: "300" }}>
                    ????????? ???????????? ???????????????!
                  </h4>
                </>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginTop: "0.5rem",
              }}
            >
              {reviewNum === 1 ? (
                <>
                  {currentCircle}
                  {progressCircle}
                  {progressCircle}
                  {progressCircle}
                </>
              ) : reviewNum === 2 ? (
                <>
                  {progressCircle}
                  {currentCircle}
                  {progressCircle}
                  {progressCircle}
                </>
              ) : reviewNum === 3 ? (
                <>
                  {progressCircle}
                  {progressCircle}
                  {currentCircle}
                  {progressCircle}
                </>
              ) : (
                <>
                  {progressCircle}
                  {progressCircle}
                  {progressCircle}
                  {currentCircle}
                </>
              )}
            </div>
          </div>
          <button
            style={{
              border: "none",
              cursor: "pointer",
            }}
            onClick={rightReviewNum}
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              src={sub1}
              alt="index_sub_1"
              width="100rem"
              height="120rem"
            />
            <div style={{ marginLeft: "2rem" }}>
              <h3 style={{ fontWeight: "500" }}>?????? ?????? ?????? ??????</h3>
              <h3 style={{ marginTop: "-0.7rem", fontWeight: "500" }}>
                ????????? ?????????!
              </h3>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <div style={{ marginLeft: "-1.5rem" }}>
              <Image
                src={sub2}
                alt="index_sub_2"
                width="120rem"
                height="130rem"
              />
            </div>
            <div style={{ marginLeft: "2rem" }}>
              <h3 style={{ fontWeight: "500" }}>?????? ??? ?????? ?????????</h3>
              <h3 style={{ marginTop: "-0.7rem", fontWeight: "500" }}>
                ???????????? ????????????.
              </h3>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Image
              src={sub3}
              alt="index_sub_3"
              width="100rem"
              height="110rem"
            />
            <div style={{ marginLeft: "2rem" }}>
              <h3 style={{ fontWeight: "500" }}>?????? ?????????</h3>
              <h3 style={{ marginTop: "-0.7rem", fontWeight: "500" }}>
                3~4????????? ????????????.
              </h3>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
            paddingBottom: "1rem",
          }}
        >
          <div
            style={{
              zIndex: "2",
              textAlign: "center",
            }}
          >
            ????????????{" "}
            <span style={{ fontSize: "120%", color: "#FFB800" }}>
              {applyNum}
            </span>{" "}
            ?????? ???????????????.
          </div>
          <Link href="/main" passHref>
            <ContainedButton
              style={{
                borderRadius: "1rem",
                maxWidth: "24rem",
                width: "90%",
              }}
            >
              ???????????? ??????
            </ContainedButton>
          </Link>
        </div>
      </div>
    </>
  );
}
