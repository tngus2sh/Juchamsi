import { useState, useEffect } from "react";
import * as React from "react";
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
  setId,
} from "../../redux/webLoginInfo";
import http from "../../axios/http";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { setSignOpen } from "../../redux/formslice";
const Alerts = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const [errorBox, setErrorBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const signResultOpen = useSelector((state) => state.form.signOpen);
  const signResultMessage = useSelector((state) => state.form.signMessage);

  // const isStoreLoginChecked = useSelector((state) => state.loginform.isStoreLoginChecked);

  useEffect(() => {
    const loadedId = localStorage.getItem("saveId");
    console.log(loadedId);
    if (loadedId) {
      setSaveId(true);
      setSavedId(loadedId);
    }
  }, []);

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
          // 아이디저장체크시
          if (saveId) {
            localStorage.setItem("saveId", response.data.response.loginId);
          } else {
            localStorage.removeItem("saveId");
          }
          // 로그인데이터저장
          dispatch(setId(response.data.response.loginId));
          dispatch(setName(response.data.response.name));
          dispatch(setRoadAddress(response.data.response.villa.address));
          dispatch(setVillaName(response.data.response.villa.name));
          dispatch(setIdentification(response.data.response.villa.idNumber));
          dispatch(setParkingLotCol(response.data.response.villa.totalCount));
          dispatch(setVillaIdNumber(response.data.response.villa.id));
          dispatch(setIsLogin(true));
          navigate("/mainPage");
        } else {
          console.log(response.data);
          setErrorMessage(response.data.error.message);
          setErrorBox(true);
          setTimeout(() => {
            setErrorBox(false);
          }, 1500);
        }
      })
      .catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("Error while submitting:", error);
      });
  }

  const handleLoginChange = (e) => {
    dispatch(setLoginId(e.target.value));
    setSavedId(e.target.value);
  };

  const handlePasswordChange = (e) => {
    dispatch(setLoginPassword(e.target.value));
  };

  const [saveId, setSaveId] = useState(false); // 아이디 저장 여부 상태
  const [savedId, setSavedId] = useState("");

  const handleSaveIdChange = (e) => {
    setSaveId(e.target.checked); // 체크박스의 상태 업데이트
  };

  const signHandleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setSignOpen(false));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        {errorBox && (
          <Alert severity="error" sx={{ width: "80%", position: "absolute", top: 0 }}>
            {errorMessage}
          </Alert>
        )}
        <Paper elevation={3} sx={{ borderRadius: "3rem", height: "27rem", width: "52rem" }}>
          <Grid container sx={{ alignItems: "center", height: "27rem" }}>
            <Grid
              item
              xs={5}
              sx={{
                backgroundColor: "#B7C4CF",
                borderTopLeftRadius: "3rem",
                borderBottomLeftRadius: "3rem",
                alignItems: "center",
                height: "27rem",
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/logo.png`}
                style={{ marginTop: "3.5rem", width: "250px", height: "250px" }}
                alt="Logo"
              />
            </Grid>
            <Grid item xs={7}>
              <Container component="main">
                <Box
                  sx={{
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
                      value={savedId}
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
                      control={
                        <Checkbox
                          color="mainColor"
                          checked={saveId}
                          onChange={handleSaveIdChange}
                        />
                      }
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
      <Snackbar open={signResultOpen} autoHideDuration={2000} onClose={signHandleClose}>
        <Alerts
          onClose={signHandleClose}
          severity={signResultMessage === "회원가입이 완료되었습니다." ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {signResultMessage}
        </Alerts>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Login;
