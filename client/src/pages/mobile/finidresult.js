import './findidresult.css';
import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';;

function FindidResult() {
  const navigate = useNavigate()
  // 결과를 보여줄 상태값과 초기값(false)를 설정합니다.
  const [backresult, setBackResult] = useState(true);
  const findid = '예시아이디'
  const viewid = findid.slice(0, -3) + '***';

  const handleOpenSignup = () => {
    navigate('/Mobile/Signup')
  };

  const handleOpenLogin = () => {
    navigate('/Mobile/Login')
  };

  const handleOpenFindid = () => {
    navigate('/Mobile/Findid')
  };

  const handleOpenPW = () => {
    navigate('/Mobile/Findpw')
  }

  useEffect(() => {
    // backresult의 값에 따라 setBackResult 설정
    if (backresult === true) {
        setBackResult(true);
    } else {
        setBackResult(false);
    }
  }, [backresult]);

  return (
    <div>
      {backresult ? (
        <div>
          <p className='findidresulttext1'>해당 내용으로 가입된 아이디는 아래와 같습니다.</p>
          <Box className='findidresultbox1'><p className='findidresulttext2'>{viewid}</p></Box>
          <Box
            component="span"
            className='findresultbox2'
            onClick={handleOpenLogin}
        >
            <p className="findidtext1">확인</p>
        </Box>
        <Button className='findidresultpw' onClick={handleOpenPW}>비밀번호 찾기</Button>
        </div>
      ) : (
        <div>
          <p className='findidresulttext1'>해당 내용으로 가입된 아이디가 없습니다.</p>
          <p className='findidresulttext3'>입력정보를 다시 확인해주시거나 회원가입을 진행해 주시기 바랍니다.</p>
          <Box
            component="span"
            className='findresultbox3'
            onClick={handleOpenFindid}
          >
          <p className="findidresulttext4">재시도</p>
          </Box>
          <Box
            component="span"
            className='findresultbox4'
            onClick={handleOpenSignup}
          >
          <p className="findidresulttext4">회원가입</p>
          </Box>
        </div>
      )}
        <img
        className="logo"
        src={process.env.PUBLIC_URL + '/img/kiosk/예비로고.png'}
        alt={'title'}
      ></img>
    </div>
  );
}

export default FindidResult;
