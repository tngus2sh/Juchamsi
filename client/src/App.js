import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Reset as GlobalReset } from "styled-reset";
import LoginPage from "./pages/web/login";
import SignUpPage from "./pages/web/signup";
import WebMainPage from "./pages/web/mainpage";
import MobileLoginPage from "./pages/mobile/login";
import MobileFindPwPage from "./pages/mobile/findpw";
import MobileSignupPage from "./pages/mobile/signup";
import MobileParkinglogPage from "./pages/mobile/parkinglot";
import MobileMycarparkingPage from "./pages/mobile/mycarparking";
import MobileTermessagePage from "./pages/mobile/termessage";
import MobileTermessageChatPage from "./pages/mobile/messagedetail";
import MobileAccountPage from "./pages/mobile/account";
import MobileUpdateAccountPage from "./pages/mobile/updateaccount";
import MobileMileageChangePage from "./pages/mobile/MileageChange";
import MobilePasswordUpdatePage from "./pages/mobile/passwordchange";
import MobileTermessageSystemPage from "./pages/mobile/messagedetailsystem";
import "./App.css";

function App() {

  function setScreenSize() {
    //먼저 뷰포트 높이를 얻고 1%를 곱하여 vh 단위 값을 얻습니다.
    let vh = window.innerHeight * 0.01;
    //그런 다음 --vh 사용자 정의 속성의 값을 문서의 루트로 설정합니다.
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  setScreenSize();
  window.addEventListener("resize", setScreenSize);

  return (
    <div className="App">
      <GlobalReset />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={window.matchMedia("(max-width: 700px)").matches ? "/Mobile/Login" : "/Web/Main"} />}
          />
          <Route path="/Web/Main" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/Mobile/Login" element={<MobileLoginPage />} />
          <Route path="/Mobile/Findpw" element={<MobileFindPwPage />} />
          <Route path="/Mobile/Signup" element={<MobileSignupPage />} />
          <Route path="/Mobile/Parkinglot" element={<MobileParkinglogPage />} />
          <Route path="/Mobile/Mycar" element={<MobileMycarparkingPage />} />
          <Route path="/Mobile/Termessage" element={<MobileTermessagePage />} />
          <Route path="/Mobile/Termessage/:id" element={<MobileTermessageChatPage />} />
          <Route path="/Mobile/Termessage/system/:id" element={<MobileTermessageSystemPage />} />
          <Route path="/Mobile/Account" element={<MobileAccountPage />} />
          <Route path="/Mobile/Account/Update" element={<MobileUpdateAccountPage />} />
          <Route path="/Mobile/Mileage/Change" element={<MobileMileageChangePage />} />
          <Route path="/Mobile/Acoount/Update/PasswordChange" element={<MobilePasswordUpdatePage />} />
          <Route path="/mainPage" element={<WebMainPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
