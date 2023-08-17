import "./findpw.css";
import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { useNavigate } from "react-router";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import http from "../../axios/http";

function Findpw() {
  const style = {
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

  const [trueopen, settrueOpen] = React.useState(false);
  const [falseopen, setfalseOpen] = React.useState(false);
  const navigate = useNavigate();
  const [id, setID] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [isFindUserid, setIsFindUserid] = useState(false);

  useEffect(() => {
    // 아이디가 6글자 이상이고 핸드폰 번호가 10자 이상일 때에만 스타일 변경
    if (id.length >= 6 && phonenumber.length >= 10) {
      setIsFindUserid(true);
    } else {
      setIsFindUserid(false);
    }
  }, [id, phonenumber]);

  // 아이디 입력값이 변경될 때 호출되는 이벤트 핸들러
  const handleIDChange = (e) => {
    // 영어 대소문자, 숫자만 입력 가능하도록 정규식을 이용하여 유효성 검사
    const onlyID = e.target.value.replace(/[^a-zA-Z0-9]/g, "");

    // 최대 15자까지만 입력 가능하도록 제한
    const IDmaxLength = 15;
    const IDtruncatedValue = onlyID.slice(0, IDmaxLength);

    setID(IDtruncatedValue);
  };

  // 핸드폰 번호 입력값이 변경될 때 호출되는 이벤트 핸들러
  const handlePhoneNumberChange = (e) => {
    // 숫자만 입력 가능하도록 정규식을 이용하여 유효성 검사
    const onlyNumbers = e.target.value.replace(/[^\d]/g, "");

    // 최대 11자까지만 입력 가능하도록 제한
    const maxLength = 11;
    const truncatedValue = onlyNumbers.slice(0, maxLength);

    setPhoneNumber(truncatedValue);
  };

  const handlecheckFalse = () => {
    setfalseOpen(false)
  }

  const handlecheckTrue = () => {
    settrueOpen(true)
    navigate("/Mobile/Login")
  }

  // 확인 버튼 클릭 시 호출되는 이벤트 핸들러
  const handleOpenFindPW = () => {
    // 비밀번호 찾기 결과 페이지로 이동
    if (id.length >= 6 && phonenumber.length >= 10) {
      http({
        method: "post",
        url: `/sms/password`,
        data: {
          to:phonenumber,
          userId:id
        }
      })
        .then((res) => {
          console.log(res)
          if (res.data.success === true) {
            settrueOpen(true)
          } else {
            setfalseOpen(true)
          }
        })
        .catch((err) => {
          console.log(err)
        });
    }
  };

  const handleOpenLogin = () => {
    // 로그인 페이지로 이동
    navigate("/Mobile/Login");
  };


  return (
    <div className="find-pw-main">
      <div className="header">
        <img className="mobile-logo" src={process.env.PUBLIC_URL + "/img/mobile/logo.png"} alt={"title"}></img>
      </div>

      <div className="find-pw-page-container">
        <div className="id-container">
          <input required className="login-input" placeholder="아이디" label="아이디" name="id" value={id} onChange={handleIDChange}></input>
        </div>

        <div className="phone-number-container">
          <input required className="login-input" placeholder="핸드폰 번호" label="" name="phonenumber" value={phonenumber} onChange={handlePhoneNumberChange}></input>
        </div>

        <div className="find-pw-button-container">
          <button className={`find-pw-box ${isFindUserid ? "find-box-active" : "find-box-deactive"}`} onClick={handleOpenFindPW}>
            확인
          </button>
        </div>

        <div className="find-login-container">
          <div className="find-login-flex-container">
            <div className="signin-info">
              <p>이미 회원가입 하셨나요?</p>
            </div>

            <div className="signin-btn">
              <Button onClick={handleOpenLogin} style={{ fontSize: "0.87rem" }}>
                로그인
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 비밀번호 찾기 성공할 경우 보여주는 모달 */}
      <Modal open={trueopen} onClose={handlecheckTrue} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
        <div className="modal-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
          <div className="modal-title-container" style={{ marginTop: "2rem" }}>
            <span className="bold-text" style={{ fontSize: "1.3rem" }}>
            비밀번호 찾기 성공
            </span>
          </div>
          <div className="modal-content-container" style={{ flex: "1" }}>
            <div className="modal-content-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
              <div className="modal-content-input-container" style={{ width: "70%" }}>
                <Typography sx={{ marginTop: "0.4rem", fontSize: "0.8rem" }}>
                핸드폰 번호로 임시비밀번호를 
                <br/>
                발급해드렸습니다.
                <br />
                <br />
                해당 임시비밀번호로 로그인을
                <br/>
                진행해주시기바랍니다.
                </Typography>
                <button className="login-box" onClick={handlecheckTrue} style={{ marginTop: "1.7rem", backgroundColor: "#006DD1", color: "white" }}>
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
        </Box>
      </Modal>

      {/* 비밀번호 찾기 실패한 경우 보여주는 모달 */}
      <Modal open={falseopen} onClose={handlecheckFalse} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
        <div className="modal-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
          <div className="modal-title-container" style={{ marginTop: "2rem" }}>
            <span className="bold-text" style={{ fontSize: "1.3rem" }}>
            비밀번호 찾기 실패
            </span>
          </div>
          <div className="modal-content-container" style={{ flex: "1" }}>
            <div className="modal-content-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
              <div className="modal-content-input-container" style={{ width: "70%" }}>
                <Typography sx={{ marginTop: "0.4rem", fontSize: "0.8rem" }}>
                입력하신 아이디 및 핸드폰 번호와
                <br/>
                일치한 회원정보를 찾지 못했습니다.
                <br />
                <br />
                입력현황을 다시확인하시고 재시도
                <br/>
                해주시기 바랍니다.
                </Typography>
                <button className="login-box" onClick={handlecheckFalse} style={{ marginTop: "1.7rem", backgroundColor: "#006DD1", color: "white" }}>
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Findpw;
