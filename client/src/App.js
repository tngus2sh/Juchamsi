import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Reset as GlobalReset } from 'styled-reset';

import LoginPage from './pages/login';
import KioskMainPage from './pages/kiosk/main'
import MobileMainPage from './pages/mobile/main'
import KiosksavePage from './pages/kiosk/savepage'
import KioskfindPage from './pages/kiosk/findpage'
import KiosksavingPage from './pages/kiosk/savingpage'
import KiosksaveresultPage from './pages/kiosk/saveresult'
import KioskOtherkeyPage from './pages/kiosk/otherkeypage'

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
              <Route path="/kiosksavepage" element={<KiosksavePage />} />
              <Route path="/kioskfindpage" element={<KioskfindPage />} />
              <Route path="/kiosksavingpage" element={<KiosksavingPage />} />
              <Route path="/kiosksaveresultpage" element={<KiosksaveresultPage />} />
              <Route path="/kioskotherkeypage" element={<KioskOtherkeyPage />} />
          </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
