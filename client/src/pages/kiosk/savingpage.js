import Footer from "./footer";
import * as React from "react";
import Timer from "./timer";
import "./savingpage.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Savingpage() {
  let lockernum = 1;
  const navigate = useNavigate();

  const handleOpenSavePage = () => {
    responseClose();
    // 결과 페이지로 이동
    navigate("/Kiosk/saveresultpage");
  };

  async function responseClose() {
    //HTTP POST 요청 보내기
    await axios
      .post(`http://192.168.100.251/close`, { groundMacAddress: "CC:DB:A7:69:74:4A" })
      .then((response) => {
        console.log(response.data);

      }).catch((error) => {
        // 요청 실패 시 에러 처리
        console.error("Error while submitting:", error);
      });
  }

  return (
    <div className="main">
      {/* 로고 */}
      <div className="logo-container">
        <img className="kiosklogo" src={process.env.PUBLIC_URL + "/img/kiosk/logo.png"} alt={"title"}></img>
      </div>

      <div className="saving-page-container">
        <div className="saving-page-flex-container">
          <Timer />

          <div className="saving-page-info-container">
            <div className="saving-page-info">
              <div className="saving-page-text">
                <div>
                  <p className="saving-page-info-text">
                    {lockernum}번 사물함에 키를 보관하시고
                    <br />
                    확인 버튼을 눌러 주세요.
                  </p>
                </div>

                <div className="saving-page-box" onClick={handleOpenSavePage}>
                  <p className="saving-page-info-button">확인</p>
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

export default Savingpage;
