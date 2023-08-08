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
          height: "5rem",
          position: "fixed",
          bottom: 0,
          backgroundColor: "#112D4E",
        }}
      >
        <div className="footer-container">
          <div className="home-container">
            <HomeRoundedIcon sx={{ fontSize: "2.5rem", color: props.HomeiconColor }} onClick={handleOpenParkinglotPage} />
            <Typography sx={{ fontSize: "0.9rem", color: props.HomeiconColor }}>home</Typography>
          </div>

          <div className="car-container">
            <DirectionsCarFilledRoundedIcon sx={{ fontSize: "2.6rem", color: props.MycariconColor }} onClick={handleOpenMycarPage} />
            <Typography sx={{ fontSize: "0.9rem", color: props.MycariconColor }}>car</Typography>
          </div>

          <div className="message-container">
            <LocalPostOfficeRoundedIcon sx={{ fontSize: "2.4rem", color: props.TermessageiconColor }} onClick={handleOpenTermessagePage} />
            <Typography sx={{ fontSize: "0.9rem", color: props.TermessageiconColor }}>message</Typography>
          </div>

          <div className="mypage-container">
            <ManageAccountsRoundedIcon sx={{ fontSize: "2.5rem", color: props.AccounticonColor }} onClick={handleOpenAccountPage} />
            <Typography sx={{ fontSize: "0.8rem", color: props.AccounticonColor }}>my page</Typography>
          </div>
        </div>
        {/* <Grid container sx={{ color: "white", pt: "10px", pl: "15px", pr: "15px", pb: "4px" }}>
          <Grid item xs={2.25}>
            <HomeIcon sx={{ fontSize: "2.6rem", color: props.HomeiconColor }} onClick={handleOpenParkinglotPage} />
            <Typography sx={{ fontSize: "0.9rem", color: props.HomeiconColor }}>home</Typography>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={2.25}>
            <DirectionsCarIcon sx={{ fontSize: "2.6rem", color: props.MycariconColor }} onClick={handleOpenMycarPage} />
            <Typography sx={{ fontSize: "0.9rem", color: props.MycariconColor }}>car</Typography>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={2.25}>
            <TextsmsIcon sx={{ fontSize: "2.3rem", color: props.TermessageiconColor, mt: "4px" }} onClick={handleOpenTermessagePage} />
            <Typography sx={{ fontSize: "0.9rem", color: props.TermessageiconColor }}>chat</Typography>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={2.25}>
            <ManageAccountsIcon sx={{ fontSize: "2.6rem", color: props.AccounticonColor }} onClick={handleOpenAccountPage} />
            <Typography sx={{ fontSize: "0.9rem", color: props.AccounticonColor }}>my</Typography>
          </Grid>
        </Grid> */}
      </Box>
      {/* <img className="footerlogo" src={process.env.PUBLIC_URL + "/img/kiosk/logo1.png"} alt={"title"}></img> */}
    </React.Fragment>
  );
}

export default Footer;