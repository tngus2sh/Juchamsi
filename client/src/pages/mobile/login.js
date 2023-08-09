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
import { setCarNumber, setid, setloginId, setname, setphoneNumber, setaccessToken, setrefreshToken, setVillaNumber, setvillaIdNumber, setTotalMileage, setUserMacAdress, setWhenEnteringCar} from '../../redux/mobileUserinfo'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import http from "../../axios/http";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


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

  // 가입승인대기 상태
  const [showAlert, setShowAlert] = React.useState(false);

  // 수정사항대기 상태
  const [showAlert1, setShowAlert1] = React.useState(false);

  // 거절 상태
  const [showAlert2, setShowAlert2] = React.useState(false);

  // 최초 로그인여부 판별할 함수(추후 서버와 연결시 서버에서 true,flase값 받아와야할듯)
  let firstlogin = false

  const handleOpenLoginResultPage = () => {
    // 아이디와 비밀번호가 입력되어 있을 때만 이동
    if (username.trim() !== '' && password.trim() !== '') {
      if (firstlogin === true) {
        handleOpenFirstLoginCheck()
      } else {
        http({
          method:'post',
          url:'/tenant/login',
          data:{
            "loginId": username,
            "loginPassword": password
          },
        })
        .then((res) => {
          if (res.data.response.approved === 'APPROVE') {
            // setCarNumber, setid, setloginId, setname, setphoneNumber, setaccessToken, setrefreshToken
            dispatch(setCarNumber(res.data.response.carNumber));
            dispatch(setid(res.data.response.id));
            dispatch(setloginId(res.data.response.loginId));
            dispatch(setname(res.data.response.name));
            dispatch(setphoneNumber(res.data.response.phoneNumber));
            dispatch(setaccessToken(res.data.response.tokenInfo.accessToken));
            dispatch(setrefreshToken(res.data.response.tokenInfo.accessToken));
            dispatch(setVillaNumber(res.data.response.villaNumber));
            dispatch(setvillaIdNumber(res.data.response.villa.idNumber));
            dispatch(setTotalMileage(res.data.response.totalMileage))
            dispatch(setPassword(password))
            dispatch(setUserMacAdress("ed:dd:dd:dd"));
            dispatch(setWhenEnteringCar(false));
            navigate('/Mobile/Parkinglot')
          } else if (res.data.response.approved === 'WAIT') {
            setShowAlert(true); // Alert을 표시
            setTimeout(() => {
              setShowAlert(false); // 5초 후에 Alert을 숨김
            }, 5000);
          } else if (res.data.response.approved === 'MODIFY') {
            setShowAlert1(true); // Alert을 표시
            setTimeout(() => {
              setShowAlert1(false); // 5초 후에 Alert을 숨김
            }, 5000);
          } else {
            setShowAlert2(true); // Alert을 표시
            setTimeout(() => {
              setShowAlert2(false); // 5초 후에 Alert을 숨김
            }, 5000);
          }
        })
        .catch((err) => {
          console.log(err)
        })
        
      }
    }
  };

  const handleOpenFirstLoginResult = () => {
    if (password1.trim() !== '') {
      if (password1.length=== 6) {
        handleCloseFirstLoginCheck()
        handleOpenFirstPasswordCheck()
      } else {
        alert('간편비밀번호는 6개의 숫자로 등록해주시기 바랍니다.')
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
  
  // 홈 화면에 추가 팝업
  const [showAddToHomeScreen, setShowAddToHomeScreen] = React.useState(false);
  let deferredPrompt;

  const handleBeforeInstallPrompt = (e) => {
    // 기본 설치 팝업을 차단하기 위해 기본 이벤트를 막습니다.
    e.preventDefault();
    
    // 나중에 사용하기 위해 이벤트를 저장합니다.
    deferredPrompt = e;
    
    // "홈 화면에 추가" 버튼을 표시합니다.
    setShowAddToHomeScreen(true);
  };

  const handleAddToHomeScreen = () => {
    if (deferredPrompt) {
      // 브라우저의 설치 팝업을 표시합니다.
      deferredPrompt.prompt();
      
      // 사용자의 응답을 기다립니다.
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        // deferredPrompt 변수를 초기화합니다.
        deferredPrompt = null;
      });
    }
  };

  React.useEffect(() => {
    // beforeinstallprompt 이벤트에 대한 이벤트 리스너를 추가합니다.
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

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
    <div className='login-main'>
      <div className="header">
        <img className="mobile-logo" src={process.env.PUBLIC_URL + "/img/kiosk/logo.png"} alt={"title"}></img>
      </div>
      
      <div className="login-container">
        <div className="id-container">
          {/* <TextField
            required
            id="outlined-id-input"
            className="id-input"
            label="아이디"
            name="username"
            value={username}
            onChange={handleInputChange}
          /> */}
          <input required className="login-input" placeholder="아이디" label="아이디" name="username" value={username} onChange={handleInputChange} ></input>
        </div>

        <div className="pw-container">
          <input type={showPassword ? 'text' : 'password'} required className="login-input" placeholder="비밀번호" label="비밀번호" name="password" value={password} onChange={handleInputChange}></input>
          {/* <IconButton onClick={handleClickShowPassword} ></IconButton> */}
          <span className="pw-show-button">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </span>
          
          {/* <FormControl sx={{ m: 1 }} variant="outlined"  required>
            <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
            <OutlinedInput
              // id="outlined-adornment-password"
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
          </FormControl> */}
        </div>

        <div className="login-option-container">
          <div className="login-option-flex-container">
            <div className="auto-login-container">
              <FormGroup className='auto-login'>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAutoLoginChecked}
                      onChange={handleAutoLoginCheckboxChange}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: '1.2rem' } }}
                    />
                  }
                  // label="로그인 정보 저장"
                  label={<span style={{ fontSize: '0.9rem' }}>자동 로그인</span>}
                />
              </FormGroup>
            </div>

            <div className="find-pw-container">
              <Button onClick={handleOpenPW} sx={{ paddingRight: "0" }} style={{ fontSize: '0.9rem' }}>비밀번호 찾기</Button>
            </div>
          </div>
        </div>
        

        <div className="login-button-container">
          {/* <Box
            component="span"
            className={`loginbox ${isLoginButtonClickable ? 'loginbox2' : 'loginbox1'}`}
            onClick={handleOpenLoginResultPage}
          >
            <p className="text1">로그인</p>
          </Box> */}
          <button className={ `login-box ${isLoginButtonClickable ? 'login-box-active' : 'login-box-deactive'}` } onClick={handleOpenLoginResultPage}>로그인</button>
        </div>

        <div className="signup-container">
          <div className="signup-flex-container">
            <div className='signup-info'>
              <p>회원이 아니신가요?</p>
            </div>

            <div className="signup-btn">
              <Button onClick={handleOpenSignup} style={{ fontSize: '0.87rem' }}>회원가입</Button>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="find-container">
        <div className="find-flex-container">
          <div className='findidbtn'>
            <Button onClick={handleOpenID}>아이디 찾기</Button>
          </div>

          <div className='findpwbtn'>
            <Button onClick={handleOpenPW}>비밀번호 찾기</Button>
          </div>
        </div>
      </div> */}



      
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
      {/* "홈 화면에 추가" 버튼 */}
      {showAddToHomeScreen && (
      <div className="addToHomeScreenButton" onClick={handleAddToHomeScreen}>
        홈 화면에 추가하시겠습니까?
      </div>
      )}
      {showAlert && (
        <Alert severity="error">가입 승인대기 상태입니다. 관리자가 승인해야 서비스 이용이 가능합니다.</Alert>
      )}
      {showAlert1 && (
        <Alert severity="warning">수정사항 반영대기 상태입니다. 관리자가 승인해야 서비스 이용이 가능합니다.</Alert>
      )}
      {showAlert2 && (
        <Alert severity="warning">회원가입이 거절되었습니다. 빌라식별번호 및 회원가입시 정보입력을 다시 확인하고 회원가입 바랍니다.</Alert>
      )}
    </div>
  );
}

export default Login;
