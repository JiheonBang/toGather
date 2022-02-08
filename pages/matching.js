import React, { useState, useEffect } from "react";
import moment from "moment";

import { authService, dbService } from "../firebase/initFirebase";
import { ContainedButton } from "../components/styledButton";
import Navbar from "../components/navbar";

function Matching() {
  const dDay = moment(Date.now()).format("YY/MM/DD");

  const [currentUser, setCurrentUser] = useState();
  const [userGroupNum, setUserGroupNum] = useState();
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupMembersInfo, setGroupMembersInfo] = useState([]);

  authService.onAuthStateChanged((user) => {
    if (user) {
      setCurrentUser(user);
    }
  });

  useEffect(() => {
    if (currentUser) {
      dbService.collection("userApply").onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          if (doc.data().meetingDay === dDay) {
            if (currentUser.uid === doc.data().userId) {
              setUserGroupNum(doc.data().groupNum);
            }
          }
        });
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const members = [];
    if (userGroupNum) {
      dbService.collection("userApply").onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          if (doc.data().meetingDay === dDay) {
            if (userGroupNum === doc.data().groupNum) {
              if (currentUser.uid !== doc.data().userId) {
                members.push(doc.data().userId);
              }
            }
          }
        });
        setGroupMembers(members);
      });
    }
  }, [userGroupNum]);

  useEffect(() => {
    const membersInfo = [];
    if (groupMembers) {
      dbService.collection("userInfo").onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          if (groupMembers.includes(doc.data().userId)) {
            membersInfo.push(doc.data());
          }
        });
        setGroupMembersInfo(membersInfo);
      });
    }
  }, [groupMembers]);

  console.log(groupMembersInfo);

  return (
    <>
      <Navbar />
      <div
        style={{
          paddingBottom: "5rem",
        }}
      >
        <div style={{ padding: "1rem 2rem" }}>
          <h2 style={{ paddingTop: "5rem", fontWeight: "400" }}>
            {moment(Date.now()).format("YYYY년 MM월 DD일")}
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontWeight: "400" }}>매칭에 성공하셨습니다!</h3>
          <div style={{ marginBottom: "0.7rem" }}>
            오늘 만나실 분들의 프로필입니다.
          </div>
          {groupMembersInfo &&
            groupMembersInfo.map((member) => (
              <div
                key={member.useId}
                style={{
                  backgroundColor: "#F5F6FF",
                  width: "40vh",
                  height: "fit-content",
                  padding: "1rem",
                  marginBottom: "2rem",
                  borderRadius: "15px",
                  boxShadow:
                    "0 10px 35px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ fontSize: "160%" }}>
                    {member.userGender === "male" ? "🙋‍♂️" : "🙋‍♀️"}
                  </span>
                  {"  "}
                  {member.userNickName}
                  {"  "} / {"  "}
                  {member.userBelong}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%" }}>자기소개</div>
                  <div
                    style={{
                      backgroundColor: "white",
                      width: "100%",
                      height: "fit-content",
                      minHeight: "20vh",
                      marginBottom: "1rem",
                      borderRadius: "10px",
                      padding: "1rem",
                      boxShadow:
                        "0 10px 35px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {member.userDescription}
                  </div>
                  <div style={{ width: "100%" }}>관심사</div>
                  <div
                    style={{
                      backgroundColor: "white",
                      width: "100%",
                      height: "fit-content",
                      minHeight: "20vh",
                      borderRadius: "10px",
                      padding: "1rem",
                      marginBottom: "1rem",
                      boxShadow:
                        "0 10px 35px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {member.userInterest}
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ContainedButton
            href="/chatting"
            style={{
              borderRadius: "1rem",
              maxWidth: "24rem",
              width: "90%",
              zIndex: "2",
            }}
          >
            채팅방 입장하기
          </ContainedButton>
        </div>
      </div>
    </>
  );
}
export default Matching;
