import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Reset as GlobalReset } from 'styled-reset';

import LoginPage from './pages/login';
// import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
        <GlobalReset/>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LoginPage />} />
          </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;
