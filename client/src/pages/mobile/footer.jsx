import React, { useEffect, useState } from "react";
import "./footer.css";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import LocalPostOfficeRoundedIcon from "@mui/icons-material/LocalPostOfficeRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import { useSelector } from "react-redux";
import http from "./../../axios/http";
import Fab from "@mui/material/Fab";

function Footer(props) {
  const navigate = useNavigate();
  const readLength = useSelector((state) => state.mobileInfo.readMessage);
  const loginId = useSelector((state) => state.mobileInfo.loginId);
  const [disting, setDisting] = useState("");

  const handleOpenParkinglotPage = () => {
    // 주차현황페이지로 이동
    navigate("/Mobile/Parkinglot");
  };
  const handleOpenMycarPage = () => {
    // 내 주차현황 페이지로 이동
    navigate("/Mobile/Mycar");
  };
  const handleOpenTermessagePage = () => {
    // 대화방 페이지로 이동
    navigate("/Mobile/Termessage");
  };
  const handleOpenAccountPage = () => {
    // 마이페이지로 이동
    navigate("/Mobile/Account");
  };

  useEffect(() => {
    // fetchMessage();
  }, []);

  async function fetchMessage() {
    await http
      .get(`/chat/room/${loginId}/3a21cd93-f68c-430b-9cab-ec30e3e678a5`)
      .then((response) => {
        console.log("채팅방 상세조회");
        console.log(response.data.response);
        const messageList = response.data.response.messageList;

        if (messageList.length === 0) {
          return;
        }
        const length = messageList.length;

        if (length > readLength) {
          const temp = length - readLength;
          setDisting(temp);
          console.log(temp);
        }
      })
      .catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("Error while submitting:", error);
      });
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          width: "100%",
          height: "4.5rem",
          position: "fixed",
          bottom: 0,
          boxShadow: "0 -2px 5px #cccccc",
          border: "none",
          backgroundColor: "white",
          // borderTop: "1px solid black",
        }}
      >
        <div className="footer-container">
          <div className="home-container" style={{ width: "3.6rem" }}>
            <HomeRoundedIcon
              sx={{
                fontSize: "2.3rem",
                color: props.HomeiconColor ? props.HomeiconColor : "#c0c0c0",
              }}
              onClick={handleOpenParkinglotPage}
            />
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: props.HomeiconColor ? props.HomeiconColor : "#c0c0c0",
              }}
            >
              home
            </Typography>
          </div>

          <div className="car-container" style={{ width: "3.6rem" }}>
            <DirectionsCarFilledRoundedIcon
              sx={{
                fontSize: "2.3rem",
                color: props.MycariconColor ? props.MycariconColor : "#c0c0c0",
              }}
              onClick={handleOpenMycarPage}
            />
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: props.MycariconColor ? props.MycariconColor : "#c0c0c0",
              }}
            >
              car
            </Typography>
          </div>

          <div className="message-container" style={{ width: "3.6rem" }}>
            {/* <Fab
              sx={{
                width: "1.2rem",
                height: "1rem",
                backgroundColor: "blue",
                color: "white",
                position: "relative",
                bottom: "1.8rem",
                left: "2.8rem",
              }}
            >
              <Typography>{disting}</Typography>
            </Fab> */}
            <LocalPostOfficeRoundedIcon
              sx={{
                fontSize: "2.3rem",
                color: props.TermessageiconColor ? props.TermessageiconColor : "#c0c0c0",
              }}
              onClick={handleOpenTermessagePage}
            />
            <Typography
              sx={{
                fontSize: "0.9rem",
                color: props.TermessageiconColor ? props.TermessageiconColor : "#c0c0c0",
              }}
            >
              message
            </Typography>
          </div>

          <div className="mypage-container" style={{ width: "3.6rem" }}>
            <ManageAccountsRoundedIcon
              sx={{
                fontSize: "2.3rem",
                color: props.AccounticonColor ? props.AccounticonColor : "#c0c0c0",
              }}
              onClick={handleOpenAccountPage}
            />
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: props.AccounticonColor ? props.AccounticonColor : "#c0c0c0",
              }}
            >
              my page
            </Typography>
          </div>
        </div>
      </Box>
    </React.Fragment>
  );
}

export default Footer;
