import React, {useEffect} from "react";
import "./mycarparking.css";
import Footer from "./footer";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import { useNavigate} from "react-router-dom";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import "dayjs/locale/ko";
import Modal from "@mui/material/Modal";
import { Container } from "@mui/material";
import http from "../../axios/http";
import Alert from "@mui/material/Alert";

import { setBoxItem, setmycar } from "../../redux/mobileparking";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import MinorCrashRoundedIcon from "@mui/icons-material/MinorCrashRounded";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';

function MycarParking() {
  const logincheck = useSelector((state) => state.auth.loginchecked)
  const villanumber = useSelector((state) => state.mobileInfo.villaIdNumber);
  let othercarid = null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userid = useSelector((state) => state.mobileInfo.loginId);
  const vilanumber = useSelector((state) => state.mobileInfo.villaIdNumber);
  const [otherCarPhoneNumber, setOtherCarPhoneNumber] = React.useState(null);
  const [timeselect,settimeselect] = React.useState(false);
  const handleopenTimselect =() => {
    settimeselect(true)
  }
  const handleopenTimselectClose = () => {
    settimeselect(false)
  } 
  const currentTime = dayjs();

  const handleTimeok =() => {
    const selectedTimeParsed = dayjs(selectedTime, "HH:mm:ss");
    const timeDifferenceInMinutes = selectedTimeParsed.diff(currentTime, "minutes");
    handleopenTimselectClose()
  }

  useEffect(() => {
    const fetchData = async () => {
        if (logincheck !== true) {
          navigate('/Mobile/Login')
        }
        try {
          // 주차현황 가지고오기
          http({
            method:'get',
            url:`/parking/lot/${villanumber}`
          })
            .then((res) => {
            let resultbox = []
              for (let i=0; i<res.data.response.length; i++) {
                if (res.data.response[i].active === 'ACTIVE') {
                  resultbox.push(res.data.response[i])
                  if (res.data.response[i].userId === userid) {
                    dispatch(setmycar(res.data.response[i].seatNumber))
                  }
                  }
              }
            dispatch(setBoxItem(resultbox))
            })
          .catch((err) => {
            console.log(err)
          })
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };

    // fetchData 함수를 호출하여 데이터를 받아옴
    fetchData();
  }, [dispatch,logincheck,navigate,userid,villanumber]); // 빈 배열을 넣어서 페이지 로드 시에만 useEffect 내부 코드가 실행되도록 설정



  dayjs.locale("ko");

  // Redux의 상태를 가져와서 사용
  // 주차장 해당위치 주차한 차량 아이디
  const BoxItem = useSelector((state) => state.mycar.BoxItem);
  // 내 차량 위치
  const Mycar = useSelector((state) => state.mycar.mycar);
  // 차량별 출차시간
  const Boxrow = useSelector((state) => state.mycar.Boxrow);
  const BoxColumn = useSelector((state) => state.mycar.BoxColumn);
  const allbox = Boxrow * BoxColumn;
  const [showAlert, setShowAlert] = React.useState(false);
  const Outtime = () => {
    let timelist = [];
    for (let j = 0; j < allbox; j++) {
      timelist.push("");
    }
    for (let k = 0; k < BoxItem.length; k++) {
      timelist[BoxItem[k].seatNumber] = BoxItem[k].outTime;
    }
    return timelist;
  };
  const outTimeArray = Outtime(); // Outtime 함수를 호출하여 반환된 배열을 저장

  // 앞차 위치 확인
  const frontothercar = () => {
    let othercarnum = null;
    let othercarouttime = null;
    if (Mycar !== null) {
      if (Mycar > Boxrow) {
        othercarnum = Mycar - Boxrow;
        if (outTimeArray[othercarnum] !== '') {
          othercarouttime = outTimeArray[othercarnum];
        }
      }
      let otheruser = null
      for (let k = 0; k < outTimeArray.length; k++) {
        if (BoxItem[k] !== undefined) {
          if (BoxItem[k].seatNumber === othercarnum) {
            otheruser = BoxItem[k].userId
          }
        }
      }
      if (otheruser !== null) {
        http({
          method:'',
          url:`/tenant/${otheruser}`
        })
          .then((res) => {
            setOtherCarPhoneNumber(res.data.response.phoneNumber);
        })
      }
    } else {
      othercarouttime = null
    }
    return othercarouttime;
  };

  // 뒤차 위치 확인
  const backothercar = () => {
    let othercarnum = null;
    let othercarouttime = null;
    if (Mycar !== null) {
      if (Mycar <= Boxrow) {
        othercarnum = Mycar + Boxrow;
        if (othercarnum <0) {
          othercarnum = 0
        }
        if (outTimeArray[othercarnum] !== '') {
          othercarouttime = outTimeArray[othercarnum];
        }
      }
      let otheruser = null
      for (let k = 0; k < outTimeArray.length; k++) {
        if (BoxItem[k] !== undefined) {
          if (BoxItem[k].seatNumber === othercarnum) {
            otheruser = BoxItem[k].userId
          }
        }
      }
      if (otheruser !== null) {
        http({
          method:'',
          url:`/tenant/${otheruser}`
        })
          .then((res) => {
            setOtherCarPhoneNumber(res.data.response.phoneNumber);
        })
      }
    } else {
      othercarouttime = null
    }
    return othercarouttime;
  };
  // 앞차 출차시간
  const frontothercarouttime = frontothercar();
  // 뒤차 출차시간
  const backothercarouttime = backothercar()


  // 앞차 존재 여부
  const isfrontothercar = !(frontothercarouttime === undefined || frontothercarouttime === null);

  // 뒤차 존재 여부
  const isbackothercar = !(backothercarouttime === undefined || backothercarouttime === null);

  // 주차시간 설정 여부
  let ismycarparking = false

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

  const style2 = {
    position: "fixed",
    top: "0",
    left: "0",
    rigiht: "0",
    width: "100%",
    height: "18rem",
    bgcolor: "white",
    borderRadius: "0 0 1rem 1rem",
    boxShadow: 20,
    textAlign: "center",
    overflowY: "auto", // 스크롤바 추가
    outline: "none",
  };

  // 시간 변경 클릭시 모달창 실행 종료 설정
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    if (defaultall.trim() !== "") {
      setOpen(true);
    } else {
      setShowAlert(true); // Alert을 표시
      setTimeout(() => {
        setShowAlert(false); // 2초 후에 Alert을 숨김
      }, 2000);
    }
  };
  const handleClose = () => setOpen(false);

  // 개인대화방으로 이동하게 추후 변경 필요
  const handleOpenChat = () => {
    createRoom();
    navigate("/Mobile/Termessage");
  };

  const createRoom = () => {
    http
      .post("/chat/room", { userIdOne: userid, userIdTwo: othercarid })
      .then((response) => {
        console.log(response.data.response.roomId);
        // // redux에 담음
        // dispatch(setRoomNumber(response.data.response.roomId)); // 룸 넘버
        // dispatch(setUser1(loginId)); // 로그인 한 유저

        alert(`${response.data.response.roomName} 방 개설에 성공하였습니다.`);

      })
      .catch((error) => {
        alert("채팅방 개설에 실패하였습니다.");
        console.error("Error while creating chat room:", error);
      });
  };

  function convertToDatePickerFormat(dateTimeString) {
    if (dateTimeString !== undefined) {
      // '2023-08-08T12:56 형태의 문자열에서 '23.08.01' 부분을 추출하여 'YYYY-MM-DD' 형태로 변환
      const [datePart] = dateTimeString.split("T");
      const formattedDate = datePart;
      // Dayjs 객체로 변환하여 반환
      return dayjs(formattedDate);
    }
    return null; // 값이 없을 때는 null 반환
  }

  function convertToTimePickerValue(dateTimeString) {
    if (dateTimeString !== undefined) {
      // '23.08.01 06:00' 형태의 문자열에서 '23.08.01' 부분을 추출하여 'YYYY-MM-DD' 형태로 변환
      const [datePart, timePart] = dateTimeString.split("T");
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
    const formattedDate = selectedDate.format("YY-MM-DD");
    const formattedTime = selectedTime.format("HH:mm");
    const newOuttime = `20${formattedDate} ${formattedTime}`;
    const updatedOuttime = [...outTimeArray];
    updatedOuttime[Mycar] = newOuttime;

    const requestData = {
      outTime: updatedOuttime[Mycar],
      seatNumber: Mycar,
      userId: userid,
      villaIdNumber: vilanumber,
    };
    http({
      method: "put",
      url: "/parking/out_time",
      data: requestData,
    })
      .then(() => {
      })
      .catch((err) => {
        console.log("Error:", err);
      });
    setDefaultDay(`20${formattedDate}`);
    setDefaultTime(formattedTime);
    // 모달을 닫습니다.
    handleClose();
  };

  // DatePicker와 TimePicker에서 선택된 값에 대한 상태를 관리합니다.
  const [selectedDate, setSelectedDate] = React.useState(defaultDatePickerValue);
  const [selectedTime, setSelectedTime] = React.useState(defaultTimePickerValue);
  const date = () => {
    if (outTimeArray[Mycar] !== undefined) {
      ismycarparking = true
      return outTimeArray[Mycar].split("T");
    } else {
      return ["", ""];
    }
  };
  const [defaultday, setDefaultDay] = React.useState(date()[0]);
  const [defaulttime, setDefaultTime] = React.useState(date()[1]);
  let defaultall = defaultday + " " + defaulttime;

  return (
    <React.Fragment>
      <div className="my-car-main">
        <Box
          sx={{
            width: "100%",
            height: "3.3rem",
            position: "fixed",
            top: 0,
          }}
        >
          {showAlert && <Alert severity="error" className='signup-alert' sx={{justifyContent:'center'}}>주차를 먼저 실시해주시기 바랍니다.</Alert>}
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
                {ismycarparking ? (
                  <React.Fragment>
                    <div className="my-car-date-container">{defaultday.substring(2, 10).replace(/-/g, '.')}</div>
                    <div className="my-car-time-container">{defaulttime}</div>
                  </React.Fragment>
                ) : (
                  <div className="my-car-date-container-empty">미주차 상태입니다.</div>
                )}
              </div>


              <div className="my-car-update-container">
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", color: "#006DD1" }}>
                  <div className="bold-text" onClick={handleOpen}>시간 변경하기</div>
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1rem" }} />
                </div>
              </div>
            </div>
          </div>

          {/* 겹주차(앞에 차량)이 있을 경우 */}
          {isfrontothercar && (
            <div className="double-car-parking-container" style={{height:'30rem'}}>
              <div className="double-parking-container" style={{ textAlign: "left" }}>
                <div className="bold-text" style={{ fontSize: "1.2rem" }}>
                  겹주차 현황
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.3rem" }}>
                  <div>
                    <p style={{display:'inline'}}>
                    현재
                    </p>
                    <p style={{fontWeight:'bolder', display:'inline', fontSize:'2rem', color:'#006DD1', marginLeft:'0.3rem'}}>
                    앞
                    </p>
                    에
                    <p style={{marginTop:'0.3rem'}}>
                    차가 주차되어 있어요!
                    </p>
                  </div>
                  <div className="doubl-parking-icon-container">
                    <MinorCrashRoundedIcon sx={{ color: "#006DD1", fontSize: "4rem" }} />
                  </div>
                </div>
  
                <div className="double-parking-content-container" style={{ marginTop: "2rem" }}>
                  <div className="bold-text" style={{ fontSize: "1.2rem" }}>
                    겹주차 
                    <p>출차 예상 시간</p>
                  </div>
                </div>
                <div className="my-car-timer-container">
                <React.Fragment>
                  <div className="my-car-date-container">{frontothercarouttime.substring(2, 10).replace(/-/g, '.')}</div>
                  <div className="my-car-time-container" style={{textAlign:'center'}}>{frontothercarouttime.substring(11,16)}</div>
                </React.Fragment>
                </div>
                <Button variant="contained" onClick={handleOpenChat} sx={{ position: "relative", top: "1rem", left: "0rem", borderRadius:'0.5rem' }}>
                  대화방 생성하기
                  <KeyboardArrowRightIcon/>
                </Button>
                <div className="other-phonenumber-main" style={{fontWeight:'bolder', fontSize:'1.2rem'}}>
                  핸드폰 번호
                </div>
                <div className="other-phonenumber-text">
                  {otherCarPhoneNumber}
                </div>
              </div>
            </div>
          )}

          {/* 겹주차(뒤에 차량)이 있을 경우 */}
          {isbackothercar && (
            <div className="double-car-parking-container" style={{height:'30rem'}}>
              <div className="double-parking-container" style={{ textAlign: "left" }}>
                <div className="bold-text" style={{ fontSize: "1.2rem" }}>
                  겹주차 현황
                </div>
  
                <div className="double-parking-info-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
                  <div className="double-parking-text-container">
                  <p style={{display:'inline'}}>
                    현재
                    </p>
                    <p style={{fontWeight:'bolder', display:'inline', fontSize:'2rem', color:'#006DD1', marginLeft:'0.3rem'}}>
                    뒤
                    </p>
                    에
                    <p style={{marginTop:'0.3rem'}}>
                    차가 주차되어 있어요!
                    </p>
                  </div>
                  <div className="doubl-parking-icon-container">
                    <MinorCrashRoundedIcon sx={{ color: "#006DD1", fontSize: "4rem" }} />
                  </div>
                </div>
  
                <div className="double-parking-content-container" style={{ marginTop: "2rem" }}>
                  <div className="bold-text" style={{ fontSize: "1.2rem" }}>
                  <p>출차 예상 시간</p>
                  </div>
                </div>
                <div className="my-car-timer-container">
                <React.Fragment>
                  <div className="my-car-date-container">{backothercarouttime.substring(2, 10).replace(/-/g, '.')}</div>
                  <div className="my-car-time-container" style={{textAlign:'center'}}>{backothercarouttime.substring(11,16)}</div>
                </React.Fragment>
                </div>
                <Button variant="contained" onClick={handleOpenChat} sx={{ position: "relative", top: "1rem", left: "0rem", borderRadius:'0.5rem' }}>
                  대화방 생성하기
                  <KeyboardArrowRightIcon/>
                </Button>
                <div className="other-phonenumber-main" style={{fontWeight:'bolder', fontSize:'1.2rem'}}>
                  핸드폰 번호
                </div>
                <div className="other-phonenumber-text">
                  {otherCarPhoneNumber}
                </div>
              </div>
            </div>
          )}

          {/* 겹주차 없을때 보여줄 내용 */}
          {!isbackothercar && !isfrontothercar && (
            <div className="double-car-parking-container" style={{height:'12.2rem', marginTop:'2rem'}}>
              <div className="double-parking-container" style={{ textAlign: "left", marginTop:'2rem' }}>
                <div className="bold-text" style={{ fontSize: "1.2rem" }}>
                  겹주차 현황
                </div>
  
                <div className="double-parking-info-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
                  <div className="double-parking-text-container">
                    현재 앞뒤에<br />
                    <div className="no-front-back-text-style">
                    <p style={{display:'inline'}}>차가 </p>
                    <p style={{fontWeight:'bolder', display:'inline', fontSize:'2rem'}}>없어요</p>
                    </div>
                  </div>
                  <div className="doubl-parking-icon-container">
                  <img src={process.env.PUBLIC_URL + "/img/mobile/front,backnocar.png"} alt={"nocar"}></img>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

        <Container>
          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style2}>
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
                  sx={{ "& input": { textAlign: "center" }, marginTop: "2rem", width:'80%' }}
                  className="outdaystyle1"
                />
                <DemoContainer components={["TimeField"]} sx={{ mt: 4, alignItems: "center" }}>
                  <TimeField
                      label="출차 예정 시간"
                      value={selectedTime}
                      onClick={handleopenTimselect}
                      onChange={handleTimeChange}
                      format="HH:mm"
                      sx={{ "& input": { textAlign: "center" }, width: "80%" }}
                    />
                </DemoContainer>
                {/* OK 버튼을 추가하고 handleOk 함수를 호출합니다. */}
                <button
                  className="login-box"
                  onClick={handleOk}
                  style={{
                    marginTop: "1.7rem",
                    backgroundColor: "#006DD1",
                    color: "white",
                    marginBottom: "1rem",
                    width: "10rem",
                    borderRadius: "1rem",
                  }}
                >
                  저장
                </button>
              </LocalizationProvider>
            </Box>
          </Modal>
          <Modal
            open={timeselect}
            close={handleopenTimselectClose}>
            <Box sx={style2}>
            <div className="modal-title-container" style={{ marginTop: "2rem", marginBottom:'0.8rem' }}>
              <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                출차 예정 시간
              </span>
            </div>
              <Box sx={{ width: "90%", ml:'1rem'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MultiSectionDigitalClock
                    value={selectedTime}
                    onChange={handleTimeChange}
                    ampm={false}
                    sx={{width:'7rem', mb:'2%', height:'8rem'}}
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
        </Container>
        <Footer MycariconColor="#006DD1" />
      </div>
    </React.Fragment>
  );
}

export default MycarParking;