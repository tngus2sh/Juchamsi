import React, { useState, useEffect } from "react";
import "./termessage.css";
import Footer from "./footer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ImageIcon from "@mui/icons-material/Image";
import WorkIcon from "@mui/icons-material/Work";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { ConversationList, Conversation, Avatar } from "@chatscope/chat-ui-kit-react";
import http from "../../axios/http";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
// import { setUser1, setUser2, setRoomNumber } from "../../redux/chatInfo";
import PersonIcon from "@mui/icons-material/Person";
import { Typography } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { setChatingRoomId, setReadMessage } from "../../redux/mobileUserinfo";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function Termessage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginId = useSelector((state) => state.mobileInfo.loginId);
  // const targetId; 겹주차 발생 차주에게 보내기!!

  const [chatRooms, setChatRooms] = useState([]);
  const [disting, setDisting] = useState(0);

  const getDisting = (d) => {
    setDisting(d);
    console.log(d);
  };
  // const [lastMessageContent, setLastMessageContent] = useState([]);
  // const [lastMessageTime, setLastMessageTime] = useState([]);
  // const [toNickName, setToNickName] = useState([]);

  useEffect(() => {
    if (loginId === "") {
      navigate("/Mobile/Login");
    }
    findAllRoom();
  }, []);

  const findAllRoom = async () => {
    await http
      .get(`/chat/rooms/${loginId}`)
      .then((response) => {
        console.log("대화방 리스트");
        console.log(response.data.response);
        for (const item of response.data.response) {
          fetchMessage(item.roomId);
        }
      })
      .catch((error) => {
        console.error("Error while fetching chat rooms:", error);
      });
  };

  async function fetchMessage(roomId) {
    await http
      .get(`/chat/room/${loginId}/${roomId}`)
      .then((response) => {
        console.log("채팅방 상세조회");
        console.log(response.data);

        const messageList = response.data.response.messageList;

        const lastMessage = messageList.length !== 0 ? messageList[messageList.length - 1] : 0;

        setChatRooms((prevChatRoomInfos) => [
          ...prevChatRoomInfos,
          {
            roomId: response.data.response.roomId,
            roomName: response.data.response.roomName,
            toNickName: response.data.response.nickName,
            lastMessageContent: lastMessage === 0 ? "" : lastMessage.message,
            lastMessageTime: lastMessage === 0 ? "" : lastMessage.createdDate,
          },
        ]);
      })
      .catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("Error while submitting:", error);
      });
  }

  // const createRoom = () => {
  //   http
  //     .post("/chat/room", { userIdOne: loginId, userIdTwo: "user2" })
  //     .then((response) => {
  //       console.log(response.data.response.roomId);
  //       // // redux에 담음
  //       // dispatch(setRoomNumber(response.data.response.roomId)); // 룸 넘버
  //       // dispatch(setUser1(loginId)); // 로그인 한 유저

  //       alert(`${response.data.response.roomName} 방 개설에 성공하였습니다.`);
  //       dispatch(setReadMessage(""));
  //       dispatch(setChatingRoomId(response.data.response.roomId));
  //       findAllRoom();
  //     })
  //     .catch((error) => {
  //       alert("채팅방 개설에 실패하였습니다.");
  //       console.error("Error while creating chat room:", error);
  //     });
  // };

  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const amOrPm = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${amOrPm} ${formattedHours}:${formattedMinutes}`;
  };

  const enterRoom = (roomId, roomName) => {
    if (roomName === "주참시") {
      navigate(`system/${roomId}`);
    } else {
      navigate(`${roomId}`);
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ p: "0.8rem" }}>
        <Typography sx={{ textAlign: "start", fontFamily: "Poppins-Bold", fontSize: "2.1rem" }}>
          Messages
        </Typography>
      </Box>
      <Divider />
      <div
        style={{
          height: "60vh",
        }}
      >
        <List sx={{ width: "100%", p: "0" }}>
          {chatRooms.map((item, index) =>
            item.roomName === "주참시" ? (
              <React.Fragment key={item.roomId}>
                <ListItem
                  sx={{
                    "&:active": {
                      backgroundColor: "#CACACA",
                    },
                    pt: 0,
                  }}
                  onClick={() => enterRoom(item.roomId, item.roomName)}
                >
                  <ListItemText
                    primary="시스템"
                    secondary={item.lastMessageContent}
                    sx={{ height: "4rem", color: "#EE1D52" }}
                  />
                  <ListItemAvatar>
                    <div style={{ display: "flex", marginBottom: "1.2rem", justifyContent: "end" }}>
                      <Typography sx={{ fontSize: ".8rem" }}>
                        {item.lastMessageTime ? formatDateTime(item.lastMessageTime) : ""}
                      </Typography>
                      <ArrowForwardIosIcon sx={{ height: "1rem" }} />
                    </div>
                  </ListItemAvatar>
                </ListItem>
                <Divider />
              </React.Fragment>
            ) : (
              <React.Fragment key={item.roomId}>
                <ListItem
                  sx={{
                    "&:active": {
                      backgroundColor: "#CACACA",
                    },
                    pt: 0,
                  }}
                  onClick={() => enterRoom(item.roomId, item.roomName)}
                >
                  <ListItemText
                    primary={item.toNickName}
                    secondary={item.lastMessageContent}
                    sx={{ height: "4rem", color: disting > 0 ? "" : "rgb(150, 150, 150)" }}
                  />
                  {disting > 0 ? (
                    <FiberManualRecordIcon
                      sx={{
                        width: ".5rem",
                        height: ".5rem",
                        color: "blue",
                        position: "fixed",
                        left: "8rem",
                        top: "4rem",
                      }}
                    />
                  ) : (
                    ""
                  )}

                  <ListItemAvatar>
                    <div style={{ display: "flex", marginBottom: "1.2rem", justifyContent: "end" }}>
                      <Typography
                        sx={{
                          fontSize: ".8rem",
                          color: disting > 0 ? "black" : "rgb(150, 150, 150)",
                        }}
                      >
                        {item.lastMessageTime ? formatDateTime(item.lastMessageTime) : ""}
                      </Typography>
                      <ArrowForwardIosIcon
                        sx={{
                          height: "1rem",
                          color: disting > 0 ? "" : "rgb(150, 150, 150)",
                        }}
                      />
                    </div>
                  </ListItemAvatar>
                </ListItem>
                <Divider />
              </React.Fragment>
            )
          )}
        </List>
      </div>
      {/* // <ConversationList key={item.roomId}>
          //   <Conversation
          //     name={item.roomName}
          //     lastSenderName=""
          //     info={""}
          //     onClick={() => enterRoom(item.roomId)}
          //   >
          //     <Avatar>
          //       <PersonIcon sx={{ width: "100%", height: "100px" }} />
          //     </Avatar>
          //   </Conversation>
          // </ConversationList> */}

      {/* <Button className="btn btn-primary" type="button" onClick={createRoom}>
        채팅방 개설
      </Button> */}
      <Footer TermessageiconColor="#006DD1" getDisting={getDisting} />
    </React.Fragment>
  );
}

export default Termessage;
