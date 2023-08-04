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

const Messagedetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const roomId = params.id;
  const sender = useSelector((state) => state.mobileInfo.loginId);
  // const [room, setRoom] = useState({});
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
    connect();
  }, [roomId, sender]);

  const connect = () => {
    const ws = Stomp.over(new SockJS("/ws/chat"));
    wsRef.current = ws; // Save the WebSocket object in the ref
    ws.connect(
      {},
      function (frame) {
        ws.subscribe("/topic/chat/room/" + roomId, function (message) {
          console.log("message 리스트??");
          console.log(message);
          const recv = JSON.parse(message.body);
          recvMessage(recv);
        });
        ws.send(
          "/app/chat/message",
          {},
          JSON.stringify({ type: "ENTER", roomId: roomId, sender: sender })
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

  const sendMessage = () => {
    const ws = Stomp.over(new SockJS("/ws/chat"));
    ws.connect({}, function () {
      ws.send(
        "/app/chat/message",
        {},
        JSON.stringify({
          type: "TALK",
          roomId: roomId,
          sender: sender,
          message: message,
        })
      );
    });
    setMessage("");
  };

  const recvMessage = (recv) => {
    console.log(recv);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: recv.type,
        sender: recv.type === "ENTER" ? "[알림]" : recv.sender,
        message: recv.message,
      },
    ]);
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
            <Avatar name="Joe" />
            <ConversationHeader.Content userName="Joe" info="Active 10 mins ago" />
          </ConversationHeader>
          <MessageList typingIndicator={<TypingIndicator content="Emily is typing" />}>
            <MessageSeparator content="Saturday, 30 November 2019" />
            <Message
              model={{
                message: "Hello my friend1",
                sentTime: "15 mins ago",
                sender: "Emily",
                direction: "incoming",
                position: "first",
              }}
            >
              <Avatar />
            </Message>

            <Message
              model={{
                message: "Hello my friend2",
                sentTime: "15 mins ago",
                sender: "Emily",
                direction: "incoming",
                position: "normal",
              }}
            >
              <Avatar />
            </Message>

            <Message
              model={{
                message: "Hello my friend3",
                sentTime: "15 mins ago",
                direction: "outgoing",
                position: "first",
              }}
            >
              <Avatar />
            </Message>

            <MessageSeparator content="Saturday, 31 November 2019" />

            {messages.map((message, index) => (
              <Message
                key={index}
                model={{
                  message: message.message,
                  sentTime: "15 mins ago",
                  sender: message.sender,
                  direction: "outgoing",
                  position: "first",
                }}
              >
                <Avatar />
              </Message>
            ))}
          </MessageList>

          {/* <MessageInput
            placeholder="Type message here"
            onChange={handleChange}
            onAttachClick={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          /> */}
        </ChatContainer>
      </div>
      <Grid container>
        <Grid item xs={9}>
          <TextField
            id="outlined-basic"
            value={message}
            onChange={handleMessageChange}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={3}>
          <SendIcon onClick={sendMessage} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Messagedetail;
