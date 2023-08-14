import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem  } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setWhenEnteringCar } from "../../redux/mobileUserinfo";
import { setOuttime } from "../../redux/mobileparking";
import http from "../../axios/http";
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

const InCar = (props) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "90%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };
  const dispatch = useDispatch();

  const mycarnumb = useSelector((state) => state.mycar.mycar);
  let allouttime = useSelector((state) => state.mycar.Outtime);
  const userid = useSelector((state) => state.mobileInfo.loginId);
  const vilanumber = useSelector((state) => state.mobileInfo.villaIdNumber);
  const [timeselect,settimeselect] = React.useState(false);

  const currentTime = dayjs();
  const currentDateTimeString = currentTime.format("YY.MM.DD HH:mm");

  const handleClose = () => dispatch(setWhenEnteringCar(false));

  const [selectedDate, setSelectedDate] = useState(
    convertToDatePickerFormat(currentDateTimeString)
  );
  const [selectedTime, setSelectedTime] = useState(
    convertToDatePickerFormat(currentDateTimeString)
  );
  const handleopenTimselect =() => {
    settimeselect(true)
  }

  function convertToDatePickerFormat(dateTimeString) {
    if (dateTimeString) {
      return dayjs(dateTimeString, "YY.MM.DD HH:mm");
    }
    return null; // 값이 없을 때는 null 반환
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };
  
  const handleopenTimselectClose = () => {
    settimeselect(false)
  } 

  const handleTimeok =() => {
      const selectedTimeParsed = dayjs(selectedTime, "HH:mm:ss");
      const timeDifferenceInMinutes = selectedTimeParsed.diff(currentTime, "minutes");
      handleopenTimselectClose()
  }

  const handleOk = () => {
      // 이때 출차시간을 Redux에 넣어서 해당자리에 출차 시간 반영!!@!!!
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      const formattedTime = selectedTime.format("HH:mm");
      const newOuttime = `${formattedDate} ${formattedTime}`;
      let updatetime = [...allouttime];
      updatetime[mycarnumb] = newOuttime;
      dispatch(setOuttime(updatetime));
      http({
        method: "post",
        url: "/parking/out_time",
        data: {
          outTime: updatetime[mycarnumb],
          seatNumber: mycarnumb,
          userId: userid,
          villaIdNumber: vilanumber,
        },
      })
        .then(() => {
          dispatch(setWhenEnteringCar(false));
        })
        .catch((err) => {
          console.log(err);
        });
      handleClose();
  };

  return (
    <div>

    <Modal
      open={props.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div style={{ color: "white" }}>
          <div
            style={{
              width: "100%",
              backgroundColor: "#006DD1",
              marginTop: "-2.2rem",
              borderRadius: "0 0 0rem 1.5rem",
              height: "11rem",
            }}
          >
            <div
              className="account-header-info-container"
              style={{ paddingTop: "3rem", textAlign: "left" }}
            >
              <span style={{ fontSize: "1.2rem", marginLeft: "1rem", fontWeight: "bold" }}>
                출차 시간을
              </span>
              <br />
              <span style={{ fontSize: "1.2rem", marginLeft: "1rem" }}>등록해주세요!</span>
            </div>
            <div
              className="account-header-content-container"
              style={{ marginTop: "2.5rem", textAlign: "left" }}
            >
              <div
                className="account-header-content-flex-container"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="account-header-info-container">
                  <div className="account-header-name-container">
                    <span>
                      <span style={{ fontSize: "0.9rem", marginLeft: "8rem" }}>
                        ※ 출차시간을 등록해야
                      </span>
                      <br />
                      <span style={{ fontSize: "0.9rem", marginLeft: "9rem" }}>
                        서비스 이용이 가능합니다.
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Box sx={{ weight: "90%", mt: "25%" }}>
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
              sx={{ "& input": { textAlign: "center" }, width: "90%" }}
            />
            <DemoContainer components={["TimeField"]} sx={{ mt: 4, alignItems: "center" }}>
              <TimeField
                  label="출차 예정 시간"
                  value={selectedTime}
                  onClick={handleopenTimselect}
                  onChange={handleTimeChange}
                  format="HH:mm"
                  sx={{ "& input": { textAlign: "center" }, width: "90%" }}
                />
            </DemoContainer>
            <button
              className="login-box"
              onClick={handleOk}
              style={{
                marginTop: "5rem",
                backgroundColor: "#006DD1",
                color: "white",
                marginBottom: "1rem",
                width: "10rem",
                borderRadius: "1rem",
              }}
            >
              확인
            </button>
          </LocalizationProvider>
        </Box>
      </Box>
    </Modal>
    <Modal
      open={timeselect}
      close={handleopenTimselectClose}>
      <Box sx={style}>
      <div style={{ color: "white" }}>
          <div
            style={{
              width: "100%",
              backgroundColor: "#006DD1",
              marginTop: "-2.2rem",
              borderRadius: "0 0 1.5rem 1.5rem",
              height: "11rem",
            }}
          >
            <div
              className="account-header-info-container"
              style={{ paddingTop: "3rem", textAlign: "left" }}
            >
              <span style={{ fontSize: "1.2rem", marginLeft: "1rem", fontWeight: "bold" }}>
                출차 시간을
              </span>
              <br />
              <span style={{ fontSize: "1.2rem", marginLeft: "1rem" }}>등록해주세요!</span>
            </div>
            <div
              className="account-header-content-container"
              style={{ marginTop: "2.5rem", textAlign: "left" }}
            >
              <div
                className="account-header-content-flex-container"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="account-header-info-container">
                  <div className="account-header-name-container">
                    <span>
                      <span style={{ fontSize: "0.9rem", marginLeft: "8rem" }}>
                        ※ 출차시간을 등록해야
                      </span>
                      <br />
                      <span style={{ fontSize: "0.9rem", marginLeft: "9rem" }}>
                        서비스 이용이 가능합니다.
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Box sx={{ weight: "90%", mt: "15%"}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MultiSectionDigitalClock
              value={selectedTime}
              onChange={handleTimeChange}
              ampm={false}
              sx={{width:'7rem', mb:'2%'}}
            />
          </LocalizationProvider>
        </Box>
      <button
        className="login-box"
        onClick={handleTimeok}
        style={{
          marginTop: "1.7rem",
          backgroundColor: "#006DD1",
          color: "white",
          marginBottom: "1rem",
          width: "10rem",
          borderRadius: "1rem",
        }}
      >
        확인
      </button>
      </Box>
    </Modal>

    </div>
  );
};

export default InCar;
