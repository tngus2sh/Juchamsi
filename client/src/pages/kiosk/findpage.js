import Footer from "./footer";
import TextField from "@mui/material/TextField";
import * as React from "react";
import "./findpage.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function Savepage() {
  const navigate = useNavigate();
  const [pwValue, setPwValue] = React.useState("");
  let inputpw = "";

  const handlePwChange = (newValue) => {
    setPwValue(newValue);
  };

  const handleButtonClick = (number) => {
    setPwValue((prevValue) => (prevValue.length < 6 ? prevValue + number : prevValue));
    if (pwValue.length + 1 === 7) {
      alert("확인 버튼을 눌러주세요.");
    }
  };

  const handleClearClick = () => {
    setPwValue("");
  };

  const handleOkClick = () => {
    inputpw = pwValue;
    // axios요청으로 백과 연결해서 본인 키 찾기 페이지인지 타인 키 찾기 페이지인지 설정 필요
    console.log("Password:", inputpw);
    if (inputpw === "111111") {
      navigate("/Kiosk/findmekeypage");
    } else if (inputpw === "222222") {
      navigate("/Kiosk/otherkeypage");
    }
  };

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
      {/* 로고 */}
      <div className="logo-container">
        <img className="kiosklogo" src={process.env.PUBLIC_URL + "/img/kiosk/logo.png"} alt={"title"}></img>
      </div>

      <div className="find-page-container">
        <div className="user-container">
          {/* 간편비밀번호or인증번호 입력창 */}
          <div className="password-container"></div>
          <TextField className="pw-field" required inputProps={{ maxLength: 6 }} type="text" variant="standard" id="outlined-required2" label="간편 비밀번호 or 인증번호" value={pwValue} onChange={(e) => handlePwChange(e.target.value)} sx={{ width: "35rem", "& input": { textAlign: "center" } }} />
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
