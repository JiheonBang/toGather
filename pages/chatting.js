import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import moment from "moment";

import { authService, dbService } from "../firebase/initFirebase";
import Navbar from "../components/navbar";
import { ContainedButton } from "../components/styledButton";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Router } from "next/router";

function Chatting() {
  const router = useRouter();
  const dDay = moment(Date.now()).format("YY/MM/DD");

  const [currentUser, setCurrentUser] = useState();
  const [isMatching, setIsMatching] = useState(true);
  const [userGroupNum, setUserGroupNum] = useState();
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [groupMembersInfo, setGroupMembersInfo] = useState([]);

  if (!isMatching) {
    router.push("./main");
  }

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
              if (doc.data().groupNum > 0) {
                setUserGroupNum(doc.data().groupNum);
              } else {
                setIsMatching(false);
              }
            }
          } else {
            setIsMatching(false);
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
    const chats = [];
    if (userGroupNum) {
      dbService
        .collection("userChat")
        .orderBy("sentAt")
        .onSnapshot((snapshot) => {
          snapshot.docs.map((doc) => {
            if (doc.data().meetingDay === dDay) {
              if (userGroupNum === doc.data().groupNum) {
                chats.push(doc.data());
              }
            }
          });
          setGroupChats(chats);
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

  const [newChat, setNewChat] = useState();
  const chatChange = (e) => {
    setNewChat(e.target.value);
  };

  const chatSubmit = (e) => {
    e.preventDefault();
    setNewChat("");
    dbService.collection("userChat").add({
      chatContent: newChat,
      sentAt: Date.now(),
      userId: currentUser.uid,
      groupNum: userGroupNum,
      meetingDay: dDay,
    });
  };

  const messageBoxRef = useRef();
  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [groupChats]);

  const getChattings = () => {
    let rawChattings = [];

    if (groupMembersInfo.length === 2) {
      groupChats.map((item) => {
        item.userId && item.userId === currentUser.uid
          ? rawChattings.push({ ...item, type: "mychat", nickName: "나" })
          : item.userId && item.userId === groupMembersInfo[0].userId
          ? rawChattings.push({
              ...item,
              type: "member1",
              nickName: groupMembersInfo[0].userNickName,
            })
          : item.userId && item.userId === groupMembersInfo[1].userId
          ? rawChattings.push({
              ...item,
              type: "member2",
              nickName: groupMembersInfo[1].userNickName,
            })
          : null;
      });
    } else if (groupMembersInfo.length === 3) {
      groupChats.map((item) => {
        item.userId && item.userId === currentUser.uid
          ? rawChattings.push({ ...item, type: "mychat", nickName: "나" })
          : item.userId && item.userId === groupMembersInfo[0].userId
          ? rawChattings.push({
              ...item,
              type: "member1",
              nickName: groupMembersInfo[0].userNickName,
            })
          : item.userId && item.userId === groupMembersInfo[1].userId
          ? rawChattings.push({
              ...item,
              type: "member2",
              nickName: groupMembersInfo[1].userNickName,
            })
          : item.userId && item.userId === groupMembersInfo[2].userId
          ? rawChattings.push({
              ...item,
              type: "member3",
              nickName: groupMembersInfo[2].userNickName,
            })
          : null;
      });
    }

    return (
      <>
        {groupChats.length !== 0 ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "24rem",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "60vh",
                  overflow: "scroll",
                }}
                ref={messageBoxRef}
              >
                {rawChattings.map((item) => (
                  <div key={item.sentAt} className={`block_${item.type}`}>
                    <div
                      style={{
                        margin: "10px 15px -10px 15px",
                        fontSize: "80%",
                        color: "#afafaf",
                      }}
                    >
                      {item.nickName}
                    </div>
                    <div className={item.type}>{item.chatContent}</div>
                    <div
                      style={{
                        margin: "-10px 15px 0px 15px",
                        fontSize: "80%",
                        color: "#afafaf",
                      }}
                    >
                      {moment(item.sentAt).format("MM/DD HH:mm")}
                    </div>
                  </div>
                ))}
              </Box>
            </div>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={chatSubmit}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                maxWidth: "24rem",
                width: "93%",
                backgroundColor: "white",
              }}
            >
              <TextField
                required
                name="chatContent"
                id="chatContent"
                value={newChat}
                onChange={chatChange}
                size="small"
                fullWidth
              />
              <ContainedButton
                type="submit"
                sx={{ padding: "0.5rem 0", fontSize: "100%" }}
              >
                전송
              </ContainedButton>
            </Box>
          </>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: "24rem",
                width: "95%",
              }}
            >
              <h2 style={{ marginTop: "10vh", color: "#afafaf" }}>
                아직 메시지가 없습니다.
              </h2>
              <h4
                style={{
                  marginTop: "-1vh",
                  marginBottom: "-3vh",
                  color: "#afafaf",
                }}
              >
                메시지를 보내보세요!
              </h4>
            </div>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={chatSubmit}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                maxWidth: "24rem",
                width: "93%",
                backgroundColor: "white",
                marginTop: "50vh",
              }}
            >
              <TextField
                required
                name="chatContent"
                id="chatContent"
                value={newChat}
                onChange={chatChange}
                size="small"
                fullWidth
              />
              <ContainedButton
                type="submit"
                sx={{ padding: "0.5rem 0", fontSize: "100%" }}
              >
                전송
              </ContainedButton>
            </Box>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Chatting | toGather</title>
      </Head>
      <Navbar />

      <div
        style={{
          paddingBottom: "5rem",
        }}
      >
        <div style={{ padding: "1rem 2rem" }}>
          <h2 style={{ paddingTop: "3rem", fontWeight: "400" }}>
            {moment(Date.now()).format("YYYY년 MM월 DD일")}
          </h2>
          <div
            style={{
              backgroundColor: "#FFE9B0",
              width: "12.5rem",
              height: "0.8rem",
              margin: "-2.1rem 0 1.5rem -0.4rem ",
              zIndex: "-100",
            }}
          />
          <div>채팅방은 위 날짜 자정에 자동 소멸됩니다.</div>
        </div>
        <div
          style={{
            backgroundColor: "#202023",
            width: "100%",
            height: "0.1rem",
            zIndex: "-100",
          }}
        />
        {getChattings()}
      </div>
    </>
  );
}

export default Chatting;
