import Footer from "./footer";
import * as React from "react";
import "./mekeypage.css";
import { useNavigate } from "react-router-dom";
// import Box from "@mui/material/Box";

function Mekeypage() {
  const lockernum = 1;
  const navigate = useNavigate();
  const handleOpenMainPage = () => {
    // 메인 페이지로 이동
    navigate("/");
  };
  return (
    <div className="main">
      {/* 로고 */}
      <div className="logo-container">
        <img className="kiosklogo" src={process.env.PUBLIC_URL + "/img/kiosk/logo.png"} alt={"title"}></img>
      </div>

      <div className="me-key-page">
        <div className="me-key-page-container">
          <div className="me-key-page-flex-container">
            <div className="me-key-page-main-container">
              <div className="me-key-page-info-container">
                <p>이용해주셔서 감사합니다.</p>
                <p>{lockernum}번 사물함에서 키를 찾아가시면 됩니다.</p>
              </div>
              <div className="me-key-page-box-container">
                <div className="me-key-page-box" onClick={handleOpenMainPage}>
                  <p className="me-key-page-box-text">확인</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Mekeypage;
