import Footer from './footer';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import './savepage.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

function Savepage() {
  const navigate = useNavigate();
  const [idValue, setIdValue] = React.useState('');
  const [pwValue, setPwValue] = React.useState('');
  const [activeField, setActiveField] = React.useState('id');
  let inputid = '';
  let inputpw = '';

  const handleIdChange = (newValue) => {
    setIdValue(newValue);
    if (newValue.length === 4) {
      setActiveField('pw');
    }
  };

  const handlePwChange = (newValue) => {
    setPwValue(newValue);
  };

  const handleButtonClick = (number) => {
    if (activeField === 'id') {
      setIdValue((prevValue) => (prevValue.length < 4 ? prevValue + number : prevValue));
      if (idValue.length + 1 === 4) {
        setActiveField('pw');
      }
    } else if (activeField === 'pw') {
      setPwValue((prevValue) => (prevValue.length < 6 ? prevValue + number : prevValue));
      if (pwValue.length + 1 === 7) {
        alert('확인 버튼을 눌러주세요.');
      }
    }
  };

  const handleClearClick = () => {
    if (activeField === 'id') {
      setIdValue('');
    } else if (activeField === 'pw') {
      setPwValue('');
    }
  };

  const handleOkClick = () => {
    inputid = idValue;
    inputpw = pwValue;
    // You can now use inputid and inputpw variables as needed
    console.log('ID:', inputid);
    console.log('Password:', inputpw);
    navigate('/kiosksavingpage');
  };

  return (
    <div>
      {/* 로고 */}
      <img
        className="logo"
        src={process.env.PUBLIC_URL + '/img/kiosk/예비로고.png'}
        alt={'title'}
      ></img>
      {/* 아이디 입력창 */}
      <TextField
        className="idfiled"
        required
        inputProps={{ maxLength: 4}}
        type="text"
        variant="standard"
        id="outlined-required1"
        label="아이디(핸드폰번호 뒷자리)"
        value={idValue}
        onChange={(e) => handleIdChange(e.target.value)}
        onFocus={() => setActiveField('id')}
        sx={{ position: 'absolute', left: '15%', top: '25%', width: '70%','& input': {textAlign: 'center',},}}
      />
      {/* 간편비밀번호or인증번호 입력창 */}
      <TextField
        className="pwfiled"
        required
        inputProps={{ maxLength: 6}}
        type="text"
        variant="standard"
        id="outlined-required2"
        label="간편비밀번호or인증번호"
        value={pwValue}
        onChange={(e) => handlePwChange(e.target.value)}
        onFocus={() => setActiveField('pw')}
        sx={{ position: 'absolute', left: '15%', top: '35%', width: '70%' , '& input': {textAlign: 'center',},}}
      />
      {/* 숫자 키패드 */}
      <div className="keypad">
        <Button variant="outlined" onClick={() => handleButtonClick('1')} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>1</Button>
        <Button variant="outlined" onClick={() => handleButtonClick('2')} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>2</Button>
        <Button variant="outlined" onClick={() => handleButtonClick('3')} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>3</Button>
        <br />
        <Button variant="outlined" onClick={() => handleButtonClick('4')} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>4</Button>
        <Button variant="outlined" onClick={() => handleButtonClick('5')} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>5</Button>
        <Button variant="outlined" onClick={() => handleButtonClick('6')} sx={{ fontSize: '24px', padding: '10px', width:'180px;' }}>6</Button>
        <br />
        <Button variant="outlined" onClick={() => handleButtonClick('7')} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>7</Button>
        <Button variant="outlined" onClick={() => handleButtonClick('8')} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>8</Button>
        <Button variant="outlined" onClick={() => handleButtonClick('9')} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>9</Button>
        <br />
        <Button variant="outlined" onClick={handleClearClick} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>지우기</Button>
        <Button variant="outlined" onClick={() => handleButtonClick('0')} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>0</Button>
        <Button variant="outlined" onClick={handleOkClick} sx={{ fontSize: '24px', padding: '10px', width:'180px;'}}>확인</Button>
      </div>
      <Footer />
    </div>
  );
}

export default Savepage;
