import React, { useState } from "react";
import Container from "@mui/material/Container";
import styled from "styled-components";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { setStep1Data } from "../../redux/formslice";
import InputBox from "./inputbox";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const VerificationBox = () => {
  const [verificationValue, setVerificationValue] = useState("");

  const handleVerificationChange = (event) => {
    setVerificationValue(event.target.value);
  };
  const Vertification = (e) => {
    // 보내진 인증번호와 입력한 인증번호(verificationValue)가 맞는지 틀린지 확인
  };
  return (
    <Box>
      <Grid container sx={{ marginTop: 3 }}>
        <Grid item xs={8}>
          <InputBox
            tag={"인증번호 입력"}
            name={"verification"}
            onChange={handleVerificationChange}
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
          >
            인증확인
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const Step1 = () => {
  const [open, setOpen] = React.useState(false);
  const [boxOpen, setBoxOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
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
  };

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
              인증하기
            </Button>
          </Grid>
        </Grid>
      </Box>

      {boxOpen && <VerificationBox />}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            인증번호가 발송되었습니다.
          </Typography>
        </Box>
      </Modal>
    </React.Fragment>
  );
};

export default Step1;
