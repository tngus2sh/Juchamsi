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
  const [isMatch, setIsMatch] = useState(false);
  const [isMatch2, setIsMatch2] = useState(false);
  const loginPassword = useSelector((state) => state.form.step2Data.loginPassword);
  const loginPassword2 = useSelector((state) => state.form.step2Data.loginPassword2);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const handleIdChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length === 0) {
      setError("");
    } else if (inputValue.length < 5) {
      setError("너무 짧습니다");
      setIsMatch(false);
    } else {
      setError("사용가능합니다.");
      setIsMatch(true);
    }
    dispatch(setStep2Data({ loginId: inputValue }));
  };

  const handleBlur = () => {
    if (loginPassword.trim() === "" || loginPassword2.trim() === "") {
      setError2("");
    } else if (loginPassword !== loginPassword2) {
      setError2("비밀번호가 일치하지 않습니다.");
      setIsMatch2(false);
    } else {
      setError2("비밀번호가 일치합니다.");
      setIsMatch2(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e) => {
    dispatch(setStep2Data({ loginPassword: e.target.value }));
  };

  const handlePassword2Change = (e) => {
    dispatch(setStep2Data({ loginPassword2: e.target.value }));
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Grid container>
          <Grid item xs={9}>
            <InputBox tag={"아이디"} name={"loginId"} onChange={handleIdChange} />
            <Box sx={{ height: "18px" }}>
              {error && (
                <Typography
                  style={{
                    fontSize: 10,
                    color: isMatch ? "green" : "red",
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
          <Grid item xs={3}></Grid>
        </Grid>
      </Box>
      <Grid container>
        <Grid item xs={9}>
          <InputBox
            tag={"비밀번호"}
            name={"loginPassword"}
            type={showPassword ? "text" : "password"}
            onChange={handlePasswordChange}
            onBlur={handleBlur}
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
        name={"loginPassword2"}
        type={showPassword ? "text" : "password"}
        onChange={handlePassword2Change}
        onBlur={handleBlur}
      ></InputBox>
      <Box sx={{ height: "10px" }}>
        {error2 && (
          <Typography
            style={{
              fontSize: 10,
              color: isMatch2 ? "green" : "red",
              marginTop: 0,
              marginLeft: 4,
              textAlign: "left",
            }}
          >
            {error2}
          </Typography>
        )}
      </Box>
    </React.Fragment>
  );
};

export default Step2;
