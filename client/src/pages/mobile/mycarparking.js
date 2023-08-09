import React from 'react'
import './mycarparking.css'
import Footer from './footer';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import 'dayjs/locale/ko'
import Modal from '@mui/material/Modal';
import { Container } from '@mui/material';
import http from "../../axios/http";
import Alert from '@mui/material/Alert';

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { setOuttime } from "../../redux/mobileparking";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import "dayjs/locale/ko";
import Modal from "@mui/material/Modal";
import { Container, Grid, Typography } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import MinorCrashRoundedIcon from "@mui/icons-material/MinorCrashRounded";

function MycarParking() {
  const navigate = useNavigate();
  dayjs.locale("ko");
  const dispatch = useDispatch();
  // Redux의 상태를 가져와서 사용
  // 주차장 해당위치 주차한 차량 아이디
  const BoxItem = useSelector((state) => state.mycar.BoxItem);
  // 내 차량 위치
  const Mycar = useSelector((state) => state.mycar.mycar);
  // 차량별 출차시간
  const Boxrow = useSelector((state) => state.mycar.Boxrow);
  const BoxColumn = useSelector((state) => state.mycar.BoxColumn);
  const allbox = Boxrow * BoxColumn
  const [showAlert, setShowAlert] = React.useState(false);
  const Outtime = () => {
    let timelist = [];
    for (let j = 0; j < allbox; j++) {
      timelist.push('');
    }
    for (let k = 0; k < BoxItem.length; k++) {
      timelist[BoxItem[k].seatNumber] = BoxItem[k].outTime;
    }
    return timelist;
  }
  const outTimeArray = Outtime(); // Outtime 함수를 호출하여 반환된 배열을 저장

  // 앞(뒤)차 위치 확인
  const othercar = () => {
    let othercarnum = Mycar;
    if (Mycar > Boxrow - 1) {
      othercarnum -= Boxrow;
    } else {
      othercarnum += Boxrow;
    }
    let othercarouttime = null;
    if (BoxItem[othercarnum]) {
      othercarouttime = Outtime[othercarnum];
    }
    return othercarouttime;
  };

  // 앞(뒤)차 출차시간
  const othercarouttime = othercar();

  const userid = useSelector((state) => state.mobileInfo.loginId);
  const vilanumber = useSelector((state) => state.mobileInfo.villaIdNumber)
  // 앞(뒤)차 존재 여부
  const isothercar = othercarouttime !== null;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "70%",
    height: "30%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 5,
  };

  // 시간 변경 클릭시 모달창 실행 종료 설정
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    if (defaultall.trim() !== '') {
      setOpen(true);
    } else {
      setShowAlert(true); // Alert을 표시
      setTimeout(() => {
        setShowAlert(false); // 2초 후에 Alert을 숨김
      }, 2000);
    }
  }
    const handleClose = () => setOpen(false);

  // 개인대화방으로 이동하게 추후 변경 필요
  const handleOpenChat = () => {
    navigate("/Mobile/Termessage");
  };

  function convertToDatePickerFormat(dateTimeString) {
    if (dateTimeString !== undefined) {
      // '2023-08-08T12:56 형태의 문자열에서 '23.08.01' 부분을 추출하여 'YYYY-MM-DD' 형태로 변환
      const [datePart] = dateTimeString.split('T');
      const formattedDate = datePart;
      // Dayjs 객체로 변환하여 반환
      return dayjs(formattedDate);
    }
    return null; // 값이 없을 때는 null 반환
  }

  function convertToTimePickerValue(dateTimeString) {
    if (dateTimeString !== undefined) {
      // '23.08.01 06:00' 형태의 문자열에서 '23.08.01' 부분을 추출하여 'YYYY-MM-DD' 형태로 변환
      const [datePart, timePart] = dateTimeString.split('T');
      const formattedDate = datePart;
      const resultdate = `${formattedDate} ${timePart}`;
      return dayjs(resultdate); // 문자열로 변환하여 반환
    }
    return null; // 값이 없을 때는 null 반환
  }

  // defaultDatePickerValue를 Outtime 값으로 설정
  const defaultDatePickerValue = convertToDatePickerFormat(outTimeArray[Mycar]);
  const defaultTimePickerValue = convertToTimePickerValue(outTimeArray[Mycar]);

  // DatePicker에서 날짜 선택시 호출되는 콜백 함수
  const handleDateChange = (date) => {
    setSelectedDate(date); // 선택된 날짜를 상태로 업데이트
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time); // 선택된 시간을 상태로 업데이트
  };

  // 모달 창에서 OK 버튼을 눌렀을 때 호출되는 콜백 함수
  const handleOk = () => {
    // 변경된 출차 예정 시간을 Redux 상태에 반영합니다.
    const formattedDate = selectedDate.format('YY-MM-DD');
    const formattedTime = selectedTime.format('HH:mm');
    const newOuttime = `20${formattedDate} ${formattedTime}`;
    const updatedOuttime = [...outTimeArray];
    updatedOuttime[Mycar] = newOuttime;
  
    const requestData = {
      "outTime": updatedOuttime[Mycar],
      "seatNumber": Mycar,
      "userId": userid,
      "villaIdNumber": vilanumber,
    };
    http({
      method:'put',
      url:'/parking/out_time',
      data: requestData,
    })
    .then((res) => {
      console.log("Response:", res);
    })
    .catch((err) => {
      console.log("Error:", err);
    });
  
    // 모달을 닫습니다.
    handleClose();
  };

  // DatePicker와 TimePicker에서 선택된 값에 대한 상태를 관리합니다.
  const [selectedDate, setSelectedDate] = React.useState(defaultDatePickerValue);
  const [selectedTime, setSelectedTime] = React.useState(defaultTimePickerValue);

  return (
    <React.Fragment>
      <div className="my-car-main">
        <Box
          sx={{
            width: "100%",
            height: "3.3rem",
            backgroundColor: "#112D4E",
            position: "fixed",
            top: 0,
          }}
        >
          <Grid container sx={{ justifyContent: "center", height: "3.3rem", alignContent: "center" }}>
            <Typography className="main-info-text">주차 정보</Typography>
          </Grid>
        </Box>

        <div className="my-parking-main-container">
          <div className="my-car-parking-container">
            <div className="my-car-container">
              <div className="my-car-header-container" style={{ textAlign: "left", fontSize: "2rem" }}>
                <div className="bold-text">
                  나의
                  <br />
                  <span className="highlight">출차 예상 시간</span>
                </div>
              </div>

              <div className="my-car-timer-container">
                <div className="my-car-date-container">{Outtime[Mycar].substr(0, 8)}</div>
                <div className="my-car-time-container">{Outtime[Mycar].substr(9)}</div>
              </div>

              <div className="my-car-update-container">
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", color: "#006DD1" }}>
                  <div className="bold-text">시간 변경하기</div>
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1rem" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="double-car-parking-container">
            <div className="double-parking-container" style={{ textAlign: "left" }}>
              <div className="bold-text" style={{ fontSize: "1.2rem" }}>
                겹주차 현황
              </div>

              <div className="double-parking-info-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
                <div className="double-parking-text-container">
                  현재 {}에<br />
                  차가 주차되어 있어요!
                </div>
                <div className="doubl-parking-icon-container">
                  <MinorCrashRoundedIcon sx={{ color: "#006DD1", fontSize: "4rem" }} />
                </div>
              </div>

              <div className="double-parking-content-container" style={{ marginTop: "2rem" }}>
                <div className="bold-text" style={{ fontSize: "1.2rem" }}>
                  겹주차 출차 예상 시간
                </div>
              </div>
            </div>
          </div>
        </div>

        <Container>
          {/* <TextField
          id="outlined-read-only-input"
          label="출차 예정시간"
          value={Outtime[Mycar]}
          InputProps={{
            readOnly: true,
          }}
          sx={{ position: "absolute", top: "7%", left: "10%", "& input": { textAlign: "center" }, width: "80%" }}
        />
        <Button onClick={handleOpen} sx={{ position: "absolute", top: "13%", left: "75%" }}>
          시간 변경
        </Button>
        <p style={{ position: "absolute", top: "22%", left: "11%", fontSize: "13px" }}>앞(뒤)차 여부</p>
        <Box className={`mycarparkingbox1 ${isothercar ? "mycarparkingbox2" : "mycarparkingbox1"}`} sx={{ width: "39.5%", height: "8%", border: "0.5px solid", display: "inline-block" }}>
          <p style={{ position: "absolute", top: "40%", left: "45%" }}>O</p>
        </Box>
        <Box className={`mycarparkingbox1 ${isothercar ? "mycarparkingbox3" : "mycarparkingbox4"}`} sx={{ width: "39.5%", height: "8%", border: "0.5px solid", display: "inline-block" }}>
          <p style={{ position: "absolute", top: "40%", left: "45%" }}>X</p>
        </Box>
        {isothercar && (
          <TextField
            id="outlined-read-only-input1"
            label="겹주차 차량 출차시간"
            value={othercarouttime}
            InputProps={{
              readOnly: true,
            }}
            sx={{ position: "absolute", top: "40%", left: "10%", "& input": { textAlign: "center" }, width: "80%" }}
          />
        )} */}

          {/* <Button onClick={handleOpenChat} sx={{ position: "absolute", top: "46%", left: "71%" }}>
          대화방 생성
        </Button> */}

          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="출차 예정 일자"
                  format="YYYY-MM-DD"
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{
                    toolbar: { toolbarFormat: "YYYY년 MM월 DD일", hidden: false },
                  }}
                  disablePast={true}
                  sx={{ "& input": { textAlign: "center" } }}
                  className="outdaystyle1"
                />
                <DemoContainer components={["TimePicker"]} sx={{ mt: 4 }}>
                  <TimePicker label="출차 예정 시간" ampm={false} value={selectedTime} onChange={handleTimeChange} sx={{ "& input": { textAlign: "center" } }} />
                </DemoContainer>
                {/* OK 버튼을 추가하고 handleOk 함수를 호출합니다. */}
                <Box component="span" className="datetiembtn" onClick={handleOk}>
                  <p className="datetimebtntext">저장</p>
                </Box>
              </LocalizationProvider>
            </Box>
          </Modal>

          {showAlert && (
            <Alert severity="error">주차를 먼저 실시해주시기 바랍니다.</Alert>
          )}
          </Container>
          <Footer MycariconColor="#B7C4CF" />
        </React.Fragment>
    )
}

export default MycarParking;
