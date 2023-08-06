import Footer from "./footer";
import * as React from "react";
import Timer from "./timer";
import "./otherkeypage.css";
// import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

function OtherKeypage() {
  let lockernum = 1;
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

      <div className="other-key-page-container">
        <div className="other-key-page-flex-container">
          <Timer />

          <div className="other-key-page-info-container">
            <div className="other-key-page-info">
              <div className="other-key-page-text">
                <div>
                  <p className="other-key-page-info-text">
                    {lockernum}번 사물함의 키를 사용하신 후,
                    <br />
                    다시 보관하시고
                    <br />
                    확인버튼을 눌러주세요.
                  </p>
                </div>

                <div className="other-key-page-box" onClick={handleOpenMainPage}>
                  <p className="other-key-page-info-button">확인</p>
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

export default OtherKeypage;
