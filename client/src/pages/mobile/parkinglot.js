import React, { useState, useEffect, useCallback } from "react";
import "./parkinglot.css";
import Footer from "./footer";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InCar from "../../components/mobile/incar";
import { Container } from "@mui/material";
import { setWhenEnteringCar } from "../../redux/mobileUserinfo";
import http from "../../axios/http";
import { setBoxItem, setmycar, setBoxrow } from "../../redux/mobileparking";
import KeyboardDoubleArrowUpRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowUpRounded";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import PinDropRoundedIcon from "@mui/icons-material/PinDropRounded";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { setFcmToken } from "../../redux/mobileUserinfo";
import Grid from "@mui/material/Grid";

const config = {
  apiKey: "AIzaSyAP0IeVXonU6Z5LjfuCHU-V256A0IW13B0",
  authDomain: "juchamsi-test.firebaseapp.com",
  projectId: "juchamsi-test",
  storageBucket: "juchamsi-test.appspot.com",
  messagingSenderId: "201343183627",
  appId: "1:201343183627:web:3859dafd9261a780df100e",
  measurementId: "G-PDSL7LXQJG",
};

function Parkinglot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOpen = useCallback(() => {
    dispatch(setWhenEnteringCar(true));
  }, [dispatch]);

  const handleOpenMycarPage = () => {
    // 내 주차현황 페이지로 이동
    navigate("/Mobile/Mycar");
  };

  const userid = useSelector((state) => state.mobileInfo.loginId);
  const name = useSelector((state) => state.mobileInfo.name);
  const villanumber = useSelector((state) => state.mobileInfo.villaIdNumber);
  const logincheck = useSelector((state) => state.auth.loginchecked);
  const fcmToken = useSelector((state) => state.mobileInfo.fcmToken);

  const requestNotificationPermission = async () => {
    console.log("푸시 허가 받는 중 ...");

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("푸시 알림이 허용되었습니다.");
      fetchFcmToken();
    } else {
      console.log("푸시 알림이 허용되지 않았습니다");
    }
  };

  const fetchFcmToken = async () => {
    const app = initializeApp(config);
    const messaging = getMessaging(app);

    try {
      const token = await getToken(messaging, { vapidKey: "BOo8VGAO9hTSpToCkrOuA3H_UL5HNke7zP5O19dBHsgtiG2_uk-g4njPKE5D024SAqppKGVuFSERWIbQUXeiJjg" });

      if (token.length > 0) {
        console.log("푸시 토큰 : ", token);
        if (fcmToken !== token) {
          dispatch(setFcmToken(token));
          storeToken();
        }
      } else {
        console.log("푸시 토큰 실패 !");
      }
    } catch (error) {
      console.error("Error while fetching FCM token:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (logincheck !== true) {
        navigate("/Mobile/Login");
      }
      try {
        // 내 주차현황 입력여부 확인
        http({
          method: "get",
          url: `/parking/entrance/${userid}`,
        })
          .then((res) => {
            if (res.data.response !== null) {
              if (res.data.response.parkingNowFlag === "TRUE") {
                dispatch(setmycar(res.data.response.seatNumber));
                handleOpen();
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });

        // 주차현황 가지고오기
        http({
          method: "get",
          url: `/parking/lot/${villanumber}`,
        })
          .then((res) => {
            console.log(res);
            let totalNum = null;
            let resultbox = [];
            for (let i = 0; i < res.data.response.length; i++) {
              if (res.data.response[i].active === "ACTIVE") {
                resultbox.push(res.data.response[i]);
                if (res.data.response[i].userId === userid) {
                  dispatch(setmycar(res.data.response[i].seatNumber));
                }
              }
              if (i === 0) {
                totalNum = res.data.response[i].totalSeatNum / 2;
              }
            }
            dispatch(setBoxItem(resultbox));
            dispatch(setBoxrow(totalNum));
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // fetchData 함수를 호출하여 데이터를 받아옴
    fetchData();
  }, [logincheck, navigate, userid, villanumber, dispatch, handleOpen]); // 빈 배열을 넣어서 페이지 로드 시에만 useEffect 내부 코드가 실행되도록 설정

  // 로그인한 유저
  useEffect(() => {
    if (fcmToken === "") {
      requestNotificationPermission();
    } else {
      fetchFcmToken();
    }
  }, [fcmToken]);

  async function storeToken() {
    await http
      .post(`/token`, {
        loginId: userid,
        FCMToken: fcmToken,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("Error while submitting:", error);
      });
  }

  // Redux 상태에서 정보 가져오기
  const BoxItem = useSelector((state) => state.mycar.BoxItem);
  const mycar = useSelector((state) => state.mycar.mycar);
  const Boxrow = useSelector((state) => state.mycar.Boxrow);
  const BoxColumn = useSelector((state) => state.mycar.BoxColumn);
  const allbox = Boxrow * BoxColumn;

  const carnum = () => {
    let carnumlist = [];
    for (let j = 0; j <= allbox; j++) {
      carnumlist.push("");
    }
    for (let k = 0; k < BoxItem.length; k++) {
      carnumlist[BoxItem[k].seatNumber] = BoxItem[k].carNumber;
    }
    return carnumlist;
  };

  const Outtime = () => {
    let timelist = [];
    for (let j = 0; j <= allbox; j++) {
      timelist.push("");
    }
    for (let k = 0; k < BoxItem.length; k++) {
      timelist[BoxItem[k].seatNumber] = BoxItem[k].outTime;
    }
    return timelist;
  };

  const outTimeArray = Outtime(); // Outtime 함수를 호출하여 반환된 배열을 저장
  const carnumArray = carnum();

  const open = useSelector((state) => state.mobileInfo.whenEnteringCar);

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Box 그리드를 생성하는 함수
  // 열에 맞게 한행에 박스 만들기
  const renderBoxColumn = (rowIndex) => {
    const columns = [];

    for (let j = 0; j < BoxColumn; j++) {
      const index = rowIndex * BoxColumn + j;
      console.log(index);
      const MycarIcon = index === mycar - 1;

      columns.push(
        <button key={`${rowIndex}-${j}`} onClick={MycarIcon ? handleOpenMycarPage : null} style={{ border: "none", backgroundColor: "transparent", padding: 0 }}>
          <Box
            key={`${rowIndex}-${j}`}
            sx={{
              width: "8rem",
              height: viewportHeight * 0.16,
              marginRight: "1rem",
              marginLeft: "1rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: MycarIcon ? "#006DD1" : outTimeArray[index + 1] !== "" ? "#EA6868" : "#FFFFFF",
              flexDirection: "column",
            }}
          >
            {MycarIcon && (
              <>
                <img src={process.env.PUBLIC_URL + "/img/mobile/mycaricon2.png"} alt={"mycarimg2"} style={{ display: "flex", position: "relative", top: "-1rem" }}></img>
                <img src={process.env.PUBLIC_URL + "/img/mobile/mycar.png"} alt={"carimg"} style={{ position: "relative", top: "-1rem" }}></img>
              </>
            )}
            {/* {!MycarIcon && outTimeArray[index + 1] && ( // fix: 출차 시간 등록하지 않으면 이거 제대로 안 나옴 */}
            {!MycarIcon && outTimeArray[index + 1] !== "" && (
              <>
                <p style={{ color: "#B3B3B3", fontSize: "16px", textAlign: "center", display: "flex", position: "relative", top: -viewportHeight * 0.06 }}>{outTimeArray[index + 1].length > 10 ? `${outTimeArray[index + 1].substring(2, 10).replace(/-/g, ".")}` : outTimeArray[index + 1]}</p>
                {carnumArray[index + 1] && <p style={{ color: "#FFFFFF", fontSize: "20px", textAlign: "center", display: "flex" }}>{carnumArray[index + 1]}</p>}
                <p style={{ color: "#000000", fontSize: "20px", textAlign: "center", display: "flex", position: "relative", top: viewportHeight * 0.07, fontWeight: "bolder" }}>{outTimeArray[index + 1].length > 10 ? `~${outTimeArray[index + 1].substring(11, 16)}` : outTimeArray[index + 1]}</p>
              </>
            )}
          </Box>
        </button>
      );
    }

    return columns;
  };

  // 행의 수만큼 박스만들기 수행
  const renderBoxRow = () => {
    const rows = [];

    for (let i = 0; i < Boxrow; i++) {
      const row = (
        <div key={`row-${i}`} style={{ display: "flex" }}>
          {renderBoxColumn(i)}
        </div>
      );

      rows.push(row);
    }

    return rows;
  };

  // 주차현황 없을때 빈 박스 만들기
  const nobox = () => {
    const boxes = [];
    for (let i = 0; i < Boxrow; i++) {
      for (let j = 0; j < BoxColumn; j++) {
        boxes.push(
          <button key={`${i}-${j}`} style={{ border: "none", backgroundColor: "transparent", padding: 0 }}>
            <Box
              key={`${i}-${j}`}
              sx={{
                width: "4rem",
                height: "5rem",
                marginRight: "1rem",
                marginLeft: "1rem",
                marginBottom: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFFFFF",
                flexDirection: "column", // 수직 방향으로 아이콘과 텍스트 정렬
              }}
            ></Box>
          </button>
        );
      }
    }
  };

  // 전체 현황 만들기
  const renderBoxGrid = () => {
    if (BoxItem.length !== 0) {
      return (
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "5rem",
          }}
        >
          {renderBoxRow()}
        </div>
      );
    } else {
      return nobox();
    }
  };

  const drawParkingLotCol = (i) => {
    let cols = [];

    for (let j = 0; j < BoxColumn; j++) {
      const index = i * BoxColumn + j;
      const MycarIcon = index === mycar - 1;

      cols.push(
        <button key={`${i}-${j}`} onClick={MycarIcon ? handleOpenMycarPage : null} style={{ border: "none", backgroundColor: "transparent", padding: 0 }}>
          <Box
            key={`${i}-${j}`}
            sx={{
              width: "6rem",
              height: "8rem",
              margin: "1rem",
              textAlign: "center",
              backgroundColor: MycarIcon ? "#006DD1" : outTimeArray[index + 1] !== "" ? "#EA6868" : "#FFFFFF",
            }}
          >
            {MycarIcon && (
              <>
                <div>
                  {/* <img src={process.env.PUBLIC_URL + "/img/mobile/mycaricon2.png"} alt={"mycarimg2"} style={{ position: "relative", top: "-1.2rem" }}></img> */}
                  <PinDropRoundedIcon sx={{ position: "relative", top: "-1.7rem", fontSize: "3rem" }} />
                </div>
                <div>
                  {/* <img src={process.env.PUBLIC_URL + "/img/mobile/mycar.png"} alt={"carimg"}></img> */}
                  <DirectionsCarFilledIcon sx={{ fontSize: "4rem", color: "white" }} />
                </div>
              </>
            )}
            {/* {!MycarIcon && outTimeArray[index + 1] && ( // 주차 시간 등록하지 않으면 제대로 안 나옴 */}

            {/* refactor: 여기 날짜랑 시간 디자인 약간 손봐야 함 */}
            {!MycarIcon && outTimeArray[index + 1] !== "" && (
              <>
                {outTimeArray[index + 1] != null && <p style={{ color: "#B3B3B3", fontSize: "16px", textAlign: "center" }}>{outTimeArray[index + 1].length > 10 ? `${outTimeArray[index + 1].substring(2, 10).replace(/-/g, ".")}` : outTimeArray[index + 1]}</p>}
                {carnumArray[index + 1] && (
                  <div style={{ display: "flex", width: "100%", height: "100%", textAlign: "center", alignItems: "center" }}>
                    <div style={{ width: "100%", color: "#FFFFFF", fontSize: "1.3rem", textAlign: "center" }}>{carnumArray[index + 1]}</div>
                  </div>
                )}
                {outTimeArray[index + 1] != null && (
                  <p style={{ color: "#000000", fontSize: "20px", textAlign: "center", display: "flex", position: "relative", top: viewportHeight * 0.07, fontWeight: "bolder" }}>{outTimeArray[index + 1].length > 10 ? `~${outTimeArray[index + 1].substring(11, 16)}` : outTimeArray[index + 1]}</p>
                )}
              </>
            )}
          </Box>
        </button>
      );
    }
    return cols;
  };

  const drawParkingLotRow = () => {
    console.log(outTimeArray);
    let rows = [];
    if (BoxColumn != 0) {
      for (let i = 0; i < 2; i++) {
        const row = (
          <div>
            <div style={{ display: "flex", justifyContent: "center" }}>{drawParkingLotCol(i)}</div>
          </div>
        );

        rows.push(row);
      }
    }
    return rows;
  };

  return (
    <React.Fragment>
      <Container sx={{ height: "90%", width: "100%" }}>
        <div className="parkinglot-main-text">
          <div style={{ fontSize: "1.8rem" }}>
            <div>
              <span className="highlight bold-text">{name}</span>님을 위한
            </div>
            <div style={{ marginTop: "0.3rem" }}>오늘의 주차 정보!</div>
          </div>
        </div>
        <Box className="ParkinglotBox" sx={{ width: viewportWidth, height: viewportHeight * 0.78, backgroundColor: "#F2F2F2", borderRadius: "1.5rem" }}>
          <div className="parkinglot-content-header-container" style={{ marginTop: "1.5rem" }}>
            <div>
              <KeyboardDoubleArrowUpRoundedIcon sx={{ fontSize: "2.3rem" }} />
            </div>
            <span className="bold-text" style={{ fontSize: "1.5rem" }}>
              입출구
            </span>
          </div>
          <div className="parkinglot-content-box-container" style={{ marginTop: "1.3rem", padding: "0 1.5rem" }}>
            <div className="parkinglot-box-container">{drawParkingLotRow()}</div>
          </div>
          {/* <p style={{ position: "relative", top: "4rem", fontWeight: "bolder" }}>입출구</p> */}

          {/* <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: viewportWidth, height: viewportHeight * 0.4, justifyContent: "center", marginTop: "8rem" }}>
            <Grid container justifyContent="center">
              {renderBoxGrid()}
            </Grid>
          </Box> */}
          {/* <Box sx={{ position: "absolute", top: "2rem", width: viewportWidth * 0.1, height: viewportHeight * 0.73, backgroundColor: "#B3B3B3", borderRadius: "0rem 1rem 0rem 0rem" }} /> */}
          {/* <Box sx={{ position: "absolute", top: "2rem", left: viewportWidth * 0.9, width: viewportWidth * 0.1, height: viewportHeight * 0.73, backgroundColor: "#B3B3B3", borderRadius: "1rem 0rem 0rem 0rem" }} /> */}
          {/* <Box sx={{ position: "absolute", top: viewportHeight * 0.6, left: viewportWidth * 0.1, width: viewportWidth * 0.8, height: viewportHeight * 0.2, backgroundColor: "#B3B3B3" }} /> */}
        </Box>

        <InCar open={open} />

      </Container>
      <Footer HomeiconColor="#006DD1" />
    </React.Fragment>
  );
}

export default Parkinglot;
