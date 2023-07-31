// Login.js

import './login.css';
import * as React from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Box from '@mui/material/Box';
import { useSelector, useDispatch } from 'react-redux';
import { setAutoLoginChecked, setUsername, setPassword } from '../../redux/mobileauthlogin';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsernameLocal] = React.useState('');
  const [password, setPasswordLocal] = React.useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux의 상태를 가져와서 사용
  const isAutoLoginChecked = useSelector((state) => state.auth.isAutoLoginChecked);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleOpenID = () => {
    navigate('/Mobile/Findid')
  }

  const handleOpenPW = () => {
    navigate('/Mobile/Findpw')
  }

  const handleOpenSignup = () => {
    navigate('/Mobile/Signup')
  }

  const handleOpenfindPage = () => {
    // 아이디와 비밀번호가 입력되어 있을 때만 이동
    if (username.trim() !== '' && password.trim() !== '') {
      navigate('/kioskfindpage');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsernameLocal(value);
    } else if (name === 'password') {
      setPasswordLocal(value);
    }
  };

  // "자동로그인" 체크를 해제할 때 로그인 정보를 지우는 처리
  const handleAutoLoginCheckboxChange = (event) => {
    const { checked } = event.target;
    dispatch(setAutoLoginChecked(checked));

    if (!checked) {
      // "자동로그인" 체크를 해제했을 때 로그인 정보를 제거
      dispatch(setUsername(''));
      dispatch(setPassword(''));
    }
  };

  // 페이지가 처음 로드될 때 로컬 스토리지에서 자동로그인 정보 가져오기
  React.useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword) {
      setUsernameLocal(storedUsername);
      setPasswordLocal(storedPassword);
      dispatch(setAutoLoginChecked(true));
    }
  }, [dispatch]);

  // 아이디와 비밀번호가 입력되어 있을 때만 버튼을 클릭할 수 있도록 설정
  const isLoginButtonClickable = username.trim() !== '' && password.trim() !== '';

  // 자동로그인 정보를 로컬 스토리지에 저장 또는 제거
  React.useEffect(() => {
    if (isAutoLoginChecked) {
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
  }, [isAutoLoginChecked, username, password]);


  return (
    <div>
      <img
        className="logo"
        src={process.env.PUBLIC_URL + '/img/kiosk/예비로고.png'}
        alt={'title'}
      ></img>
      <TextField
        required
        className='id'
        id="outlined-id-input"
        label="아이디"
        name="username"
        value={username}
        onChange={handleInputChange}
      />
      <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" className='pw' required>
        <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="비밀번호"
          name="password"
          value={password}
          onChange={handleInputChange}
        />
      </FormControl>
      <Box
        component="span"
        className={`loginbox ${isLoginButtonClickable ? 'loginbox2' : 'loginbox1'}`}
        onClick={handleOpenfindPage}
      >
        <p className="text1">로그인</p>
      </Box>
      <FormGroup className='autologin'>
        <FormControlLabel
          control={
            <Checkbox
              checked={isAutoLoginChecked}
              onChange={handleAutoLoginCheckboxChange}
            />
          }
          label="로그인 정보 저장"
        />
      </FormGroup>
      <Button className='findidbtn' onClick={handleOpenID}>아이디 찾기</Button>
      <Button className='findpwbtn' onClick={handleOpenPW}>비밀번호 찾기</Button>
      <p className='findsignup'>회원이 아니신가요?</p>
      <Button className='findsignupbtn' onClick={handleOpenSignup}>회원가입</Button>
    </div>
  );
}

export default Login;
