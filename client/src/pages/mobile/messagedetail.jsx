import React, { useEffect, useState, useRef } from "react";
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

const Messagedetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const roomId = params.id;
  const [targetNickName, setTargetNickName] = useState("");
  const senderId = useSelector((state) => state.mobileInfo.loginId);
  // const [room, setRoom] = useState({});
  const [messageStorage, setMessageStorage] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

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
    fetchMessage();
    connect();
  }, [roomId, senderId]);

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

  const connect = () => {
    const ws = Stomp.over(new SockJS("/ws/chat"));
    wsRef.current = ws; // Save the WebSocket object in the ref
    ws.connect(
      {},
      function (frame) {
        ws.subscribe("/topic/chat/room/" + roomId, function (message) {
          console.log("message 리스트??");
          // console.log(message);
          const recv = JSON.parse(message.body);
          recvMessage(recv);
        });
        ws.send(
          "/app/chat/message",
          {},
          JSON.stringify({ type: "ENTER", roomId: roomId, senderId: senderId })
        );
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
      <div
        style={{
          height: "600px",
        }}
      >
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back onClick={handleBackToListClick} />
            <ConversationHeader.Content userName={targetNickName} info="" />
          </ConversationHeader>
          <MessageList>
            {messageStorage.length === 0 ? (
              <MessageSeparator content="대화를 시작해주세요" />
            ) : (
              messageStorage.map((message, index) => (
                <Message
                  key={index}
                  model={{
                    message: message.message,
                    sender: message.loginId,
                    direction: message.loginId === senderId ? "outgoing" : "incoming",
                    position: "single",
                  }}
                >
                  <Message.Footer
                    sender={
                      message.senderId === senderId ? "" : formatDateTime(message.createdDate)
                    }
                    sentTime={
                      message.senderId === senderId ? formatDateTime(message.createdDate) : ""
                    }
                  />
                </Message>
              ))
            )}

            {messages.map((message, index) =>
              message.type === "ENTER" ? null : ( // <MessageSeparator key={index} content={message.message} as="h2" />
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
                    sender={
                      message.senderId === senderId
                        ? ""
                        : new Date().toLocaleTimeString("ko-KR").replace(/:\d+ /, " ")
                    }
                    sentTime={
                      message.senderId === senderId
                        ? new Date().toLocaleTimeString("ko-KR").replace(/:\d+ /, " ")
                        : ""
                    }
                  />
                </Message>
              )
            )}
          </MessageList>
        </ChatContainer>
      </div>
      <Grid container sx={{ pt: "5%" }}>
        <Grid item xs={9}>
          <TextField
            id="outlined-basic"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={3}>
          <Fab color="primary" aria-label="add">
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
    </React.Fragment>
  );
};

export default Messagedetail;
