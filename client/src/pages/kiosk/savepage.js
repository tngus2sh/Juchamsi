import Footer from "./footer";
import TextField from "@mui/material/TextField";
import * as React from "react";
import "./savepage.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import http from "../../axios/http"
import { useDispatch, useSelector } from "react-redux";

function Savepage() {
  const navigate = useNavigate();
  const villaId = useSelector((state) => state.kioskInfo.kioskVillaId);
  const [idValue, setIdValue] = React.useState("");
  const [pwValue, setPwValue] = React.useState("");
  const [activeField, setActiveField] = React.useState("id");
  let inputid = "";
  let inputpw = "";

  const handleIdChange = (newValue) => {
    setIdValue(newValue);
    if (newValue.length === 4) {
      setActiveField("pw");
    }
  };

  const handlePwChange = (newValue) => {
    setPwValue(newValue);
  };

  const handleButtonClick = (number) => {
    console.log(number);
    if (activeField === "id") {
      setIdValue((prevValue) => (prevValue.length < 4 ? prevValue + number : prevValue));
      if (idValue.length + 1 === 4) {
        setActiveField("pw");
      }
    } else if (activeField === "pw") {
      setPwValue((prevValue) => (prevValue.length < 6 ? prevValue + number : prevValue));
      if (pwValue.length + 1 === 7) {
        alert("확인 버튼을 눌러주세요.");
      }
    }
  };

  const handleClearClick = () => {
    if (activeField === "id") {
      setIdValue("");
    } else if (activeField === "pw") {
      setPwValue("");
    }
  };

  const handleOkClick = () => {
    responseCheck();
    navigate("/Kiosk/savingpage");
  };

  async function responseCheck() {
    //HTTP POST 요청 보내기
    await http
      .post(`//`, {
        villaId : villaId,
        villaNumber : idValue,
        passward : pwValue,
      })
      .then((response) => {
        console.log(response.data);
        // 받은 정보들로 IoT와 통신하여 열쇠보관함 open

      }).catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("Error while submitting:", error);
      });
    }

  const buttonSX = {
    fontSize: "1.3rem",
    padding: "0.7rem",
    margin: "0.1rem",
    width: "11rem",
    backgroundColor: "#112d4e",
    "&:hover": {
      backgroundColor: "#112d4e",
    },
  };

  function repeatKeypad() {
    let arr = [];
    for (let i = 1; i <= 9; i++) {
      arr.push(
        <Button variant="contained" onClick={() => handleButtonClick(i)} sx={buttonSX}>
          {i}
        </Button>
      );
      if (i % 3 === 0) {
        arr.push(<br />);
      }
    }
    return arr;
  }

  return (
    <div className="main">
      <div className="wrapper">
        {/* 로고 */}
        <div className="logo-container">
          <img className="kiosklogo" src={process.env.PUBLIC_URL + "/img/kiosk/logo.png"} alt={"title"}></img>
        </div>

        {/* 개인정보 입력 */}
        <div className="user-container">
          {/* 아이디 입력창 */}
          <div className="id-container">
            <TextField
              className="id-field"
              required
              inputProps={{ maxLength: 5 }}
              type="text"
              variant="standard"
              id="outlined-required1"
              label="빌라 호수"
              value={idValue}
              onChange={(e) => handleIdChange(e.target.value)}
              onFocus={() => setActiveField("id")}
              sx={{ width: "35rem", "& input": { textAlign: "center" } }}
            />
          </div>

          {/* 간편비밀번호or인증번호 입력창 */}
          <div className="password-container">
            <TextField
              className="pw-field"
              required
              inputProps={{ maxLength: 6 }}
              type="text"
              variant="standard"
              id="outlined-required2"
              label="간편 비밀번호 or 인증번호"
              value={pwValue}
              onChange={(e) => handlePwChange(e.target.value)}
              onFocus={() => setActiveField("pw")}
              sx={{ width: "35rem", "& input": { textAlign: "center" } }}
            />
          </div>
        </div>

        {/* 숫자 키패드 */}
        <div className="keypad-container">
          {repeatKeypad()}
          <Button variant="contained" onClick={handleClearClick} sx={buttonSX}>
            지우기
          </Button>
          <Button variant="contained" onClick={() => handleButtonClick("0")} sx={buttonSX}>
            0
          </Button>
          <Button variant="contained" onClick={handleOkClick} sx={buttonSX}>
            확인
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Savepage;
