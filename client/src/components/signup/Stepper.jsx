import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import { Grid } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import http from "../../axios/http";
import CustomModal from "./customModal";
import "./Stepper.css";
const step = [<Step1 />, <Step2 />, <Step3 />];

const theme = createTheme({
  palette: {
    mainColor: {
      main: "#B7C4CF",
    },
  },
});

export default function HorizontalLinearStepper() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");

  const name = useSelector((state) => state.form.step1Data.name);
  const phoneNumber = useSelector((state) => state.form.step1Data.phoneNumber);
  const loginId = useSelector((state) => state.form.step2Data.loginId);
  const loginPassword = useSelector((state) => state.form.step2Data.loginPassword);
  const roadZipCode = useSelector((state) => state.form.step3Data.roadZipCode);
  const roadAddress = useSelector((state) => state.form.step3Data.roadAddress);
  const regionAddress = useSelector((state) => state.form.step3Data.regionAddress);
  const villaName = useSelector((state) => state.form.step3Data.villaName);
  const parkingLotCol = useSelector((state) => state.form.step3Data.parkingLotCol);

  const certification = useSelector((state) => state.form.step1Data.certification);
  const idConfirmation = useSelector((state) => state.form.step2Data.idConfirmation);
  const passwordMatching = useSelector((state) => state.form.step2Data.passwordMatching);
  const privacyAgreement = useSelector((state) => state.form.step3Data.privacyAgreement);

  const handleNext = () => {
    if (activeStep === 0) {
      if (name.trim() === "") {
        setModalMessage("이름을 입력하세요");
        setOpen(true);
      } else if (phoneNumber.trim() === "") {
        setModalMessage("휴대폰번호를 입력하세요");
        setOpen(true);
        // } else if (!certification) {
        //   setModalMessage("휴대폰번호 인증해주세요");
        //   setOpen(true);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === 1) {
      if (loginId.trim() === "") {
        setModalMessage("아이디를 입력하세요");
        setOpen(true);
      } else if (loginPassword.trim() === "") {
        setModalMessage("비밀번호를 입력하세요");
        setOpen(true);
      } else if (!idConfirmation) {
        setModalMessage("아이디를 다시 입력하세요");
        setOpen(true);
      } else if (!passwordMatching) {
        setModalMessage("비밀번호를 일치시키세요");
        setOpen(true);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === step.length - 1) {
      if (roadZipCode.trim() === "") {
        setModalMessage("빌라 주소를 입력하세요");
        setOpen(true);
      } else if (villaName.trim() === "") {
        setModalMessage("빌라 이름을 입력하세요");
        setOpen(true);
      } else if (parkingLotCol.trim() === "") {
        setModalMessage("총 주차대수를 입력하세요");
        setOpen(true);
      } else if (!privacyAgreement) {
        setModalMessage("개인정보에 동의해주세요");
        setOpen(true);
      } else {
        // 회원가입 수행
        handleSubmit();
        navigate("/");
      }
    }
  };

  async function handleSubmit() {
    // JSON 데이터 생성
    const formData = {
      name: name,
      phoneNumber: phoneNumber,
      loginId: loginId,
      loginPassword: loginPassword,
      roadZipCode: roadZipCode,
      roadAddress: roadAddress,
      regionAddress: regionAddress,
      villaName: villaName,
      parkingLotCol: parkingLotCol,
    };

    try {
      // HTTP POST 요청 보내기
      await http.post(`/owner`, formData);
      console.log("ㅎㅇ");
      // 회원가입 완료 후 메인 페이지로 이동
      navigate("/");
    } catch (error) {
      // 요청 실패 시 에러 처리
      console.error("Error while submitting:", error);
    }
  }

  const handleClose = () => setOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: "100%", marginTop: "30px" }}>
        <Stepper activeStep={activeStep}>
          {step.map((component, index) => (
            <Step key={index}>
              <StepLabel>{`Step ${index + 1}`}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <React.Fragment>
          <Box component="form" noValidate sx={{ mt: 4, pl: 6, pr: 6 }}>
            <Box sx={{ height: "280px" }}>{step[activeStep]}</Box>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button variant="outlined" onClick={handleNext}>
                {activeStep === step.length - 1 ? "가입" : "다음"}
              </Button>
            </Box>
          </Box>
        </React.Fragment>
      </Box>
      <CustomModal open={open} handleClose={handleClose} message={modalMessage} />
    </ThemeProvider>
  );
}
