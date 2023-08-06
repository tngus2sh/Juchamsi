import './findid.css';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';

function Findid() {
  const navigate = useNavigate()
  const [name, setName] = React.useState('');
  const [phonenumber, setPhoneNumber] = React.useState('');
  const [isFindUserid, setIsFindUserid] = React.useState(false);

  React.useEffect(() => {
    // 이름이 2글자 이상이고 핸드폰 번호가 10자 이상일 때에만 스타일 변경
    if (name.length >= 2 && phonenumber.length >= 10) {
      setIsFindUserid(true);
    } else {
      setIsFindUserid(false);
    }
  }, [name, phonenumber]);

  // 이름 입력값이 변경될 때 호출되는 이벤트 핸들러
  const handleNameChange = (e) => {
    const onlyKorean = e.target.value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    const namemaxLength = 4;
    const nametruncatedValue = onlyKorean.slice(0,namemaxLength)
    setName(nametruncatedValue);
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
  const handleOpenFindId = () => {
    // 아이디 찾기 결과 페이지로 이동
    if (name.length >= 2 && phonenumber.length >= 10) {
        navigate('/Mobile/Findid/Result')
    }
  };

  const handleOpen = () => {
    // 아이디 찾기 결과 페이지로 이동
    navigate('/Mobile/Login')
    }

  return (
    <div>
      <TextField
        required
        className="name"
        id="outlined-name-input"
        label="이름"
        name="name"
        value={name}
        onChange={handleNameChange}
        sx={{ '& input': {textAlign: 'center',},}}
      />
      <TextField
        required
        className="phonenumber"
        id="outlined-phonenumber-input"
        label="핸드폰 번호"
        name="phonenumber"
        value={phonenumber}
        onChange={handlePhoneNumberChange}
        sx={{ '& input': {textAlign: 'center',},}}
      />
      <Box
        component="span"
        className={`findbox1 ${isFindUserid ? 'findbox2' : 'findbox1'}`}
        onClick={handleOpenFindId}
      >
        <p className="findidtext1">확인</p>
      </Box>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <p className='loginbtntext'>아이디를 찾을 필요가 없으신가요? </p>
        <div className='findloginbtn'>
        <Button onClick={handleOpen}>로그인</Button>
        </div>
      </div>
      <img
        className="logo"
        src={process.env.PUBLIC_URL + '/img/kiosk/logo1.png'}
        alt={'title'}
      ></img>
    </div>
  );
}

export default Findid;
