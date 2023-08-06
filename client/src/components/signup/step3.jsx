import Box from "@mui/material/Box";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setStep3Data } from "../../redux/formslice";
import { setOpen, setClose } from "../../redux/addressOpen";
import DaumPost from "./DaumPost";
import InputBox from "./inputbox";
import PrivacyAgreement from "../../components/signup/privacyagreement";

const Step3 = () => {
  const dispatch = useDispatch();
  const step3Data = useSelector((state) => state.form.step3Data);
  const open = useSelector((state) => state.addressOpen.open);
  // 체크박스(개인정보 이용동의) 상태를 관리
  const [isChecked, setIsChecked] = useState(false);
  // 개인정보 모달
  const [privacyCheck, setPrivacyCheck] = React.useState(false);
  const handleOpenPrivacyOpen = () => setPrivacyCheck(true);
  const handleClosePrivacyClose = () => setPrivacyCheck(false);

  // 체크박스의 상태를 변경하는 함수
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    dispatch(setStep3Data({ privacyAgreement: event.target.checked }));
  };
  const handleVillaNameChange = (e) => {
    dispatch(setStep3Data({ villaName: e.target.value }));
  };

  const handleParkingLotColChange = (e) => {
    const inputValue = e.target.value;

    // 음수가 입력되었을 때 처리
    if (inputValue < 1) {
      e.target.value = 1;
      return;
    }
    // 음수가 아닌 경우 처리
    dispatch(setStep3Data({ parkingLotCol: inputValue }));
  };

  const handleOpen = () => {
    dispatch(setOpen());
  };

  const handleClose = () => {
    dispatch(setClose());
  };

  // 개인정보 이용약관 클릭시
  const PrivacyBtnClick = () => {
    // 개인정보 이용약관 모들 오픈
    handleOpenPrivacyOpen();
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Grid container>
          <Grid item xs={7}>
            <InputBox
              tag={"빌라 주소"}
              name={"roadZipCode"}
              value={step3Data.roadZipCode}
              height={"15px"}
            />
          </Grid>
          <Grid item xs={5}>
            <Button
              variant="contained"
              color="mainColor"
              sx={{
                height: "30px",
                borderRadius: 10,
                color: "white",
                fontWeight: "bold",
                fontSize: "12px",
                marginTop: "19px",
              }}
              onClick={handleOpen}
            >
              우편번호로 찾기
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ height: "5px" }} />
      <InputBox name={"roadAddress"} value={step3Data.roadAddress} height={"15px"} />
      <Box sx={{ height: "5px" }} />
      <InputBox
        tag={"빌라 이름"}
        name={"villaName"}
        onChange={handleVillaNameChange}
        height={"20px"}
      />

      <Box sx={{ marginTop: "7px" }}>
        <Typography style={{ fontSize: 12, textAlign: "left", fontWeight: "bold" }}>
          총 주차대수
        </Typography>
        <Grid container>
          <Grid item xs={2}>
            <InputBox
              name={"parkingLotCol"}
              type={"number"}
              height={"20px"}
              onChange={handleParkingLotColChange}
            />
          </Grid>
          <Grid item xs={1} sx={{ marginTop: 1 }}>
            X
          </Grid>
          <Grid item xs={2}>
            <InputBox name={"parkingLotRow"} type={"number"} height={"20px"} value={2} disabled />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={9}>
            <FormControlLabel
              required
              control={<Checkbox color="mainColor" />}
              sx={{ marginRight: 0 }}
              label={
                <Typography style={{ fontSize: 13 }}>
                  개인정보 수집 및 이용에 동의합니다.
                </Typography>
              }
              style={{ display: "flex", justifyContent: "start" }}
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
          </Grid>
          <Grid item xs={2} style={{ marginTop: "13px" }}>
            <Link onClick={PrivacyBtnClick} variant="body2">
              <Typography style={{ fontSize: "11px" }}>더보기</Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>주소 찾기</DialogTitle>
        <DialogContent>
          <DaumPost />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
      <PrivacyAgreement open={privacyCheck} onClose={handleClosePrivacyClose} />
    </React.Fragment>
  );
};

export default Step3;
