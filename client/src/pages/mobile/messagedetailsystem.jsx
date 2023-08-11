import React, { useEffect, useState, useRef } from "react";
import "./messagedetailsystem.css";
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

const MessageDetailSystem = () => {
  const navigate = useNavigate();
  const params = useParams();
  const roomId = params.id;
  const senderId = useSelector((state) => state.mobileInfo.loginId);
  const [systemMessageStorage, setSystemMessageStorage] = useState([]);

  useEffect(() => {
    fetchSystemMessage();
  }, []);

  async function fetchSystemMessage() {
    await http
      .get(`/chat/room/${senderId}/${roomId}`)
      .then((response) => {
        console.log("채팅방 상세조회");
        console.log(response.data);
        setSystemMessageStorage(response.data.response.messageList);
      })
      .catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("Error while submitting:", error);
      });
  }

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

  const handleBackToListClick = () => {
    navigate("/Mobile/Termessage");
  };

  return (
    <React.Fragment>
      <Box
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
          <Typography sx={{ marginTop: "1rem", fontSize: "1.3rem", fontWeight: "bold" }}>
            시스템
          </Typography>
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
            {systemMessageStorage.length === 0 ? (
              <MessageSeparator content="대화를 시작해주세요" />
            ) : (
              systemMessageStorage.map((message, index) => (
                <Message
                  className="cs-message"
                  key={index}
                  model={{
                    message: message.message,
                    sender: message.loginId,
                    direction: "incoming",
                    position: "single",
                  }}
                  style={{ color: "white" }}
                >
                  <Message.Footer
                    sender={formatDateTime(message.createdDate)}
                    // sentTime={
                    //   message.loginId === senderId ? formatDateTime(message.createdDate) : ""
                    // }
                  />
                </Message>
              ))
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
              width: "90%",
              padding: ".31rem",
              paddingLeft: "1.2rem",
              height: "2rem",
              borderRadius: "200px",
              border: "none",
              backgroundColor: "#f0f0f0",
              fontSize: ".8rem",
              outline: "none",
            }}
            value="메시지를 보낼 수 없는 채팅방입니다."
            disabled
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default MessageDetailSystem;
