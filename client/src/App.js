import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Reset as GlobalReset } from 'styled-reset';

import LoginPage from './pages/web/login';
import SignUpPage from './pages/web/signup';
import WebMainPage from './pages/web/mainpage'
import KioskMainPage from './pages/kiosk/main'
import MobileMainPage from './pages/mobile/main'
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
import MobileAccountPage from './pages/mobile/account'

import './App.css';

const isMobile = window.matchMedia('(max-width: 600px)').matches;
const isKiosk = window.matchMedia('(max-width: 1000px)').matches;

function App() {
  return (
    <div className="App">
        <GlobalReset/>
          <BrowserRouter>
            <Routes>
            {isMobile ? (
                <Route path="/" element={<MobileMainPage />} />
              ) : isKiosk ? (
                <Route path="/" element={<KioskMainPage />} />
              ) : (
                <Route path="/" element={<LoginPage />} />
              )}
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
<<<<<<< HEAD
=======
              <Route path="/Mobile/Mycar" element={<MobileMycarparkingPage />}/>
              <Route path="/Mobile/Termessage" element={<MobileTermessagePage />}/>
              <Route path="/Mobile/Account" element={<MobileAccountPage />}/>
>>>>>>> 4af6d02b3afdf5a007840fa60f59aa2857f6180c
               <Route path="/mainPage" element={ <WebMainPage/>} />
          </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
