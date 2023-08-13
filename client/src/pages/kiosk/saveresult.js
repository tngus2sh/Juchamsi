import Footer from "./footer";
import * as React from "react";
import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";
import "./saveresult.css";

function Saveresult() {
  let lockernum = 1;
  const navigate = useNavigate();
  const handleOpenSavePage = () => {
    // 메인 페이지로 이동
    navigate("/");
  };
  return (
    <div className="main">
      {/* 로고 */}
      <div className="logo-container">
        <img className="kiosklogo" src={process.env.PUBLIC_URL + "/img/kiosk/logo.png"} alt={"title"}></img>
      </div>

      <div className="save-result">
        <div className="save-result-container">
          <div className="save-result-flex-container">
            <div className="save-result-main-container">
              <div className="save-result-info-container">
                <p>{lockernum}번 사물함에 키 보관을 완료했습니다.</p>
                <p>이용해주셔서 감사합니다.</p>
              </div>
              <div className="save-result-box-container">
                <div className="save-result-box" onClick={handleOpenSavePage}>
                  <p className="save-result-box-text">확인</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Box component="span" className="saveresultbox1" onClick={handleOpenSavePage}>
        <p className="saveresulttext2">확인</p>
      </Box> */}
      <Footer />
    </div>
  );
}

export default Saveresult;
