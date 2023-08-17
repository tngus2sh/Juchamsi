// Login.js

import './login.css';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import { useSelector, useDispatch } from 'react-redux';
import { setAutoLoginChecked, setUsername, setPassword } from '../../redux/mobileauthlogin';
import { setCarNumber, setid, setloginId, setname, setphoneNumber, setaccessToken, setrefreshToken, setVillaNumber, setvillaIdNumber, setTotalMileage, setUserMacAdress, setWhenEnteringCar, setFcmToken, setReadMessage} from '../../redux/mobileUserinfo'
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import http from "../../axios/http";
import Alert from '@mui/material/Alert';


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
    navigate("/Mobile/Findid");
  };

  const handleOpenPW = () => {
    navigate("/Mobile/Findpw");
  };

  const handleOpenSignup = () => {
    navigate("/Mobile/Signup");
  };

  // 승인대기(가입,수정) 상태
  const [showAlert, setShowAlert] = React.useState(false);

  // 거절 상태
  const [showAlert2, setShowAlert2] = React.useState(false);

  // 존재하지 않는 사용자
  const [showNoUserAlert, setshowNoUserAlert] = React.useState(false)

  // 아아디or비밀번호가 다를경우
  const [showCheckIDrAlert, setshowCheckIDrAlert] = React.useState(false)

  const handleOpenLoginResultPage = () => {
    // 아이디와 비밀번호가 입력되어 있을 때만 이동
    if (username.trim() !== '' && password.trim() !== '') {
        http({
          method: "post",
          url: "/tenant/login",
          data: {
            loginId: username,
            loginPassword: password,
          },
        })
        .then((res) => {  
          if (res.data.success === true) {
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
            dispatch(setFcmToken(res.data.response.FCMToken));
            navigate('/Mobile/Parkinglot')
          } else if (res.data.error.message === '승인 대기 중입니다.') {
            setShowAlert(true); // Alert을 표시
            setTimeout(() => {
              setShowAlert(false); // 5초 후에 Alert을 숨김
            }, 5000);
          } else if (res.data.error.message === '승인이 거절되었습니다.'){
            setShowAlert2(true); // Alert을 표시
            setTimeout(() => {
              setShowAlert2(false); // 5초 후에 Alert을 숨김
            }, 5000);
          } else if (res.data.error.message === '존재하지 않는 사용자입니다.') {
            setshowNoUserAlert(true);
            setTimeout(() => {
              setshowNoUserAlert(false)
            }, 5000)
          } else if(res.data.error.message === '아이디 또는 비밀번호를 잘못 입력했습니다') {
            setshowCheckIDrAlert(true);
            setTimeout(() => {
              setshowCheckIDrAlert(false)
            }, 5000)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  };




  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsernameLocal(value);
    } else if (name === "password") {
      setPasswordLocal(value);
    }
  };

  // "자동로그인" 체크를 해제할 때 로그인 정보를 지우는 처리
  const handleAutoLoginCheckboxChange = (event) => {
    const { checked } = event.target;
    dispatch(setAutoLoginChecked(checked));

    if (!checked) {
      // "자동로그인" 체크를 해제했을 때 로그인 정보를 제거
      dispatch(setUsername(""));
      dispatch(setPassword(""));
    }
  };

  // 페이지가 처음 로드될 때 로컬 스토리지에서 자동로그인 정보 가져오기
  React.useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");

    if (storedUsername && storedPassword) {
      setUsernameLocal(storedUsername);
      setPasswordLocal(storedPassword);
      dispatch(setAutoLoginChecked(true));
    }
  }, [dispatch]);

  // 아이디와 비밀번호가 입력되어 있을 때만 버튼을 클릭할 수 있도록 설정
  const isLoginButtonClickable = username.trim() !== "" && password.trim() !== "";

  // 자동로그인 정보를 로컬 스토리지에 저장 또는 제거
  React.useEffect(() => {
    if (isAutoLoginChecked) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
  }, [isAutoLoginChecked, username, password]);


  return (
    <div className="login-main">
      <div className="header">
        <img className="mobile-logo" src={process.env.PUBLIC_URL + "/img/mobile/logo.png"} alt={"title"}></img>
      </div>

      <div className="login-container">
        <div className="id-container">
          <input required className="login-input" placeholder="아이디" label="아이디" name="username" value={username} onChange={handleInputChange}></input>
        </div>

        <div className="pw-container">
          <input type={showPassword ? "text" : "password"} required className="login-input" placeholder="비밀번호" label="비밀번호" name="password" value={password} onChange={handleInputChange}></input>
          <span className="pw-show-button">
            <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </span>
        </div>

        <div className="login-option-container">
          <div className="login-option-flex-container">
            <div className="auto-login-container">
              <FormGroup className="auto-login">
                <FormControlLabel
                  control={<Checkbox checked={isAutoLoginChecked} onChange={handleAutoLoginCheckboxChange} sx={{ "& .MuiSvgIcon-root": { fontSize: "1.2rem" } }} />}
                  // label="로그인 정보 저장"
                  label={<span style={{ fontSize: "0.9rem", fontFamily:"Nanum" }}>자동 로그인</span>}
                />
              </FormGroup>
            </div>

            <div className="find-pw-container">
              <Button onClick={handleOpenPW} sx={{ paddingRight: "0" }} style={{ fontSize: "0.9rem", fontFamily:"Nanum"  }}>
                비밀번호 찾기
              </Button>
            </div>
          </div>
        </div>

        <div className="login-button-container">
          <button className={`login-box ${isLoginButtonClickable ? "login-box-active" : "login-box-deactive"}`} onClick={handleOpenLoginResultPage}>
            로그인
          </button>
        </div>

        <div className="signup-container">
          <div className="signup-flex-container">
            <div className="signup-info">
              <p>회원이 아니신가요?</p>
            </div>

            <div className="signup-btn">
              <Button onClick={handleOpenSignup} style={{ fontSize: "0.87rem", fontFamily:"Nanum"  }}>
                회원가입
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showAlert && (
        <Alert severity="error" className='signup-alert' sx={{justifyContent:'center'}}>
          <p>승인대기 상태입니다. 관리자 승인시</p>
          <p>서비스 이용이 가능합니다.</p>
          </Alert>
      )}
      {showAlert2 && (
        <Alert severity="warning" className='signup-alert' sx={{justifyContent:'center'}}>회원가입이 거절되었습니다.</Alert>
      )}
      {showNoUserAlert && (
        <Alert severity="warning" className='signup-alert' sx={{justifyContent:'center'}}>회원가입을 먼저 해주시기 바랍니다.</Alert>
      )}
      {showCheckIDrAlert && (
        <Alert severity="warning" className='signup-alert' sx={{justifyContent:'center'}}>아이디 또는 비밀번호를 확인바랍니다.</Alert>
      )}
    </div>
  );
}

export default Login;