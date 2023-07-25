import Footer from './footer';
import * as React from 'react';
import './mekeypage.css'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';

function Mekeypage() {
    const navigate = useNavigate();
    const handleOpenMainPage = () => {
        // 메인 페이지로 이동
        navigate('/');
      };
    return (
        <div>
            {/* 로고 */}
            <img
            className="logo"
            src={process.env.PUBLIC_URL + '/img/kiosk/예비로고.png'}
            alt={'title'}
            ></img>
            <div className='saveresulttext1'>
                <p>이용해주셔서 감사합니다.</p>
            </div>
            <Box component="span" className="saveresultbox1" onClick={handleOpenMainPage}>
                <p className="saveresulttext2">확인</p>
            </Box>
            <Footer />
        </div>
    )
}


export default Mekeypage;