import React, { useState } from "react";
import Container from "@mui/material/Container";
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { setStep2Data } from "../../redux/formslice";
import InputBox from "./inputbox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Step2 = () => {
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const password = useSelector((state) => state.form.step2Data.password);
  const password2 = useSelector((state) => state.form.step2Data.password2);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleIdChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length < 5 && inputValue.length > 0) {
      setError("너무 짧습니다");
    } else {
      setError("");
    }
    dispatch(setStep2Data({ id: inputValue }));
  };

  const handleBlur = () => {
    console.log(password);
    console.log(password2);
    if (password !== password2) {
      setError2("비밀번호가 일치하지 않습니다.");
    } else {
      setError2("비밀번호가 일치합니다.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    dispatch(setStep2Data({ password: e.target.value }));
  };

  const handlePassword2Change = (e) => {
    dispatch(setStep2Data({ password2: e.target.value }));
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Grid container>
          <Grid item xs={8}>
            <InputBox tag={"아이디"} name={"id"} onChange={handleIdChange} />
            <Box sx={{ height: "18px" }}>
              {error && (
                <Typography
                  style={{
                    fontSize: 10,
                    color: "red",
                    marginTop: 0,
                    marginLeft: 4,
                    textAlign: "left",
                  }}
                >
                  {error}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="mainColor"
              sx={{
                height: "30px",
                borderRadius: 10,
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
                marginTop: "23px",
              }}
            >
              중복체크
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Grid container>
        <Grid item xs={9}>
          <InputBox
            tag={"비밀번호"}
            name={"password"}
            type={showPassword ? "text" : "password"}
            onChange={handlePasswordChange}
          ></InputBox>
        </Grid>
        <Grid item xs={2}>
          {showPassword ? (
            <VisibilityIcon style={{ marginTop: 25 }} onClick={togglePasswordVisibility} />
          ) : (
            <VisibilityOffIcon style={{ marginTop: 25 }} onClick={togglePasswordVisibility} />
          )}
        </Grid>
      </Grid>
      <Box sx={{ height: "30px" }}>
        <Typography style={{ fontSize: "0.2rem", marginTop: 0, marginLeft: 4, textAlign: "left" }}>
          {"대문자 + 소문자 + 숫자 조합으로 4자이상 10자 이하 입력"}
        </Typography>
      </Box>
      <InputBox
        tag={"비밀번호확인"}
        name={"password2"}
        type={showPassword ? "text" : "password"}
        onChange={handlePassword2Change}
        onBlur={handleBlur}
      ></InputBox>
      <Box sx={{ height: "10px" }}>
        {error2 && (
          <Typography
            style={{ fontSize: 10, color: "red", marginTop: 0, marginLeft: 4, textAlign: "left" }}
          >
            {error2}
          </Typography>
        )}
      </Box>
    </React.Fragment>
  );
};

export default Step2;
