import Footer from './footer';
import * as React from 'react';
import Timer from './timer'
import './otherkeypage.css'
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

function OtherKeypage() {
    let lockernum = 1
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
            <Timer/>
            <div className='otherkeytext1'>
                <p>{lockernum}번 사물함의 키를 사용하신 이후 다시 보관하신다음</p>
                <p>확인버튼을 눌러주시기 바랍니다.</p>
            </div>
            <Box component="span" className="otherkeybox1" onClick={handleOpenMainPage}>
                <p className="otherkeytext2">확인</p>
            </Box>
            <Footer />
        </div>
    )
}

export default OtherKeypage;