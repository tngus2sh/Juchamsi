import React, { useEffect, useState, useRef } from "react";
import "./messagedetail.css";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import { Grid, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  ConversationHeader,
  MainContainer,
  VoiceCallButton,
  InfoButton,
  VideoCallButton,
  MessageSeparator,
  ChatContainer,
  MessageList,
  Message,
  TypingIndicator,
  MessageInput,
  Avatar,
} from "@chatscope/chat-ui-kit-react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import http from "./../../axios/http";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import SendIcon from "@mui/icons-material/Send";
import Fab from "@mui/material/Fab";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { isToday, isSameDay, format } from "date-fns";
import { setReadMessage } from "../../redux/mobileUserinfo";

const Messagedetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const roomId = params.id;
  const [targetNickName, setTargetNickName] = useState("");
  const senderId = useSelector((state) => state.mobileInfo.loginId);
  const readLength = useSelector((state) => state.mobileInfo.readMessage);
  const totalLength = useSelector((state) => state.mobileInfo.totalMessage);
  // const [room, setRoom] = useState({});
  const [messageStorage, setMessageStorage] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  let prevDate = null;

  const handleMessageChange = (e) => {
    console.log(e.target.value);
    setMessage(e.target.value);
  };

  const handleBackToListClick = () => {
    navigate("/Mobile/Termessage");
  };

  // useEffect(() => {
  //   // setRoomId(localStorage.getItem('wschat.roomId'));
  //   // setSender(localStorage.getItem('wschat.sender'));

  //   findRoom();
  // }, []);

  useEffect(() => {
    // setScreenSize();
    // fetchMessage();
    fetchMessage();
    connect();
  }, [roomId, senderId]);

  useEffect(() => {
    const total = messageStorage.length + messages.length;
    console.log("totalMessage");
    console.log(total);
    console.log("readMessage");
    console.log(readLength);
    if (total >= readLength - 1) {
      dispatch(setReadMessage(total));
    }
    console.log("ㅁㄴ일마 ㅡ라ㅣㅁㄴ우ㅏㅣㄻ니람ㄴ아ㅣㄻㄴ림ㄴㄹ");
  }, [messages.length]);

  async function fetchMessage() {
    await http
      .get(`/chat/room/${senderId}/${roomId}`)
      .then((response) => {
        console.log("채팅방 상세조회");
        console.log(response.data);
        setTargetNickName(response.data.response.nickName);
        setMessageStorage(response.data.response.messageList);
      })
      .catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("Error while submitting:", error);
      });
  }

  const fetchData = () => {
    console.log("이랴랴랴랴: " + totalLength);
    console.log("totalMessage");
    console.log(totalLength);
    console.log("readMessage");
    console.log(readLength);
    if (totalLength >= readLength - 1) {
      dispatch(setReadMessage(totalLength));
      console.log("수행했다");
    }
  };

  const connect = () => {
    console.log("여긴가?");
    const ws = Stomp.over(new SockJS("/ws/chat"));
    console.log(ws);
    wsRef.current = ws; // Save the WebSocket object in the ref
    ws.connect(
      {},
      function (frame) {
        ws.subscribe("/topic/api/chat/room/" + roomId, function (message) {
          console.log("message 리스트??");
          fetchData();
          // console.log(messageStorage.length);
          const recv = JSON.parse(message.body);
          recvMessage(recv);
        });
        fetchData();
        // ws.send(
        //   "/app/chat/message",
        //   {},
        //   JSON.stringify({ type: "ENTER", roomId: roomId, senderId: senderId })
        // );
      },
      function (error) {
        console.log("Connection error:", error);
      }
    );
  };

  // const findRoom = () => {
  //   http
  //     .get("/chat/room/" + roomId)
  //     .then((response) => {
  //       console.log(response.data);
  //       setRoom(response.data.response.roomId);
  //     })
  //     .catch((error) => {
  //       alert("오류.");
  //       console.error("Error while entering chat room:", error);
  //     });
  // };

  const recvMessage = (recv) => {
    console.log(recv);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: recv.type,
        senderId: recv.senderId,
        message: recv.message,
      },
    ]);
  };

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.connected) {
      wsRef.current.send(
        "/app/chat/message",
        {},
        JSON.stringify({
          type: "TALK",
          roomId: roomId,
          senderId: senderId,
          message: message,
        }),
        () => {
          setMessage("");
        }
      );
    } else {
      console.log("WebSocket is not connected."); // 연결이 수립되지 않았을 경우 로그 출력
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (message.trim() !== "") {
        sendMessage();
        setMessage("");
      }
    }
  };

  const CurrentDate = (props) => {
    const createDate = new Date(props.createdDate);

    if (!isSameDay(createDate, prevDate)) {
      prevDate = createDate;

      return <MessageSeparator content={format(createDate, "yyyy년 MM월 dd일")} />;
    }
  };

  // message.createdDate를 원하는 형식으로 변환하는 함수
  const formatDateTime = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const amOrPm = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${amOrPm} ${formattedHours}:${formattedMinutes}`;
  };

  return (
    <React.Fragment>
      <div className="message-detail-main-container">
        <div className="message-detail-main-flex-container">
          <div className="message-detail-header-container">
            <Box
              sx={{
                width: "100%",
                height: "3.5rem",
              }}
            >
              <Grid
                container
                sx={{ justifyContent: "center", height: "3.5rem", alignContent: "center" }}
              >
                <ArrowBackIosRoundedIcon
                  sx={{
                    position: "fixed",
                    top: "1.5rem",
                    left: "1.2rem",
                    width: "1.5rem",
                    height: "1.5rem",
                  }}
                  onClick={handleBackToListClick}
                />
                <Typography sx={{ marginTop: "1rem", fontSize: "1.3rem", fontWeight: "bold" }}>
                  {targetNickName}
                </Typography>
              </Grid>
            </Box>
          </div>
          <div className="message-detail-content-container" style={{ flex: "1 0 auto" }}>
            <ChatContainer className="custom-chat-container">
              <MessageList className="cs-message-list">
                {messageStorage.length === 0 && messages.length < 1 ? (
                  <MessageSeparator content="대화를 시작해주세요" />
                ) : (
                  messageStorage.map((message, index) => (
                    <React.Fragment key={index}>
                      <CurrentDate createdDate={message.createdDate} />
                      <Message
                        className="cs-message"
                        model={{
                          message: message.message,
                          sender: message.loginId,
                          direction: message.loginId === senderId ? "outgoing" : "incoming",
                          position: "single",
                        }}
                        style={{ color: "white" }}
                      >
                        <Message.Footer
                          sender={
                            message.loginId === senderId ? "" : formatDateTime(message.createdDate)
                          }
                          sentTime={
                            message.loginId === senderId ? formatDateTime(message.createdDate) : ""
                          }
                        />
                      </Message>
                    </React.Fragment>
                  ))
                )}

                {messages.map((message, index) =>
                  message.type === "ENTER" ? null : ( // <MessageSeparator key={index} content={message.message} as="h2" />
                    <React.Fragment key={index}>
                      <CurrentDate createdDate={new Date()} />
                      <Message
                        model={{
                          message: message.message,
                          sender: message.senderId,
                          direction: message.senderId === senderId ? "outgoing" : "incoming",
                          position: "single",
                        }}
                      >
                        <Message.Footer
                          sender={
                            message.senderId === senderId
                              ? ""
                              : new Date().toLocaleTimeString("ko-KR").replace(/:\d+$/, "")
                          }
                          sentTime={
                            message.senderId === senderId
                              ? new Date().toLocaleTimeString("ko-KR").replace(/:\d+$/, "")
                              : ""
                          }
                        />
                      </Message>
                    </React.Fragment>
                  )
                )}
              </MessageList>
            </ChatContainer>
          </div>
          <div className="message-detail-footer-container">
            <Grid
              container
              sx={{
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                width: "100%",
                height: "4.9rem",
                // position: "fixed",
                // bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                backgroundColor: "white",
              }}
            >
              <Grid item sx={{ flex: 1, p: ".3rem" }}>
                <input
                  style={{
                    width: "95%",
                    padding: ".31rem",
                    paddingLeft: ".8rem",
                    height: "2rem",
                    borderRadius: "200px",
                    border: "none",
                    backgroundColor: "#f0f0f0",
                    outline: "none",
                  }}
                  value={message}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyDown}
                />
              </Grid>
              <Grid item sx={{ p: ".5rem" }}>
                <Fab color="primary" sx={{ width: "2.8rem", height: "2.8rem" }} aria-label="add">
                  <SendIcon
                    onClick={() => {
                      if (message.trim() !== "") {
                        sendMessage();
                        setMessage("");
                      }
                    }}
                  />
                </Fab>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>

      {/* <Box
        sx={{
          width: "100%",
          height: "3.3rem",
          position: "fixed",
          top: 0,
        }}
      >
        <Grid container sx={{ justifyContent: "center", height: "3.3rem", alignContent: "center" }}>
          <ArrowBackIosRoundedIcon
            sx={{
              position: "fixed",
              top: "1.5rem",
              left: "1.2rem",
              width: "1.5rem",
              height: "1.5rem",
            }}
            onClick={handleBackToListClick}
          />
          <Typography sx={{ marginTop: "1rem", fontSize: "1.3rem", fontWeight: "bold" }}>{targetNickName}</Typography>
        </Grid>
      </Box>
      <div
        style={{
          marginTop: "3.3rem",
          marginBottom: "4.9rem",
          height: "calc(100vh - 8.2rem)",
        }}
      >
        <ChatContainer className="custom-chat-container">
          <MessageList className="cs-message-list">
            {messageStorage.length === 0 && messages.length === 0 ? (
              <MessageSeparator content="대화를 시작해주세요" />
            ) : (
              messageStorage.map((message, index) => (
                <React.Fragment key={index}>
                  <CurrentDate createdDate={message.createdDate} />
                  <Message
                    className="cs-message"
                    model={{
                      message: message.message,
                      sender: message.loginId,
                      direction: message.loginId === senderId ? "outgoing" : "incoming",
                      position: "single",
                    }}
                    style={{ color: "white" }}
                  >
                    <Message.Footer
                      sender={message.loginId === senderId ? "" : formatDateTime(message.createdDate)}
                      sentTime={message.loginId === senderId ? formatDateTime(message.createdDate) : ""}
                    />
                  </Message>
                </React.Fragment>
              ))
            )}

            {messages.map((message, index) =>
              message.type === "ENTER" ? null : ( // <MessageSeparator key={index} content={message.message} as="h2" />
                <React.Fragment>
                  <CurrentDate createdDate={new Date()} />
                  <Message
                    key={index}
                    model={{
                      message: message.message,
                      sender: message.senderId,
                      direction: message.senderId === senderId ? "outgoing" : "incoming",
                      position: "single",
                    }}
                  >
                    <Message.Footer
                      sender={message.senderId === senderId ? "" : new Date().toLocaleTimeString("ko-KR").replace(/:\d+$/, "")}
                      sentTime={message.senderId === senderId ? new Date().toLocaleTimeString("ko-KR").replace(/:\d+$/, "") : ""}
                    />
                  </Message>
                </React.Fragment>
              )
            )}
          </MessageList>
        </ChatContainer>
      </div>
      <Grid
        container
        sx={{
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          width: "100%",
          height: "4.9rem",
          position: "fixed",
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          backgroundColor: "white",
        }}
      >
        <Grid item sx={{ flex: 1, p: ".3rem" }}>
          <input
            style={{
              width: "95%",
              padding: ".31rem",
              paddingLeft: ".8rem",
              height: "2rem",
              borderRadius: "200px",
              border: "none",
              backgroundColor: "#f0f0f0",
              outline: "none",
            }}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
          />
        </Grid>
        <Grid item sx={{ p: ".5rem" }}>
          <Fab color="primary" sx={{ width: "2.8rem", height: "2.8rem" }} aria-label="add">
            <SendIcon
              onClick={() => {
                if (message.trim() !== "") {
                  sendMessage();
                  setMessage("");
                  console.log(messageLength);
                }
              }}
            />
          </Fab>
        </Grid>
      </Grid> */}
    </React.Fragment>
  );
};

export default Messagedetail;
