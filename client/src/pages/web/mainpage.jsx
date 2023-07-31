import { Button, Container, Divider, Tab } from "@mui/material";
import React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import RoomRoundedIcon from "@mui/icons-material/RoomRounded";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
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
import Step2 from "../../components/signup/step2";
import Step3 from "../../components/signup/step3";

const theme = createTheme({
  palette: {
    mainColor: {
      main: "#2D4356",
    },
  },
});

const mainStep = [<ResidentManagement />, <Step2 />, <Step3 />];

const MainPage = () => {
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

  return (
    <ThemeProvider theme={theme}>
      <Grid container sx={{ height: "100vh" }} maxWidth="lg">
        <Grid item xs={3} sx={{ height: "100vh", backgroundColor: "#2D4356" }} maxWidth="lg">
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
                김집주인님, 안녕하세요
              </Typography>
            </Grid>
          </Grid>

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
                식별 코드 | h123o123me
              </Typography>

              <Typography style={{ fontSize: "13px", color: "white", marginTop: "3px" }}>
                광주 광산구 하남산단6번로 107
              </Typography>
              <Typography style={{ fontSize: "13px", color: "white", marginTop: "3px" }}>
                삼성 빌라
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
                <ListItemButton sx={{ pl: 4 }} onClick={handleClick1_1}>
                  <ListItemIcon>
                    <PersonIcon sx={{ color: "white", fontSize: 25 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="입주민 정보"
                    primaryTypographyProps={{ style: { fontSize: "13px" } }}
                  />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} onClick={handleClick1_2}>
                  <ListItemIcon>
                    <DriveFileRenameOutlineIcon sx={{ color: "white", fontSize: 25 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="신규 세입자 신청"
                    primaryTypographyProps={{ style: { fontSize: "13px" } }}
                  />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} onClick={handleClick1_3}>
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
                primary="주차 현황"
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
                <ListItemButton sx={{ pl: 4 }}>
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
          xs={9}
          sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
          maxWidth="lg"
        >
          {mainStep[activeIndex]}
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default MainPage;
