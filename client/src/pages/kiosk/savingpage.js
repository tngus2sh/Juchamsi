import Footer from './footer';
import * as React from 'react';
import Timer from './timer'
import './savingpage.css'
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

function Savingpage() {
    let lockernum = 1
    const navigate = useNavigate();
    const handleOpenSavePage = () => {
        // 결과 페이지로 이동
        navigate('/Kiosk/saveresultpage');
      };
    return (
        <div>
            {/* 로고 */}
            <img
            className="logo"
            src={process.env.PUBLIC_URL + '/img/kiosk/예비로고.png'}
            alt={'title'}
            ></img>
            <Timer/>
            <div className='savingpagetext1'>
                <p>{lockernum}번 사물함에 키를 보관하시고</p>
                <p>확인 버튼을 눌러 주시기 바랍니다.</p>
            </div>
            <Box component="span" className="savingpagebox1" onClick={handleOpenSavePage}>
                <p className="savingpagetext2">확인</p>
            </Box>
            <Footer />
        </div>
    )
}

export default Savingpage;