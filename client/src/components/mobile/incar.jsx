import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setWhenEnteringCar } from "../../redux/mobileUserinfo";

const InCar = (props) => {
  const style = {
    position: "absolute",
    top: "44%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "80vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };
  const dispatch = useDispatch();

  const currentTime = dayjs();
  const currentDateTimeString = currentTime.format("YY.MM.DD HH:mm");

  const handleClose = () => dispatch(setWhenEnteringCar(false));

  const [selectedDate, setSelectedDate] = useState(
    convertToDatePickerFormat(currentDateTimeString)
  );
  const [selectedTime, setSelectedTime] = useState(
    convertToDatePickerFormat(currentDateTimeString)
  );

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

  const handleOk = () => {
    const selectedTimeParsed = dayjs(selectedTime, "HH:mm");
    const timeDifferenceInMinutes = selectedTimeParsed.diff(currentTime, "minutes");
    // 최소 30분 이상 설정해야함!
    if (timeDifferenceInMinutes >= 30) {
      // 이때 출차시간을 Redux에 넣어서 해당자리에 출차 시간 반영!!@!!!
      const formattedDate = selectedDate.format("YY.MM.DD");
      const formattedTime = selectedTime.format("HH:mm");
      const newOuttime = `${formattedDate} ${formattedTime}`;

      handleClose();
    } else {
      console.log(timeDifferenceInMinutes);
      alert("최소 30분 이후로 출차 예정 시간을 설정해주세요.");
    }
  };

  return (
    <Modal
      open={props.open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Container sx={{ width: "100%" }}>
          <Typography sx={{ mt: "10%" }} variant="h6" component="h2">
            주차를 정삭적으로 완료하였습니다
          </Typography>
          <Typography sx={{ mt: "10%" }} variant="h6" component="h2">
            출차시간을 입력해주세요 (최소 30분 이상)
          </Typography>
          <Box sx={{ weight: "100%", mt: "25%" }}>
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
                sx={{ "& input": { textAlign: "center" }, width: "100%" }}
              />
              <DemoContainer components={["TimePicker"]} sx={{ mt: 4 }}>
                <TimePicker
                  label="출차 예정 시간"
                  ampm={false}
                  value={selectedTime}
                  onChange={handleTimeChange}
                  minTime={currentTime}
                  sx={{ "& input": { textAlign: "center" } }}
                />
              </DemoContainer>
              <Button sx={{ mt: "30%" }} onClick={handleOk}>
                등록
              </Button>
            </LocalizationProvider>
          </Box>
        </Container>
      </Box>
    </Modal>
  );
};

export default InCar;
