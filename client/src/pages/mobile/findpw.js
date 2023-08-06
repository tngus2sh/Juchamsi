import './findpw.css';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

function Findpw() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 220,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpensuccess = () => setOpen(true);
  const handleOpenfailure = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const [id, setID] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [isFindUserid, setIsFindUserid] = useState(false);
  // 모달창(비밀번호 찾기 성공or실패 판별)
  const [backresult, setBackResult] = useState(false);

  useEffect(() => {
    // backresult의 값에 따라 setBackResult 설정
    if (backresult === true) {
      setBackResult(true);
    } else {
      setBackResult(false);
    }
  }, [backresult]);

  useEffect(() => {
    // 아이디가 6글자 이상이고 핸드폰 번호가 10자 이상일 때에만 스타일 변경
    if (id.length >= 6 && phonenumber.length >= 10) {
      setIsFindUserid(true);
    } else {
      setIsFindUserid(false);
    }
  }, [id, phonenumber]);

  // 아이디 입력값이 변경될 때 호출되는 이벤트 핸들러
  const handleIDChange = (e) => {
    // 영어 대소문자, 숫자만 입력 가능하도록 정규식을 이용하여 유효성 검사
    const onlyID = e.target.value.replace(/[^a-zA-Z0-9]/g, '');

    // 최대 15자까지만 입력 가능하도록 제한
    const IDmaxLength = 15;
    const IDtruncatedValue = onlyID.slice(0, IDmaxLength);

    setID(IDtruncatedValue);
  };

  // 핸드폰 번호 입력값이 변경될 때 호출되는 이벤트 핸들러
  const handlePhoneNumberChange = (e) => {
    // 숫자만 입력 가능하도록 정규식을 이용하여 유효성 검사
    const onlyNumbers = e.target.value.replace(/[^\d]/g, '');

    // 최대 11자까지만 입력 가능하도록 제한
    const maxLength = 11;
    const truncatedValue = onlyNumbers.slice(0, maxLength);

    setPhoneNumber(truncatedValue);
  };

  // 확인 버튼 클릭 시 호출되는 이벤트 핸들러
  const handleOpenFindPW = () => {
    // 비밀번호 찾기 결과 페이지로 이동
    if (id.length >= 6 && phonenumber.length >= 10) {
      // backresult 상태에 따라 다른 모달 메시지를 보여줍니다.
      if (backresult) {
        // 성공 결과를 보여주는 모달
        handleOpensuccess(); // 모달 열기
      } else {
        // 실패 결과를 보여주는 모달
        handleOpenfailure();
      }
    }
  };

  const handleOpenLogin = () => {
    // 로그인 페이지로 이동
    navigate('/Mobile/Login');
  };

  const handleOpenID = () => {
    // 로그인 페이지로 이동
    navigate('/Mobile/Findid');
  };

  return (
    <div>
      <TextField
        required
        className="pwtoinputid"
        id="outlined-id-input"
        label="아이디"
        name="id"
        value={id}
        onChange={handleIDChange}
        sx={{ '& input': { textAlign: 'center' } }}
      />
      <Button className="pwtoid" onClick={handleOpenID}>
        아이디 찾기
      </Button>
      <TextField
        required
        className="pwtoinputphonenumber"
        id="outlined-phonenumber-input"
        label="핸드폰 번호"
        name="phonenumber"
        value={phonenumber}
        onChange={handlePhoneNumberChange}
        sx={{ '& input': { textAlign: 'center' } }}
      />
      <Box
        component="span"
        className={`findbox1 ${isFindUserid ? 'findbox2' : 'findbox1'}`}
        onClick={handleOpenFindPW}
      >
        <p className="findidtext1">확인</p>
      </Box>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p className="loginbtntext">비밀번호를 찾을 필요가 없으신가요? </p>
        <div className="findpwloginbtn">
        <Button  onClick={handleOpenLogin}>
          로그인
        </Button>
        </div>
      </div>
      <img
        className="logo"
        src={process.env.PUBLIC_URL + '/img/kiosk/logo1.png'}
        alt={'title'}
      ></img>

      {/* 성공 결과를 보여주는 모달 */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign:'center'}}>
            비밀번호 찾기 성공
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          핸드폰 번호로 임시비밀번호를 발급해드렸습니다.
          <br />
          <br />
          해당 임시비밀번호로 로그인을 진행해주시기바랍니다.
          </Typography>
        </Box>
      </Modal>
      {/* 실패 결과를 보여주는 모달 */}
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign:'center'}}>
            비밀번호 찾기 실패
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          입력하신 아이디 및 핸드폰 번호와 일치한 회원정보를 찾지 못했습니다.
          <br />
          <br />
          입력현황을 다시확인하시고 재시도하시거나 회원가입을 진행해주시기 바랍니다.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default Findpw;
