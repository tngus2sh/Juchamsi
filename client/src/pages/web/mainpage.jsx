import { Box, Button, Container, Divider, Tab } from "@mui/material";
import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import RoomRoundedIcon from "@mui/icons-material/RoomRounded";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import PersonIcon from "@mui/icons-material/Person";
import SellIcon from "@mui/icons-material/Sell";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import HistoryIcon from "@mui/icons-material/History";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResidentManagement from "../../components/main/resident";
import NewTenant from "../../components/main/newTenant";
import UpdateTenant from "../../components/main/updateTenant";
import ParkingLotInfo from "../../components/main/parkingLotInfo";
import ParkingLotHistory from "../../components/main/parkingLotHistory";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../redux/webLoginInfo";
import http from "../../axios/http";
import LogoutIcon from "@mui/icons-material/Logout";

const theme = createTheme({
  palette: {
    mainColor: {
      main: "#2D4356",
    },
  },
});

const mainStep = [
  <ResidentManagement />,
  <NewTenant />,
  <UpdateTenant />,
  <ParkingLotInfo />,
  <ParkingLotHistory />,
];

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.webInfo.isLogin);
  const loginId = useSelector((state) => state.webInfo.id);
  const ownerName = useSelector((state) => state.webInfo.name);
  const roadAddress = useSelector((state) => state.webInfo.roadAddress);
  const villaName = useSelector((state) => state.webInfo.villaName);
  const identification = useSelector((state) => state.webInfo.identification);
  const [open1, setOpen1] = React.useState(true);
  const [open2, setOpen2] = React.useState(true);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const handleClick1 = () => {
    setOpen1(!open1);
  };
  const handleClick2 = () => {
    setOpen2(!open2);
  };

  const handleClick1_1 = () => {
    setActiveIndex(0);
  };

  const handleClick1_2 = () => {
    setActiveIndex(1);
  };

  const handleClick1_3 = () => {
    setActiveIndex(2);
  };
  const handleClick2_1 = () => {
    setActiveIndex(3);
  };
  const handleClick2_2 = () => {
    setActiveIndex(4);
  };

  const handleLogout = () => {
    // 로그아웃 처리
    // 토큰도 없애야댐
    http
      .get(`/owner/logout/${loginId}`)
      .then((response) => {
        alert("로그아웃 되었습니다.");
        //store에 있는 데이터 삭제해야 함!
        dispatch(setLogout());
        // console.log(response.data);
      })
      .catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("Error while submitting:", error);
      });
    navigate("/");
  };
  useEffect(() => {
    if (!isLogin) {
      navigate("/"); // 리다이렉트
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ height: "100vh" }}>
        <Grid item xs={2.5} sx={{ height: "100vh", backgroundColor: "#2D4356" }} maxWidth="lg">
          <Grid container>
            <Grid item xs={1} />
            <Grid item xs={5}>
              <img
                src={`${process.env.PUBLIC_URL}/images/logo2.png`}
                style={{ width: "110px", height: "110px" }}
                alt="Logo"
              />
            </Grid>
            <Grid item xs={5}>
              <Typography style={{ fontSize: "20px", color: "white", marginTop: "40px" }}>
                Owner Page
              </Typography>
            </Grid>
            <Grid item xs={1} />
          </Grid>
          <Divider
            sx={{
              backgroundColor: "#CACACA",
            }}
          />
          <Grid container>
            <Grid item xs={3}>
              <AccountCircleRoundedIcon
                sx={{ fontSize: 50, color: "white", marginTop: "10px", marginLeft: "15px" }}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography
                style={{ fontSize: "13px", color: "white", marginTop: "25px", marginLeft: "10px" }}
              >
                {ownerName}님, 안녕하세요
              </Typography>
            </Grid>
          </Grid>
          <Box>
            <Button sx={{ color: "white", fontSize: ".9rem", mt: ".2rem" }} onClick={handleLogout}>
              로그아웃
              <LogoutIcon sx={{ ml: ".5rem", mb: ".2rem", height: "1.4rem" }} />
            </Button>
          </Box>

          <Grid container>
            <Grid item xs={3}>
              <RoomRoundedIcon
                sx={{ fontSize: 30, color: "white", marginTop: "15px", marginLeft: "15px" }}
              />
            </Grid>
            <Grid item xs={9} sx={{ textAlign: "start" }}>
              <Typography style={{ fontSize: "15px", color: "white", marginTop: "20px" }}>
                빌라정보
              </Typography>
              <Typography style={{ fontSize: "13px", color: "white", marginTop: "10px" }}>
                식별 코드 | {identification}
              </Typography>

              <Typography style={{ fontSize: "13px", color: "white", marginTop: "3px" }}>
                {roadAddress}
              </Typography>
              <Typography style={{ fontSize: "13px", color: "white", marginTop: "3px" }}>
                {villaName}
              </Typography>
            </Grid>
          </Grid>
          <Divider
            sx={{
              marginTop: "10px",
              backgroundColor: "#CACACA",
            }}
          />

          <List
            sx={{ width: "100%", bgcolor: "#2D4356", color: "white", paddingTop: 0 }}
            component="nav"
          >
            <ListItemButton
              onClick={handleClick1}
              sx={{
                fontSize: "10px",
                ...(open1 && { backgroundColor: "rgba(255, 255, 255, 0.1)" }),
              }}
            >
              <ListItemIcon>
                <PersonIcon sx={{ color: "white", fontSize: 30 }} />
              </ListItemIcon>
              <ListItemText
                primary="입주민 관리"
                fontSize={15}
                primaryTypographyProps={{ style: { fontSize: "15px" } }}
              />
              {open1 ? (
                <ExpandLess sx={{ color: "white" }} />
              ) : (
                <ExpandMore sx={{ color: "white" }} />
              )}
            </ListItemButton>
            <Collapse in={open1} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(activeIndex === 0 && { backgroundColor: "rgba(0, 0, 0, 0.15)" }),
                  }}
                  onClick={handleClick1_1}
                >
                  <ListItemIcon>
                    <PersonIcon sx={{ color: "white", fontSize: 25 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="입주민 정보"
                    primaryTypographyProps={{ style: { fontSize: "13px" } }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(activeIndex === 1 && { backgroundColor: "rgba(0, 0, 0, 0.15)" }),
                  }}
                  onClick={handleClick1_2}
                >
                  <ListItemIcon>
                    <DriveFileRenameOutlineIcon sx={{ color: "white", fontSize: 25 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="신규 세입자 신청"
                    primaryTypographyProps={{ style: { fontSize: "13px" } }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(activeIndex === 2 && { backgroundColor: "rgba(0, 0, 0, 0.15)" }),
                  }}
                  onClick={handleClick1_3}
                >
                  <ListItemIcon>
                    <DriveFileRenameOutlineIcon sx={{ color: "white", fontSize: 25 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="세입자 정보 변동 신청"
                    primaryTypographyProps={{ style: { fontSize: "13px" } }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <Divider
            sx={{
              backgroundColor: "#CACACA",
            }}
          />
          <List
            sx={{ width: "100%", bgcolor: "#2D4356", color: "white", paddingTop: 0 }}
            component="nav"
          >
            <ListItemButton
              onClick={handleClick2}
              sx={{
                fontSize: "10px",
                ...(open2 && { backgroundColor: "rgba(255, 255, 255, 0.1)" }),
              }}
            >
              <ListItemIcon>
                <DriveEtaIcon sx={{ color: "white", fontSize: 30 }} />
              </ListItemIcon>
              <ListItemText
                primary="주차 관리"
                primaryTypographyProps={{ style: { fontSize: "15px" } }}
              />
              {open2 ? (
                <ExpandLess sx={{ color: "white" }} />
              ) : (
                <ExpandMore sx={{ color: "white" }} />
              )}
            </ListItemButton>
            <Collapse in={open2} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(activeIndex === 3 && { backgroundColor: "rgba(0, 0, 0, 0.15)" }),
                  }}
                  onClick={handleClick2_1}
                >
                  <ListItemIcon>
                    <DriveEtaIcon sx={{ color: "white", fontSize: 25 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="주차 현황"
                    primaryTypographyProps={{ style: { fontSize: "13px" } }}
                  />
                </ListItemButton>
                <ListItemButton
                  sx={{
                    pl: 4,
                    ...(activeIndex === 4 && { backgroundColor: "rgba(0, 0, 0, 0.15)" }),
                  }}
                  onClick={handleClick2_2}
                >
                  <ListItemIcon>
                    <HistoryIcon sx={{ color: "white", fontSize: 25 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="주차 히스토리"
                    primaryTypographyProps={{ style: { fontSize: "13px" } }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Grid>
        <Grid
          item
          xs={9.5}
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {mainStep[activeIndex]}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default MainPage;
