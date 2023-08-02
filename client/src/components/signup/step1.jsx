import React, { useState } from "react";
import Container from "@mui/material/Container";
import styled from "styled-components";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { setStep1Data } from "../../redux/formslice";
import InputBox from "./inputbox";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import http from "../../axios/http";
import CustomModal from "./customModal";

const VerificationBox = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");
  const [verificationValue, setVerificationValue] = useState("");
  const verificationNumber = useSelector((state) => state.form.step1Data.verificationNumber);
  const [complete, setComplete] = React.useState(false);

  const handleClose = () => setOpen(false);

  const handleVerificationChange = (event) => {
    setVerificationValue(event.target.value);
  };
  const Vertification = (e) => {
    // 보내진 인증번호와 입력한 인증번호(verificationValue)가 맞는지 틀린지 확인

    console.log(verificationValue);
    console.log(verificationNumber);

    if (verificationValue === verificationNumber) {
      setModalMessage("인증번호가 일치합니다!");
      setOpen(true);
      setComplete(true);
      dispatch(setStep1Data({ certification: true }));
    } else {
      setModalMessage("인증번호가 일치하지 않습니다!");
      setOpen(true);
    }
  };
  return (
    <Box>
      <Grid container sx={{ marginTop: 3 }}>
        <Grid item xs={8}>
          <InputBox
            tag={"인증번호 입력"}
            name={"verification"}
            onChange={handleVerificationChange}
            disabled={complete}
          />
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
            onClick={Vertification}
            disabled={complete}
          >
            {complete ? "인증완료" : "인증확인"}
          </Button>
        </Grid>
      </Grid>
      <CustomModal open={open} handleClose={handleClose} message={modalMessage} />
    </Box>
  );
};

const Step1 = () => {
  const [open, setOpen] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");

  const [boxOpen, setBoxOpen] = React.useState(false);
  const phoneNumber = useSelector((state) => state.form.step1Data.phoneNumber);

  const handleOpen = () => {
    setModalMessage("인증번호가 발송되었습니다.");
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleBoxOpen = () => {
    setBoxOpen(true);
  };
  const dispatch = useDispatch();

  const handleNameChange = (e) => {
    dispatch(setStep1Data({ name: e.target.value }));
  };

  const handlePhoneNumberChange = (e) => {
    dispatch(setStep1Data({ phoneNumber: e.target.value }));
  };

  const sendCertification = (e) => {
    // 전송
    handleOpen();
    handleBoxOpen();
    sendToPhoneNumber();
  };

  async function sendToPhoneNumber() {
    await http
      .post(`/sms/check`, {
        to: phoneNumber,
      })
      .then((response) => {
        dispatch(setStep1Data({ verificationNumber: response.data.response }));
        console.log(response.data.response);
      });
  }

  return (
    <React.Fragment>
      <Box sx={{ height: 15 }}></Box>
      <InputBox tag={"이름"} name={"name"} onChange={handleNameChange} />

      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Grid container sx={{ marginTop: 3 }}>
          <Grid item xs={8}>
            <InputBox
              tag={"휴대폰 번호"}
              name={"phoneNumber"}
              onChange={handlePhoneNumberChange}
              disabled={boxOpen}
            />
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
              onClick={sendCertification}
            >
              {boxOpen ? "다시전송" : "인증하기"}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {boxOpen && <VerificationBox />}

      <CustomModal open={open} handleClose={handleClose} message={modalMessage} />
    </React.Fragment>
  );
};

export default Step1;
