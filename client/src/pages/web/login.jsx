import { React, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoginId } from "../../redux/loginform";
import { setLoginPassword, setIsStoreLoginChecked } from "../../redux/loginform";
import {
  setName,
  setRoadAddress,
  setVillaName,
  setParkingLotCol,
  setIdentification,
  setVillaIdNumber,
  setIsLogin,
} from "../../redux/webLoginInfo";
import http from "../../axios/http";

const theme = createTheme({
  palette: {
    mainColor: {
      main: "#B7C4CF",
    },
  },
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginId = useSelector((state) => state.loginform.loginId);
  const loginPassword = useSelector((state) => state.loginform.loginPassword);

  const isStoreLoginChecked = useSelector((state) => state.loginform.isStoreLoginChecked);

  useEffect(() => {
    console.log(isStoreLoginChecked);
  }, [isStoreLoginChecked]);
  const loginMove = (e) => {
    // 로그인 실행
    loginSubmit();
  };

  async function loginSubmit() {
    // HTTP POST 요청 보내기
    // console.log(loginId);
    // console.log(loginPassword);
    await http
      .post(`/owner/login`, {
        loginId: loginId,
        loginPassword: loginPassword,
      })
      .then((response) => {
        // 서버로부터 응답이 성공적으로 왔는지 확인
        if (response.data && response.data.success) {
          // 로그인 성공한 경우
          console.log(response.data);
          // 로그인데이터저장
          dispatch(setName(response.data.response.name));
          dispatch(setRoadAddress(response.data.response.villa.address));
          dispatch(setVillaName(response.data.response.villa.name));
          dispatch(setIdentification(response.data.response.villa.idNumber));
          dispatch(setParkingLotCol(response.data.response.villa.totalCount));
          dispatch(setVillaIdNumber(response.data.response.villa.id));
          dispatch(setIsLogin(true));
          navigate("/mainPage");
        } else {
          // 로그인 실패한 경우
          console.log("로그인 실패");
        }
      })
      .catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("Error while submitting:", error);
      });
  }

  const handleLoginChange = (e) => {
    dispatch(setLoginId(e.target.value));
  };

  const handlePasswordChange = (e) => {
    dispatch(setLoginPassword(e.target.value));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{ display: "flex", justifyContent: "center", marginTop: "130px" }}
        style={{ paddingLeft: "150px", paddingRight: "150px" }}
      >
        <Paper elevation={3} style={{ borderRadius: 20 }}>
          <Grid container style={{ height: "450px", width: "840px" }}>
            <Grid
              item
              xs={5}
              style={{
                backgroundColor: "#B7C4CF",
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
              }}
            >
              <div style={{ marginTop: "50px" }}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/logo.png`}
                  style={{ width: "250px", height: "250px" }}
                  alt="Logo"
                />
              </div>
            </Grid>
            <Grid item xs={7}>
              <Container component="main">
                <CssBaseline />
                <Box
                  sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography component="h1" variant="h4">
                    로그인
                  </Typography>
                  <Box component="form" noValidate sx={{ mt: 4, pl: 6, pr: 6 }}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      id="loginId"
                      label="아이디"
                      name="loginId"
                      autoComplete="loginId"
                      autoFocus
                      size="small"
                      onChange={handleLoginChange}
                    />

                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="loginPassword"
                      label="비밀번호"
                      type="password"
                      id="loginPassword"
                      autoComplete="current-password"
                      size="small"
                      onChange={handlePasswordChange}
                    />
                    <FormControlLabel
                      control={<Checkbox color="mainColor" />}
                      label={<Typography style={{ fontSize: 13 }}>아이디 저장</Typography>}
                      style={{ display: "flex", justifyContent: "start" }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      color="mainColor"
                      style={{
                        height: "40px",
                        borderRadius: 50,
                        color: "white",
                        fontWeight: "bold",
                      }}
                      sx={{ mt: 3, mb: 2 }}
                      onClick={loginMove}
                    >
                      로그인
                    </Button>
                    <Grid container>
                      <Grid item xs={3}></Grid>
                      <Grid item style={{ fontSize: 12 }}>
                        회원이 아니신가요?
                      </Grid>
                      <Grid item style={{ marginLeft: "10px" }}>
                        <Link to="/signup" variant="body2">
                          <Typography style={{ fontSize: "12px" }}>회원가입</Typography>
                        </Link>
                      </Grid>
                      <Grid item xs={2}></Grid>
                    </Grid>
                  </Box>
                </Box>
              </Container>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
