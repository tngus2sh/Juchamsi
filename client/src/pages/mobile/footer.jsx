import React from "react";
import "./footer.css";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TextsmsIcon from "@mui/icons-material/Textsms";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import LocalPostOfficeRoundedIcon from "@mui/icons-material/LocalPostOfficeRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";

function Footer(props) {
  const navigate = useNavigate();

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
          // borderTop: "1px solid black",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="footer-container">
          <div className="home-container" style={{ width: "3.6rem" }}>
            <HomeRoundedIcon sx={{ fontSize: "2.3rem", color: props.HomeiconColor ? props.HomeiconColor : "#c0c0c0" }} onClick={handleOpenParkinglotPage} />
            <Typography sx={{ fontSize: "0.9rem", color: props.HomeiconColor ? props.HomeiconColor : "#c0c0c0" }}>home</Typography>
          </div>

          <div className="car-container" style={{ width: "3.6rem" }}>
            <DirectionsCarFilledRoundedIcon sx={{ fontSize: "2.3rem", color: props.MycariconColor ? props.MycariconColor : "#c0c0c0" }} onClick={handleOpenMycarPage} />
            <Typography sx={{ fontSize: "0.9rem", color: props.MycariconColor ? props.MycariconColor : "#c0c0c0" }}>car</Typography>
          </div>

          <div className="message-container" style={{ width: "3.6rem" }}>
            <LocalPostOfficeRoundedIcon sx={{ fontSize: "2.3rem", color: props.TermessageiconColor ? props.TermessageiconColor : "#c0c0c0" }} onClick={handleOpenTermessagePage} />
            <Typography sx={{ fontSize: "0.9rem", color: props.TermessageiconColor ? props.TermessageiconColor : "#c0c0c0" }}>message</Typography>
          </div>

          <div className="mypage-container" style={{ width: "3.6rem" }}>
            <ManageAccountsRoundedIcon sx={{ fontSize: "2.3rem", color: props.AccounticonColor ? props.AccounticonColor : "#c0c0c0" }} onClick={handleOpenAccountPage} />
            <Typography sx={{ fontSize: "0.8rem", color: props.AccounticonColor ? props.AccounticonColor : "#c0c0c0" }}>my page</Typography>
          </div>
        </div>
      </Box>
      {/* <img className="footerlogo" src={process.env.PUBLIC_URL + "/img/kiosk/logo1.png"} alt={"title"}></img> */}
    </React.Fragment>
  );
}

export default Footer;
