import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import moment from "moment";

import Navbar from "../components/navbar";
import { ContainedButton } from "../components/styledButton";
import { authService, dbService } from "../firebase/initFirebase";

import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Review() {
  const StyledRating = styled(Rating)({
    "& .MuiRating-iconFilled": {
      color: "#ff6d75",
    },
    "& .MuiRating-iconHover": {
      color: "#ff3d47",
    },
  });

  const router = useRouter();

  const [currentUser, setCurrentUser] = useState();
  const [lastestGathering, setLatestGathering] = useState();
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupMembersInfo, setGroupMembersInfo] = useState([]);
  const [userName, setUserName] = useState();
  const [userReview, setUserReview] = useState({
    reviewContent: "",
    review1: 2.5,
    review2: 2.5,
    review3: 2.5,
    etc: "",
  });

  console.log(userReview);

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    }
  });

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
      if (a) {
        if (a.reverse()[0].isReviewed === false) {
          setLatestGathering(a.reverse()[0]);
        }
      }
    }
  };

  useEffect(() => {
    getUserApplies();
  }, [currentUser]);

  useEffect(() => {
    const members = [];
    if (lastestGathering) {
      dbService.collection("userApply").onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          if (doc.data().meetingDay === lastestGathering.meetingDay) {
            if (lastestGathering.groupNum === doc.data().groupNum) {
              if (currentUser.uid !== doc.data().userId) {
                members.push(doc.data().userId);
              }
            }
          }
        });
        setGroupMembers(members);
      });
    }
  }, [lastestGathering]);

  console.log(userName);

  useEffect(() => {
    const membersInfo = [];
    if (currentUser) {
      if (groupMembers) {
        dbService.collection("userInfo").onSnapshot((snapshot) => {
          snapshot.docs.map((doc) => {
            if (groupMembers.includes(doc.data().userId)) {
              membersInfo.push(doc.data());
            } else if (currentUser.uid === doc.data().userId) {
              setUserName(doc.data().userName);
            }
          });
          setGroupMembersInfo(membersInfo);
        });
      }
    }
  }, [groupMembers]);

  const onChangeText = (e) => {
    e.preventDefault();
    const { name, value } = e.currentTarget;
    setUserReview({ ...userReview, [name]: value });
  };

  const onReviewClick = (e) => {
    e.preventDefault();
    if (userReview.reviewContent === "") {
      alert("리뷰를 입력해 주세요.");
    } else if (userReview.reviewContent.length < 10) {
      alert("리뷰를 조금만 더 자세하게 입력해 주실 수 있으실까요?");
    } else {
      const ok = window.confirm("리뷰를 저장하시겠습니까?");
      if (ok) {
        if (groupMembersInfo.length === 2) {
          dbService
            .collection("userReview")
            .add({
              reviewContent: userReview.reviewContent,
              member1: groupMembersInfo[0].userNickName,
              member2: groupMembersInfo[1].userNickName,
              review1: userReview.review1,
              review2: userReview.review2,
              etc: userReview.etc,
              meetingDay: lastestGathering.meetingDay,
              groupNum: lastestGathering.groupNum,
              userId: currentUser.uid,
              createdAt: Date.now(),
            })
            .then(() => {
              fetch(process.env.NEXT_PUBLIC_SLACK_CONFIG_APPLY, {
                method: "POST",
                body: JSON.stringify({
                  text: `[${moment(Date.now()).format(
                    "YYMMDD HH:mm"
                  )}] ${userName} 님이 리뷰를 작성하셨습니다.`,
                }),
              });
            });

          dbService
            .collection("userApply")
            .doc(lastestGathering.docId)
            .update({ isReviewed: true })
            .then(router.push("/main"));
        } else if (groupMembersInfo.length === 3) {
          dbService
            .collection("userReview")
            .add({
              reviewContent: userReview.reviewContent,
              member1: groupMembersInfo[0].userNickName,
              member2: groupMembersInfo[1].userNickName,
              member3: groupMembersInfo[2].userNickName,
              review1: userReview.review1,
              review2: userReview.review2,
              review3: userReview.review3,
              etc: userReview.etc,
              meetingDay: lastestGathering.meetingDay,
              groupNum: lastestGathering.groupNum,
              userId: currentUser.uid,
              createdAt: Date.now(),
            })
            .then(() => {
              fetch(process.env.NEXT_PUBLIC_SLACK_CONFIG_APPLY, {
                method: "POST",
                body: JSON.stringify({
                  text: `[${moment(Date.now()).format(
                    "YYMMDD HH:mm"
                  )}] ${userName} 님이 리뷰를 작성하셨습니다.`,
                }),
              });
            });

          dbService
            .collection("userApply")
            .doc(lastestGathering.docId)
            .update({ isReviewed: true })
            .then(router.push("/main"));
        }
      }
    }
  };

  const getRatings = (e) => {
    if (groupMembersInfo) {
      if (groupMembersInfo.length === 2) {
        return (
          <div
            style={{
              padding: "1rem 3rem",
              backgroundColor: "#FFF8E7",
              borderRadius: "20px",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "160%" }}>
                {groupMembersInfo[0].userGender === "male" ? "🙋‍♂️" : "🙋‍♀️"}
              </span>
              {"  "}
              {groupMembersInfo[0].userNickName}
              {"  "} / {"  "}
              {groupMembersInfo[0].userBelong}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "-0.3rem 0 1rem 0",
              }}
            >
              <StyledRating
                name="review1"
                id="review1"
                size="large"
                getLabelText={(value) =>
                  `${value} Heart${value !== 1 ? "s" : ""}`
                }
                value={userReview.review1}
                precision={0.5}
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                onChange={onChangeText}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "160%" }}>
                {groupMembersInfo[1].userGender === "male" ? "🙋‍♂️" : "🙋‍♀️"}
              </span>
              {"  "}
              {groupMembersInfo[1].userNickName}
              {"  "} / {"  "}
              {groupMembersInfo[1].userBelong}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "-0.3rem 0 1rem 0",
              }}
            >
              <StyledRating
                name="review2"
                id="review2"
                size="large"
                getLabelText={(value) =>
                  `${value} Heart${value !== 1 ? "s" : ""}`
                }
                value={userReview.review2}
                precision={0.5}
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                onChange={onChangeText}
              />
            </div>
          </div>
        );
      } else if (groupMembersInfo.length === 3) {
        return (
          <div
            style={{
              padding: "1rem 3rem",
              backgroundColor: "#FFF8E7",
              borderRadius: "20px",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "160%" }}>
                {groupMembersInfo[0].userGender === "male" ? "🙋‍♂️" : "🙋‍♀️"}
              </span>
              {"  "}
              {groupMembersInfo[0].userNickName}
              {"  "} / {"  "}
              {groupMembersInfo[0].userBelong}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "-0.3rem 0 1rem 0",
              }}
            >
              <StyledRating
                name="review1"
                id="review1"
                size="large"
                getLabelText={(value) =>
                  `${value} Heart${value !== 1 ? "s" : ""}`
                }
                value={userReview.review1}
                precision={0.5}
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                onChange={onChangeText}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "160%" }}>
                {groupMembersInfo[1].userGender === "male" ? "🙋‍♂️" : "🙋‍♀️"}
              </span>
              {"  "}
              {groupMembersInfo[1].userNickName}
              {"  "} / {"  "}
              {groupMembersInfo[1].userBelong}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "-0.3rem 0 1rem 0",
              }}
            >
              <StyledRating
                name="review2"
                id="review2"
                size="large"
                getLabelText={(value) =>
                  `${value} Heart${value !== 1 ? "s" : ""}`
                }
                value={userReview.review2}
                precision={0.5}
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                onChange={onChangeText}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "160%" }}>
                {groupMembersInfo[2].userGender === "male" ? "🙋‍♂️" : "🙋‍♀️"}
              </span>
              {"  "}
              {groupMembersInfo[2].userNickName}
              {"  "} / {"  "}
              {groupMembersInfo[2].userBelong}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "-0.3rem 0 1rem 0",
              }}
            >
              <StyledRating
                name="review3"
                id="review3"
                size="large"
                getLabelText={(value) =>
                  `${value} Heart${value !== 1 ? "s" : ""}`
                }
                value={userReview.review3}
                precision={0.5}
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                onChange={onChangeText}
              />
            </div>
          </div>
        );
      }
    }
  };

  return (
    <>
      <Head>
        <title>Review | toGather</title>
      </Head>
      <Navbar />
      {lastestGathering ? (
        <>
          <div style={{ padding: "5rem 0 0 2rem" }}>
            <h2 style={{ fontWeight: "400" }}>
              {lastestGathering &&
                moment(lastestGathering.applyTime + 31200000).format(
                  "YYYY년 MM월 DD일"
                )}
            </h2>
            <div
              style={{
                backgroundColor: "#FFE9B0",
                width: "12.5rem",
                height: "0.8rem",
                margin: "-2.1rem 0 1rem -0.4rem ",
                zIndex: "-100",
              }}
            />
            <div style={{ marginTop: "0.3rem" }}>자세하게 작성해 주실수록,</div>
            <div>다음 매칭 정확도가 올라갑니다.</div>
          </div>
          <div style={{ padding: "1rem 1rem" }}>
            <h4
              style={{
                fontWeight: "400",
                marginLeft: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              모임은 전반적으로 어떠셨나요?
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TextField
                required
                multiline
                rows={4}
                name="reviewContent"
                id="reviewContent"
                label="리뷰"
                variant="outlined"
                value={userReview.reviewContent}
                onChange={onChangeText}
                sx={{ width: "20rem" }}
              />
            </div>
            <h4
              style={{
                fontWeight: "400",
                margin: "3rem 0 0.5rem 1rem",
              }}
            >
              모임에 참가하신 분들은 어떠셨나요?
            </h4>
            <div>{getRatings()}</div>
            <h4
              style={{
                fontWeight: "400",
                margin: "3rem 0 0.5rem 1rem",
              }}
            >
              기타 서비스에 대한 피드백이 있으신가요?
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TextField
                multiline
                rows={4}
                name="etc"
                id="etc"
                label="기타 피드백"
                variant="outlined"
                value={userReview.etc}
                onChange={onChangeText}
                sx={{ width: "20rem" }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "2rem 0",
            }}
          >
            <ContainedButton
              style={{
                borderRadius: "1rem",
                maxWidth: "24rem",
                width: "90%",
              }}
              onClick={onReviewClick}
            >
              리뷰 제출하고 할인 받기
            </ContainedButton>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <h3 style={{ fontWeight: "400" }}>
              리뷰를 작성할 모임이 없습니다.
            </h3>
            <ContainedButton
              style={{
                borderRadius: "1rem",
              }}
              href="/main"
            >
              새 모임 신청하러 가기
            </ContainedButton>
          </div>
        </>
      )}
    </>
  );
}
export default Review;
