import React from "react";
import Container from "@mui/material/Container";
import styled from "styled-components";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { setStep1Data } from "../../redux/formslice";
import InputBox from "./inputbox";

const Step1 = () => {
  const dispatch = useDispatch();

  const handleNameChange = (e) => {
    dispatch(setStep1Data({ name: e.target.value }));
  };

  const handlePhoneNumberChange = (e) => {
    dispatch(setStep1Data({ phoneNumber: e.target.value }));
  };

  const sendCertification = (e) => {
    // 전송
  };

  return (
    <React.Fragment>
      <Box sx={{ height: 15 }}></Box>
      <InputBox tag={"이름"} name={"name"} onChange={handleNameChange} />

      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Grid container sx={{ marginTop: 3 }}>
          <Grid item xs={8}>
            <InputBox tag={"휴대폰 번호"} name={"tel"} onChange={handlePhoneNumberChange} />
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
                marginTop: "21px",
              }}
            >
              인증하기
            </Button>
          </Grid>
        </Grid>
      </Box>
    </React.Fragment>
  );
};

export default Step1;
