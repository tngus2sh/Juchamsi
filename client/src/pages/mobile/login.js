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
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';


function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [username, setUsernameLocal] = React.useState('');
  const [password, setPasswordLocal] = React.useState('');
  const [password1, setPasswordLocal1] = React.useState('');
  // 최초 로그인여부 판별
  const [FirstLogin, setFirstLoginOpen] = React.useState(false);
  // 최초 로그인시 모달 창 오픈
  const handleOpenFirstLoginCheck = () => setFirstLoginOpen(true);
  const handleCloseFirstLoginCheck = () => {setFirstLoginOpen(false)}

  // 간편비밀번호 등록 여부 확인
  const [FirstPasswordCheck, setFirstPasswordCheck] = React.useState(false);
  // 간편비밀번호 등록완료시 모달 창 오픈
  const handleOpenFirstPasswordCheck = () => setFirstPasswordCheck(true);
  const handleCloseFirstPasswordCheck = () => setFirstPasswordCheck(false)
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

  // 최초 로그인여부 판별할 함수(추후 서버와 연결시 서버에서 true,flase값 받아와야할듯)
  let firstlogin = true

  const handleOpenLoginResultPage = () => {
    // 아이디와 비밀번호가 입력되어 있을 때만 이동
    if (username.trim() !== '' && password.trim() !== '') {
      if (firstlogin === true) {
        handleOpenFirstLoginCheck()
      } else {
        navigate('/Mobile/Parkinglot');
      }
    }
  };

  const handleOpenFirstLoginResult = () => {
    if (password1.trim() !== '') {
      if (password1.length=== 6) {
        handleCloseFirstLoginCheck()
        handleOpenFirstPasswordCheck()
      } else {
        alert('간편비밀번호는 6개의 숫자로 등록해주시 바랍니다.')
      }
    }
  }

  const handleOpenFirstPasswordResult = () => {
      handleCloseFirstPasswordCheck()
      navigate('/Mobile/Parkinglot')
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsernameLocal(value);
    } else if (name === 'password') {
      setPasswordLocal(value);
    } else if (name === 'password1') {
       // 비밀번호 입력 길이를 6글자로 제한
       const onlynumb = value.replace(/[^0-9/ ]/g, '');
       const checkpasswordvalue = onlynumb.slice(0, 6);
       setPasswordLocal1(checkpasswordvalue);
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

  // modal 스타일
  const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 230,
    height:'260px',
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // modal 스타일
  const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 230,
    height:'130px',
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


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
        onClick={handleOpenLoginResultPage}
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

      {/* 최초 로그인시 간편비밀번호 입력 모달창 */}
      <Modal open={FirstLogin} onClose={handleCloseFirstLoginCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style1}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          차키 찾기 및 마일리지 현금화등을 위해 사용할 간편비밀번호를 입력해 주시기 바랍니다.
          </Typography>
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" className="signuppw1" required>
            <InputLabel htmlFor="outlined-adornment-password1">비밀번호</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password1"
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
              name="password1"
              value={password1}
              onChange={handleInputChange}
            />
          </FormControl>
          <Box component="span" className="password2btn" onClick={handleOpenFirstLoginResult}>
            <p className="Checkidresult1text">확인</p>
          </Box>
        </Box>
      </Modal>

      {/* 간편 비밀번호 등록완료시 모달창 */}
      <Modal open={FirstPasswordCheck} onClose={handleCloseFirstPasswordCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style2}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          입력하신 번호로 간편비밀번호 등록이 완료되었습니다.
          </Typography>
          <Box component="span" className="password3btn" onClick={handleOpenFirstPasswordResult}>
            <p className="Checkidresult1text">확인</p>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Login;
