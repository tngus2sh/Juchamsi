import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Reset as GlobalReset } from 'styled-reset';

import LoginPage from './pages/web/login';
import SignUpPage from './pages/web/signup';
import WebMainPage from './pages/web/mainpage'
import KioskMainPage from './pages/kiosk/main'
import KiosksavePage from './pages/kiosk/savepage'
import KioskfindPage from './pages/kiosk/findpage'
import KiosksavingPage from './pages/kiosk/savingpage'
import KiosksaveresultPage from './pages/kiosk/saveresult'
import KioskOtherkeyPage from './pages/kiosk/otherkeypage'
import KioskMeKeyPage from './pages/kiosk/mekeypage'
import MobileLoginPage from './pages/mobile/login'
import MobileFindIdPage from './pages/mobile/findid'
import MobileFindResultpage from './pages/mobile/finidresult'
import MobileFindPwPage from './pages/mobile/findpw'
import MobileSignupPage from './pages/mobile/signup'
import MobileParkinglogPage from './pages/mobile/parkinglot'
import MobileMycarparkingPage from './pages/mobile/mycarparking'
import MobileTermessagePage from './pages/mobile/termessage'
import MobileTermessageChatPage from './pages/mobile/messagedetail'
import MobileAccountPage from './pages/mobile/account'
import MobileUpdateAccountPage from './pages/mobile/updateaccount'
import MobileMileageChangePage from './pages/mobile/MileageChange'
import MobilePasswordUpdatePage from './pages/mobile/passwordchange'

import './App.css';

function App() {

  return (
    <div className="App">
        <GlobalReset/>
          <BrowserRouter>
            <Routes>
            <Route
            path="/"
            element={
            <Navigate
              to={
                window.matchMedia('(max-width: 600px)').matches
                  ? '/Mobile/Login'
                  : window.matchMedia('(max-width: 1000px)').matches
                  ? '/Kiosk/Main'
                  : '/Web/Main'
              }
            />
            }
          />
              <Route path="/Web/Main" element={<LoginPage />} />
              <Route path="/Kiosk/Main" element={<KioskMainPage />} />
              <Route path="/Kiosk/savepage" element={<KiosksavePage />} />
              <Route path="/Kiosk/findpage" element={<KioskfindPage />} />
              <Route path="/Kiosk/savingpage" element={<KiosksavingPage />} />
              <Route path="/Kiosk/saveresultpage" element={<KiosksaveresultPage />} />
              <Route path="/Kiosk/otherkeypage" element={<KioskOtherkeyPage />} />
              <Route path="/kiosk/findmekeypage" element={<KioskMeKeyPage />} />
              <Route path="/signup" element={<SignUpPage />}/>
              <Route path="/Mobile/Login" element={<MobileLoginPage />}/>
              <Route path="/Mobile/Findid" element={<MobileFindIdPage />}/>
              <Route path="/Mobile/Findid/Result" element={<MobileFindResultpage />}/>
              <Route path="/Mobile/Findpw" element={<MobileFindPwPage />}/>
              <Route path="/Mobile/Signup" element={<MobileSignupPage />}/>
              <Route path="/Mobile/Parkinglot" element={<MobileParkinglogPage />}/>
              <Route path="/Mobile/Mycar" element={<MobileMycarparkingPage />}/>
              <Route path="/Mobile/Termessage" element={<MobileTermessagePage />} />
              <Route path="/Mobile/Termessage/:id" element={<MobileTermessageChatPage />} />
              <Route path="/Mobile/Account" element={<MobileAccountPage />}/>
              <Route path="/Mobile/Account/Update" element={<MobileUpdateAccountPage />}/>
              <Route path="/Mobile/Mileage/Change" element={<MobileMileageChangePage />}/>
              <Route path="/Mobile/Acoount/Update/PasswordChange" element={<MobilePasswordUpdatePage />}/>
              <Route path="/mainPage" element={ <WebMainPage/>} />
          </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
