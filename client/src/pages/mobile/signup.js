import './signup.css'
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import axiosInstance from '../../axios/axios'
import PrivacyAgreement from '../../components/signup/privacyagreement';

function Signup() {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 220,
        height: '260px',
        bgcolor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    const style1 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 220,
        height:'150px',
        bgcolor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

 

    const style3 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 220,
        height:'170px',
        bgcolor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    const style2 = {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        maxHeight: '80vh', // 최대 높이 설정
        height:'400px',
        bgcolor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        overflowY: 'auto', // 스크롤바 추가
      };
      
    const [phonenumber, setPhoneNumber] = useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showCheckPassword, setShowCheckPassword] = React.useState(false);
    const [username, setUsernameLocal] = React.useState('');
    const [password1, setPasswordLocal1] = React.useState('');
    const [password2, setPasswordLocal2] = React.useState('');
    const [id, setID] = useState('');
    const [carnumber, setCarNumber] = useState('');
    const [villranumber, setVillraNumber] = useState('');
    const [housenumber, setHouseNumber] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [passwordChecking, setPasswordChecking] = useState(false);
    const handleOpenIDFalseCheck = () => setIDModalFalseOpen(true);
    const handleOpenIDTrueCheck = () => setIDModalTrueOpen(true);
    const handleOpenPhonenumberCheck = () => setPhoneModalOpen(true);
    const [IDModalFalseopen, setIDModalFalseOpen] = React.useState(false);
    const [IDModalTrueopen, setIDModalTrueOpen] = React.useState(false);
    const [PhoneModalopen, setPhoneModalOpen] = React.useState(false);
    const [idcheck, setIDcheck] = React.useState(false)
    const handleCloseIDCheckFalse = () => {setIDModalFalseOpen(false); setIDcheck(true);}
    const handleCloseIDCheckTrue = () => setIDModalTrueOpen(false);
    const handleClosePhoneCheck = () => setPhoneModalOpen(false);
    const [phoneModalTrueOpen, setPhoneModalTrueOpen] = React.useState(false);
    const [phoneModalFalseOpen, setPhoneModalFalseOpen] = React.useState(false);
    const handleOpenPhoneTrueCheck = () => setPhoneModalTrueOpen(true);
    const handleOpenPhoneFalseCheck = () => setPhoneModalFalseOpen(true);
    const [phonenumbecheck, setphonenumbecheck] = React.useState(false)
    const handleClosePhoneTrueCheck = () => {setPhoneModalTrueOpen(false); setphonenumbecheck(true);}
    const [privacyCheck, setPrivacyCheck] =  React.useState(false)
    const handleOpenPrivacyOpen = () => setPrivacyCheck(true)
    const handleClosePrivacyClose = () => setPrivacyCheck(false)
  
    const [phoneCheckingNumber, setPhoneCheckingNumber] = useState(null);

    // 개인정보 이용약관 체크 여부를 저장하는 상태
    const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);

    // 개인정보 이용약관 체크박스가 변경될 때 호출되는 이벤트 핸들러
    const handlePrivacyAgreeChange = (e) => {
      setIsPrivacyAgreed(e.target.checked);
    };

    // 핸드폰 인증 실패 모달 닫기 이벤트 핸들러
    const handleClosePhoneFalseCheck = () => {
      setPhoneModalFalseOpen(false);
      setphonechecknumber(''); // 핸드폰 인증번호를 초기화
      setPhoneModalOpen(true) // 인증번호 입력모달창으로
    };
    const [phonechecknumber, setphonechecknumber] = useState('');

    // 중복체크를 완료했는지 여부를 담을 변수
    const [isIdChecked, setIsIdChecked] = useState(false);

    const navigate = useNavigate();

    // 아이디 중복체크 버튼 사용가능여부 판별
    const isLoginButtonClickable = id.trim() !== '' && id.length >= 6;

    // 비밀번호 보기 / 숨기기 토글
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // 비밀번호 확인 보기 / 숨기기 토글
    const handleClickShowCheckPassword = () => setShowCheckPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //비밀번호 규칙 체크 함수
    const passwordCheck = (password) => {
        // 비밀번호 유효성 검사: 최소 8자 이상, 최대 16자 이하, 문자/숫자/특수문자 포함 여부 체크
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,17}$/;
        return passwordRegex.test(password);
    };

    // 로그인 페이지로 이동
    const handleOpenLogin = () => {
        navigate('/Mobile/Login');
    };

    // 아이디 중복체크 버튼 클릭 이벤트 핸들러
    const handleOpenCheckID = () => {
      if (isLoginButtonClickable === true) {
        // idcheckresult에 따라서 '사용가능or중복' 여부 판별해서 보여주는 모달창 결정
        // true는 중복, false는 사용가능
        axiosInstance({
          method:'get',
          url:`/user/id/${id}`,
          data:{
            "id": id,
          },
        })
        .then((res) => {
          if (res.data.success === true) {
            handleOpenIDFalseCheck();
            // 중복체크가 완료되었으므로 isIdChecked를 true로 설정
            setIsIdChecked(true);
          } else {
            handleOpenIDTrueCheck();
            // 중복체크 결과가 false일 경우 isIdChecked를 false로 설정
            setIsIdChecked(false); 
          }
        })
        .catch((err) => {
          console.log(err)
        })
      }
    };

    // 핸드폰번호 인증버튼 사용가능여부 판별
    const handleOpenCheckPhonenumber = () => {
        if (isPhonenumberButtonClickable === true) {
          axiosInstance({
            method:'post',
            url:'/sms/check',
            data:{
              "name": username,
              "to": phonenumber
            },
          })
          .then((res) => {
            setPhoneCheckingNumber(res.data.response);
            handleOpenPhonenumberCheck()
          })
          .catch((err) => {
            console.log(err)
          })
        }
    }

// 핸드폰 인증 모달 확인버튼 클릭 이벤트 핸들러
const handlePhoneModalConfirmClick = () => {
  if (phonechecknumber === phoneCheckingNumber) {
    // 인증이 성공한 경우
    // 기존모달 종료
    handleClosePhoneCheck()
    handleOpenPhoneTrueCheck(); // 첫 번째 모달 (성공 모달)을 엽니다.
  } else {
    // 인증이 실패한 경우
    // 기존모달 종료
    handleClosePhoneCheck()
    handleOpenPhoneFalseCheck(); // 첫 번째 모달 (실패 모달)을 엽니다.
  }
  }

    // 회원가입 완료 여부 체크 및 로그인 페이지로 이동
    const handleOpenfindPage = () => {
      if (
        username.trim() !== '' &&
        password1.trim() !== '' &&
        password2.trim() !== '' &&
        password1.trim() === password2.trim() &&
        id.trim() !== '' &&
        phonenumber.trim() !== '' &&
        carnumber.trim() !== '' &&
        villranumber.trim() !== '' &&
        housenumber.trim() !== '' &&
        isIdChecked === true &&
        passwordMismatch === false &&
        passwordChecking === false &&
        // phonenumbecheck === true &&
        isPrivacyAgreed === true
      ) {
        axiosInstance({
          method:'post',
          url:'/tenant',

          data:{
            "carNumber": carnumber,
            "loginId": id,
            "loginPassword": password1,
            "name": username,
            "phoneNumber": phonenumber,
            "villaIdNumber": villranumber,
            "villaNumber": Number(housenumber)
          },
        })
        .then(() => {
          navigate('/Mobile/Login')
        })
        .catch((err) => {
          console.log(err)
        })
      } else {
        if (password1.trim() !== password2.trim()) {
          setPasswordChecking(true);
          setPasswordMismatch(true);
        } else if (isIdChecked === false) {
          alert('아이디 중복체크를 실시해주시기 바랍니다.');
        } else if (phonenumbecheck === false) {
          // alert('핸드폰 인증을 진행해 주시기 바랍니다.')
        }
      }
    };

    // 입력값이 변경될때 호출되는 이벤트
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'username') {
            const onlyKorean = value.replace(/[a-zA-Z0-9]/g, '');
            const namemaxLength = 4;
            const nametruncatedValue = onlyKorean.slice(0,namemaxLength)
            setUsernameLocal(nametruncatedValue);
        } else if (name === 'password1') {
            // 비밀번호 입력 길이를 16글자로 제한
            const checkpasswordvalue = value.slice(0, 16);
            setPasswordLocal1(checkpasswordvalue);
            if (value.trim() === '') {
                setPasswordChecking(false); // 빈 칸일 때 규칙 메시지 숨김
            } else {
                setPasswordChecking(!passwordCheck(value));
            }

        } else if (name === 'password2') {
            // 비밀번호 확인 입력 길이를 16글자로 제한
            const checkpasswordvalue1 = value.slice(0, 16);
            setPasswordLocal2(checkpasswordvalue1);
            if (value.trim() === '') {
                setPasswordMismatch(false);
            } else {
                // 비밀번호 확인과 일치하는지 확인
                setPasswordMismatch(value !== password1);
            }
        }
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



    // 핸드폰 번호 인증 가능여부 체크 함수
    const isPhonenumberButtonClickable = phonenumber.trim() !== '' && phonenumber.length >= 10 ;

    // 필수입력조건 입력시 회원가입 버튼 활성화
    const isSignupButtonClickable = passwordMismatch === false && passwordChecking === false && isIdChecked === true 
    && username.trim() !== '' && id.trim() !== '' && phonenumber.trim() !== '' && carnumber.trim() !== '' && villranumber.trim() !== '' 
    && housenumber.trim() !== '' && isPrivacyAgreed === true


    // 아이디 입력값이 변경될 때 호출되는 이벤트 핸들러
    const handleIDChange = (e) => {
    // 영어 대소문자, 숫자만 입력 가능하도록 정규식을 이용하여 유효성 검사
    const onlyID = e.target.value.replace(/[^a-zA-Z0-9]/g, '');

    // 최대 15자까지만 입력 가능하도록 제한
    const IDmaxLength = 15;
    const IDtruncatedValue = onlyID.slice(0, IDmaxLength);

    setID(IDtruncatedValue);
    };

    // 빌라 식별번호 입력값이 변경될 때 호출되는 이벤트 핸들러
    const handlevillranumberChange = (e) => {
    // 영어 대소문자, 숫자만 입력 가능하도록 정규식을 이용하여 유효성 검사
    const onlyvillranumber = e.target.value.replace(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,17}$/, '');

    // 최대 15자까지만 입력 가능하도록 제한
    const villranumbermaxLength = 15;
    const villranumbertruncatedValue = onlyvillranumber.slice(0, villranumbermaxLength);

    setVillraNumber(villranumbertruncatedValue);
    };

    // 자동차 번호가  변경될 때 호출되는 이벤트 핸들러
    const handleCarnumberChange = (e) => {
    // 숫자,한글만 입력가능하도록 규칙 설정
    const onlyCarnumber = e.target.value.replace(/[a-zA-Z]/g, '');

    // 최대 9자까지만 입력 가능하도록 제한
    const carnumbermaxLength = 9;
    const checkCarnumber = onlyCarnumber.slice(0, carnumbermaxLength);

    setCarNumber(checkCarnumber);
    };

    // 호수가 변경될 때 호출되는 이벤트 핸들러
    const handlehousenumberChange = (e) => {
    // 숫자,한글만 입력가능하도록 규칙 설정
    const onlyhousenumber = e.target.value.replace(/[^0-9/ ]/g, '');

    // 최대 9자까지만 입력 가능하도록 제한
    const housenumbermaxLength = 3;
    const checkhouseumber = onlyhousenumber.slice(0, housenumbermaxLength);

    setHouseNumber(checkhouseumber);
    };

    // 비밀번호 인증번호가 변경될 때 호출되는 이벤트 핸들러
    const handlephonechecknumberChange = (e) => {
    // 숫자 입력가능하도록 규칙 설정
    const onlyphonechecknumber = e.target.value.replace(/[^0-9/ ]/g, '');

    // 최대 9자까지만 입력 가능하도록 제한
    const phonechecknumbermaxLength = 6;
    const phonecheckumber = onlyphonechecknumber.slice(0, phonechecknumbermaxLength);

    setphonechecknumber(phonecheckumber);
    };

    // 개인정보 이용약관 클릭시
    const PrivacyBtnClick = () => {
      // 개인정보 이용약관 모들 오픈
      handleOpenPrivacyOpen()
    }



  return (
    <div>
      <img
        className="signuplogo"
        src={process.env.PUBLIC_URL + '/img/kiosk/logo1.png'}
        alt={'title'}
      ></img>
      <div className="signupid">
      <TextField
        required
        
        id="outlined-id-input"
        label="아이디"
        name="ID"
        value={id}
        onChange={handleIDChange}
      />
      </div>
      {idcheck ? (
        <Box component="span" className="idcheckbox1">
          <p className="idchecktext">사용가능</p>
        </Box>
      ) : (
        <Box
          component="span"
          className={`idcheckbox ${isLoginButtonClickable ? 'idcheckbox2' : 'idcheckbox1'}`}
          onClick={handleOpenCheckID}
        >
          <p className="idchecktext">중복체크</p>
        </Box>
      )}
      <div className="signuppw1">
      <FormControl sx={{ m: 1 }} variant="outlined"  required>
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
      </div>
      {passwordChecking && <p className="password-check-text">비밀번호에는 숫자,문자,특수문자가 최소 1개이상씩 포함되어야 합니다.</p>}
      <div className="signuppw2">
      <FormControl sx={{ m: 1 }} variant="outlined" required>
        <InputLabel htmlFor="outlined-adornment-password2">비밀번호 확인</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password2"
          type={showCheckPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowCheckPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showCheckPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="비밀번호 확인"
          name="password2"
          value={password2}
          onChange={handleInputChange}
        />
      </FormControl>

      </div>
      {passwordMismatch && <p className="password-mismatch-text">비밀번호가 다릅니다. 다시 확인바랍니다.</p>}
      <div className="signupname">
      <TextField
        required
        id="outlined-name-input"
        label="이름"
        name="username"
        value={username}
        onChange={handleInputChange}
        sx={{ '& input': { textAlign: 'center' } }}
      />
      </div>
      <div className="signupphonenumber">
      <TextField
        required
        id="outlined-phonenumber-input"
        label="핸드폰 번호"
        name="phonenumber"
        value={phonenumber}
        onChange={handlePhoneNumberChange}
        sx={{ '& input': { textAlign: 'center' } }}
      />
      </div>
        {phonenumbecheck ? (
          <Box component="span" className="phonenumbercheck3">
            <p className="phonechecktext">인증완료</p>
          </Box>
        ) : (
          <Box
            component="span"
            className={`phonenumbercheck ${isPhonenumberButtonClickable ? 'phonenumbercheck2' : 'phonenumbercheck1'}`}
            onClick={handleOpenCheckPhonenumber}
          >
            <p className="phonechecktext">핸드폰 인증</p>
          </Box>
        )}
        <div className="carnumber">
      <TextField
        required
        id="outlined-carnumber-input"
        label="자동차 번호"
        name="carnumber"
        value={carnumber}
        onChange={handleCarnumberChange}
        sx={{ '& input': { textAlign: 'center' } }}
      />
        </div>
      <div className='carnumbertext'>
      <p>서울 12가 1234 = 12가 1234 로 입력</p>
      </div>
      <div className="villranumber">
      <TextField
        required
        id="outlined-villranumber-input"
        label="빌라 식별번호"
        name="villranumber"
        value={villranumber}
        onChange={handlevillranumberChange}
        sx={{ '& input': { textAlign: 'center' } }}
      />
      </div>
      <div className="housenumber">
      <TextField
        required
        id="outlined-housenumber-input"
        label="호수"
        name="housenumber"
        value={housenumber}
        onChange={handlehousenumberChange}
        sx={{ '& input': { textAlign: 'center' } }}
      />
      </div>
      <div className='Privacybtnstyle'>
      <Button onClick={PrivacyBtnClick}>
        개인정보 이용약관
      </Button>
      </div>
      
      <div className='checkboxstyle'>
        {/* 개인정보 이용약관 체크박스 */}
        <Checkbox
          checked={isPrivacyAgreed}
          onChange={handlePrivacyAgreeChange}
        />
      </div>
      <Box
        component="span"
        className={`signupbox1 ${isSignupButtonClickable ? 'signupbox2' : 'signupbox1'}`}
        onClick={handleOpenfindPage}
      >
        <p className="signuptext1">회원가입</p>
      </Box>
      <p className="signuptext">이미 가입된 회원이신가요?</p>
      <div className="signuptologin">
      <Button onClick={handleOpenLogin}>
        로그인
      </Button>
      </div>

      {/* 아이디 중복 검사 결과 사용가능할 경우 보여주는 모달 */}
      <Modal open={IDModalFalseopen} onClose={handleCloseIDCheckFalse} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style1}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign:'center'}}>
            아이디 중복검사 결과
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {id}는 사용이 가능합니다.사용하시겠습니까?
          </Typography>
          <Box
            component="span"
            className='Checkidresult1'
            onClick={handleCloseIDCheckFalse}
          >
            <p className="Checkidresult2text">확인</p>
          </Box>
        </Box>
      </Modal>

      {/* 아이디 중복 검사 결과 중복될 경우 보여주는 모달 */}
      <Modal open={IDModalTrueopen} onClose={handleCloseIDCheckTrue} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style3}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign:'center'}}>
            아이디 중복검사 결과
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {id}는 현재 사용중인 상태입니다.
          <br/>
          다른 아이디를 사용해주시기 바랍니다.
          </Typography>
          <Box
            component="span"
            className='Checkidresult1'
            onClick={handleCloseIDCheckTrue}
        >
            <p className="Checkidresult2text">확인</p>
        </Box>
        </Box>
      </Modal>
      {/* 핸드폰 인증 클릭시 보여주는 모달창 */}
      <Modal open={PhoneModalopen} onClose={handleClosePhoneCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 1 }} >
            입력된 핸드폰 번호로 인증문자가 발송되었습니다.
            <br />
            인증번호를 입력해 주시기 바랍니다.
          </Typography>
          <br />
          <br />
          <TextField required id="outlined-basic" label="인증문자" variant="outlined" sx={{ '& input': { textAlign: 'center'}}} 
          value={phonechecknumber} onChange={handlephonechecknumberChange}/>
          <Box component="span" className="Checkidresult3" onClick={handlePhoneModalConfirmClick}>
            <p className="Checkidresult1text">확인</p>
          </Box>
        </Box>
      </Modal>

      {/* 핸드폰 인증 성공 */}
      <Modal open={phoneModalTrueOpen} onClose={handleClosePhoneTrueCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style1}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            인증 성공
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            인증이 성공적으로 완료되었습니다.
          </Typography>
          <Box component="span" className="Checkidresult2" onClick={handleClosePhoneTrueCheck}>
            <p className="Checkidresult1text">확인</p>
          </Box>
        </Box>
      </Modal>

      {/* 핸드폰 인증 실패 */}
      <Modal open={phoneModalFalseOpen} onClose={handleClosePhoneFalseCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style1}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
            인증 실패
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            인증이 실패하였습니다. 올바른 인증번호를 입력해주세요.
          </Typography>
          <Box component="span" className="Checkidresult2" onClick={handleClosePhoneFalseCheck}>
            <p className="Checkidresult1text">확인</p>
          </Box>
        </Box>
      </Modal>
      <PrivacyAgreement open={privacyCheck} onClose={handleClosePrivacyClose}/>

      {/* 이용약관 */}
      <Modal open={privacyCheck} onClose={handleClosePrivacyClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style2}>
          <Typography id="modal-modal-title" variant="h6" component="h2" className='Privacymodalstyle'>
            <span style={{fontSize:'24px', fontWeight:'bolder', color:'white', margin:20}}>이용약관</span>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, ml:2, mr:2}}>
          <span style={{fontSize:'20px', fontWeight:'bold'}}>[제 1 장 총칙]</span>
          <br />
          <br />
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 1조 목적</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>본 약관은 본 서비스를 이용하여 주차참견시스템(이하 주참시)를 이용하는 사용자들을 대상으로
          회사가 운영하는 서비스와 관련하여 회사와 
          이용자와의 권리/의무 및 책임사항을 규정함을 목적으로 합니다.</span>
          <br />
          <br />
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 2 조 용어의 정의</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
            1. "서비스"란 접속 가능한 유/무선 정보통신기기의 종류와는 상관없이 이용 가능한 "회사"가 제공하는 모든 서비스를 의미합니다.
            <br />
            <br />
            2. "홈페이지"란 회사가 이용자에게 서비스를 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 구성한 가상의 공간을 의미하며 세부 사이트 이용 권한은 회사가 정한 기준(세입자, 관리자)에 따라 일부 "회원"에게만 부여합니다.
            <br />
            <br />
            3. "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사와 서비스 이용계약을 체결하고 회원 아이디를 부여 받은 자를 의미합니다.
            <br />
            <br />
            4. “회원 아이디(이하 "ID"라 한다)”란 회원의 식별과 회원의 서비스 이용을 위하여 회원이 선정하고 회사가 검증 및 승인하는 코드로, 회원 입력한 문자 및 숫자의 조합을 사용합니다.
            <br />
            <br />
            5. "비밀번호"란 회원이 부여 받은 ID(문자 및 숫자의 조합)와 일치된 회원임을 확인하고, 회원의 개인정보를 보호하기 위하여 회원이 정한 문자와 숫자의 조합을 의미합니다.
            <br />
            <br />
            6. '회원등록 해지(이하 "해지")'란 회사 또는 회원이 이용계약을 해지하는 것을 의미합니다.
            <br />
            <br />
            7. 본 약관에서 사용하는 용어의 정의는 본 조에서 정하는 것을 제외하고는 관계법령 및 서비스 별 안내에서 정하는 바에 따릅니다.</span>
            <br />
            <br />
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 3 조 이용약관의 효력 및 변경</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 "회원가입"시 및 "홈페이지" 서비스의 초기 화면에 게시합니다.
          <br />
          <br />
          2. 본 약관에서 안내하고 있는 개인정보보호에 관한 정책은 회원가입 후 홈페이지의 정보를 활용하는 모든 경우에 해당됩니다.
          <br />
          <br />
          3. 회사는 약관의 규제에 관한 법률, 전자거래기본법, 전자 서명법, 정보통신망이용 촉진 및 정보보호 등에 관한 법률 등 관련법을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.
          <br />
          <br />
          4. 회사는 본 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 회사가 제공하는 "홈페이지"의 초기 화면에 그 적용일자 7일 이전부터 적용일자 전일까지 공지합니다.
          다만, 회원에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 공지합니다. 이 경우 회사는 개정 전 내용과 개정 후 내용을 명확하게 비교하여 회원이 알기 쉽도록 표시합니다.
          <br />
          <br />
          5. 회원은 개정된 약관에 대해 거부할 권리가 있습니다. 회원은 개정된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원등록을 해지할 수 있습니다. 단, 개정된 약관의 효력 발생일 이후에도 서비스를 계속 이용할 경우에는 약관의 변경사항에 동의한 것으로 간주합니다.
          <br />
          <br />
          6. 변경된 약관에 대한 정보를 알지 못해 발생하는 회원의 피해는 회사가 책임지지 않습니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 4 조 약관의 해석</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 본 약관은 회사가 제공하는 각 서비스 별 운영규칙과 함께 적용됩니다.
          <br/>
          <br />
          2. 본 약관에 명시되지 아니한 사항과 본 약관의 해석에 관하여는 관계법령 또는 상관례에 따릅니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'20px', fontWeight:'bold'}}>[제 2 장 이용계약 체결]</span>
          <br />
          <br />
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 5 조 이용계약의 성립</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 이용계약은 회원의 본 이용약관 내용에 대한 동의와 이용신청에 대하여 회사의 이용승낙으로 성립합니다.
          <br/>
          <br />
          2. 본 이용약관에 대한 동의는 회원등록 당시 본 약관을 읽고 "위 서비스 약관에 동의합니다"의 대화창에 표시를 한 후 등록하기 단추를 누름으로써 의사표시를 한 것으로 간주합니다
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 6 조 서비스 이용신청</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회원으로 등록하여 본 서비스를 이용하고자 하는 이용고객은 회사에서 요청하는 제반정보(이름, 핸드폰 번호, 비밀번호 등)를 제공하여야 합니다.
          <br/>
          <br />
          2. 회원은 반드시 회사가 제공하는 서비스가 요구하는 회원 본인인증 절차를 거쳐야만 서비스를 이용할 수 있으며, 본인인증을 거치지 않은 회원은 일체의 권리를 주장할 수 없습니다.
          <br/>
          <br />
          3. 타인의 ID 및 비밀번호를 도용하여 서비스를 이용할 경우, 관계법령에 따라 처벌을 받을 수 있습니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 7 조 개인정보의 보호 및 사용</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회사는 관계법령이 정하는 바에 따라 회원등록정보를 포함한 회원의 개인정보를 보호하기 위해 노력합니다. 회원 개인정보의 보호 및 사용에 대해서는 관련법령 및 회사의 개인정보보호정책이 적용됩니다. 단, 회사의 공식사이트 이외의 웹에서 링크된 사이트에서는 회사의 개인정보보호정책이 적용되지 않습니다. 또한 회사는 회원의 귀책사유로 인해 노출된 정보에 대해서 일체의 책임을 지지 않습니다.
          <br/>
          <br />
          2. 회사는 이용자에게 제공하는 서비스의 양적, 질적 향상을 위하여 이용자의 개인정보를 제휴사에게 제공, 공유할 수 있으며, 이 때에는 반드시 이용자의 동의를 받아 필요한 최소한의 정보를 제공, 공유하며 누구에게 어떤 목적으로 어떤 정보를 제공, 공유하는지 명시합니다.
          <br/>
          <br />
          3. 회원은 원하는 경우 언제든 회사에 제공한 개인정보의 수집과 이용에 대한 동의를 철회할 수 있으며, 동의의 철회는 회원 탈퇴를 하는 것으로 이루어집니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 8 조 이용신청의 승낙과 제한</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회사는 제 6조의 규정에 의한 이용신청고객에 대하여 업무 수행상 또는 기술상 지장이 없는 경우에 원칙적으로 접수순서에 따라 서비스 이용을 승낙합니다.
          <br/>
          <br />
          2. 회사는 다음 각 호의 내용에 해당하는 경우 이용신청에 대한 승낙을 제한할 수 있고, 그 사유가 해소될 때까지 승낙을 유보할 수 있습니다.
          <br />
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑴ 회사의 서비스 관련설비에 여유가 없는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑵ 회사의 기술상 지장이 있는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑶ 기타 회사의 사정상 필요하다고 인정되는 경우
          </span>
          <br/>
          <br />
          3. 회사는 다음 각 호의 내용에 해당하는 경우 이용신청에 대한 승낙을 하지 아니할 수도 있습니다.
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑴ 타인의 ID를 이용하여 신청한 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑵ 이용계약 신청서의 내용을 허위로 기재한 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'9px'}}>
          ⑶ 사회의 안녕과 질서, 미풍양속을 저해할 목적으로신청한 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑷ 부정한 용도로 본 서비스를 이용하고자 하는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'9px'}}>
          ⑸ 영리를 추구할 목적으로 본 서비스를 이용하고자 하는 경우
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑹ 기타 회사가 정한 등록신청 요건이 미비된 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑺ 본 서비스와 경쟁관계가 있는 이용자가 신청하는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑻ 기타 규정한 제반사항을 위반하며 신청하는 경우
          </span>
          <br/>
          <br />
          4. 회사는 이용신청고객이 관계법령에서 규정하는 미성년자일 경우에 서비스 별 안내에서 정하는 바에 따라 승낙을 보류할 수 있습니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 9 조 회원 아이디 부여 및 변경 등</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회사는 회원에 대하여 본 약관에 정하는 바에 따라 회원 ID를 부여합니다. 회원 ID는 회원 본인이 사용하는 이메일 주소를 사용하며, 회원 ID는 원칙적으로 변경이 불가합니다. 부득이한 사유로 회원 ID를 변경하고자 하는 경우에는 해당 ID를 해지하고 재가입해야 합니다.
          <br/>
          <br />
          2. 회원은 서비스 페이지 또는 기타 해당 페이지로 링크된 메뉴를 통하여 자신의 개인정보를 관리할 수 있는 페이지를 열람할 수 있으며, 해당 페이지에서 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다.
          <br/>
          <br />
          3. 회원 ID는 다음 각 호에 해당하는 경우에는 회원 또는 회사의 요청으로 변경할 수 있습니다.
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑴ 회원 ID가 회원의 전화번호 또는 생년월일 등으로 등록되어 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          사생활 침해가 우려되는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑵ 타인에게 혐오감을 주거나 미풍양속에 어긋나는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑶ 기타 합리적인 사유가 있는 경우
          </span>
          <br/>
          <br />
          4. 회원 ID 및 비밀번호의 관리책임은 회원에게 있습니다. 이를 소홀이 관리하여 발생하는 서비스 이용상 손해 또는 제3자에 의한 부정이용 등에 대한 책임은 회원에게 있으며 회사는 그에 대한 책임을 일절 지지 않습니다.
          <br/>
          <br />
          5. 기타 회원 개인정보 관리 및 변경 등에 관한 사항은 서비스 별 안내에 정하는 바에 의합니다.
          </span>
          <br />
          <br />
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 10 조 (회원탈퇴 및 자격 상실 등)</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. "회원"은 "회사"에 언제든지 탈퇴를 요청할 수 있으며 "회사"는 즉시 회원탈퇴를 처리합니다.
단 탈퇴한 회원은 탈퇴일로부터 7일 동안은 동일한 아이디로 회원가입을 할 수 없습니다.
          <br/>
          <br />
          2. "회원"이 다음 각호의 사유에 해당하는 경우, "회사"는 회원자격을 제한 및 정지시킬 수 있습니다.
          
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ① 가입신청 시에 허위내용을 등록한 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ② 다른 사람의 "회사"의 서비스이용을 방해하거나 그 정보를 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          도용하는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ③ "회사"를 이용하여 법령 또는 본 약관이 금지하거나 공서양
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          속에 반하는 행위를 하는 경우
          </span>
          <br/>
          <br/>
          3. "회사"가 회원자격을 제한/정지시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 "회사"는 회원자격을 상실시킬 수 있습니다.
          <br/>
          <br/>
          4. "회사"가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 "회원"에게 이를 통지하고, 회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'20px', fontWeight:'bold'}}>[제 3 장 계약 당사자의 의무]</span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 11 조 회사의 의무</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회사는 관련법과 본 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며, 본 약관이 정하는 바에 따라 지속적이고, 안정적으로 서비스를 제공하기 위하여 최선을 다하여야 합니다.
          <br/>
          <br/>
          2. 회사는 회원이 안전하게 서비스를 이용할 수 있도록 회원의 개인정보보호를 위한 보안시스템을 구축하며 개인정보 보호정책을 공시하고 준수합니다.
          <br/>
          <br/>
          3. 회사는 수신거절의 의사를 명백히 표시한 회원에 대해서는 회원이 원하지 않는 영리목적의 광고성 전자우편(이메일)을 발송하지 않습니다.
          <br/>
          <br/>
          4. 회사는 이용계약의 체결, 계약사항의 변경 및 해지 등 회원과의 계약관계 절차 및 내용 등에 있어 회원에게 편의를 제공하도록 노력합니다. 회원이 탈퇴신청을 할 경우 즉시 탈퇴 처리를 합니다.
          <br/>
          <br/>
          4. 회사는 이용계약의 체결, 계약사항의 변경 및 해지 등 회원과의 계약관계 절차 및 내용 등에 있어 회원에게 편의를 제공하도록 노력합니다. 회원이 탈퇴신청을 할 경우 즉시 탈퇴 처리를 합니다.
          <br/>
          <br/>
          </span>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 12 조 회원의 ID 및 비밀번호에 대한 의무</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회사가 관계법령 및 개인정보보호정책에 의하여 그 책임을 지는 경우를 제외하고, 회원 ID와 비밀번호의 관리책임은 회원에게 있습니다.
          <br/>
          <br/>
          2. 회원은 자신의 ID 및 비밀번호를 제3자가 이용하게 해서는 안됩니다.
          <br/>
          <br/>
          3. 회원이 자신의 ID 및 비밀번호를 도용 당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 회사에 통보하고 회사의 안내가 있는 경우에는 그에 따라야 합니다.
          <br/>
          <br/>
          4. 회사는 회원이 상기 제1항, 제2항, 제3항을 위반하여 회원에게 발생한 손해에 대하여 책임을 일절 지지 않습니다.
          <br/>
          <br/>
          </span>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 13 조 회원의 의무</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회원은 본 약관에 규정하는 사항과 기타 회사가 정한 제반 규정, 서비스 이용안내 또는 공지사항 등 회사가 공지 또는 통지하는 사항 및 관계법령을 준수하여야 하며, 기타 회사의 업무에 방해가 되는 행위, 회사의 명예를 손상 시키는 행위를 하여서는 안됩니다.
          <br/>
          <br/>
          2. 회사가 관계법령 및 개인정보보호정책에 의하여 그 책임을 지는 경우를 제외하고 제11조의 관리소홀, 부정사용에 의하여 발생되는 모든 결과에 대한 책임은 회원에게 있습니다.
          <br/>
          <br/>
          3. 회원은 회사의 명시적인 동의가 없는 한 서비스의 이용권한, 기타 이용계약 상의 지위를 타인에게 양도, 증여할 수 없으며, 이를 담보로 제공할 수 없습니다.
          <br/>
          <br/>
          4. 회원은 서비스 이용과 관련하여 제31조 제1항의 각 호에 해당하는 행위를 하여서는 안됩니다.
          <br/>
          <br/>
          5. 이용자는 회원가입 신청 또는 회원정보 변경 시 실명으로 모든 사항을 사실에 근거하여 작성하여야 하며, 허위 또는 타인의 정보를 등록할 경우 일체의 권리를 주장할 수 없습니다.
          <br/>
          <br/>
          6. 회원은 이메일 주소 등 이용계약사항이 변경된 경우에 해당 절차를 거쳐 이를 회사에 즉시 알려야 합니다.
          <br/>
          <br/>
          7. 회원은 회사 및 제3자의 지적 재산권을 침해해서는 안됩니다.
          <br/>
          <br/>
          8. 회원은 다음 각 호에 해당하는 행위를 하여서는 안되며, 해당 행위를 하는 경우에 회사는 회원의 서비스 이용제한 및 적법조치를 포함한 제재를 가할 수 있습니다.
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑴ 회원가입 신청 또는 회원정보 변경 시 허위내용을 등록하는 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑵ 다른 이용자의 ID, 비밀번호, 이메일 주소를 도용하는
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          행위 
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑶ 이용자 ID를 타인과 거래하는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑷ 회사의 운영진, 직원 또는 관계자를 사칭하는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑸ 회사로부터 특별한 권리를 부여받지 않고 회사의  클라이언트
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          프로그램을 변경하거나, 회사의 서버를 해킹하거나, 웹사이
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          트 또는 게시된 정보의 일부분 또는 전체를 임의로 변경
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          하는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑹ 서비스에 위해를 가하거나 고의로 방해하는 행위 
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑺ 본 서비스를 통해 얻은 정보를 회사의 사전 승낙 없이
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          서비스 이용 외의 목적으로 복제하거나, 이를 출판 및
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          방송 등에 사용하거나, 제 3자에게 제공하는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑻ 회사 또는 제3자의 저작권 등 기타 지적재산권을 침해 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          하는 내용을 전송, 게시, 전자우편 또는 기타의 방법으
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          로 타인에게 유포하는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑼ 공공질서 및 미풍양속에 위반되는 저속, 음란한 내용 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          의 정보, 문장, 도형, 음향, 동영상을 전송, 게시, 전자
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          우편 또는 기타의 방법으로 타인에게 유포하는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑽ 모욕적이거나 개인신상에 대한 내용이어서 타인의 명 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          예나 프라이버시를 침해할 수 있는 내용을 전송, 게시,
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          전자우편 또는 기타의 방법으로 타인에게 유포하는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑾ 다른 이용자를 희롱 또는 위협하거나, 특정 이용자에 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          게 지속적으로 고통 또는 불편을 주는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑿ 회사의 승인을 받지 않고 다른 사용자의 개인정보를 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          수집 또는 저장하는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⒀ 범죄와 결부된다고 객관적으로 판단되는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⒁ 본 약관을 포함하여 기타 회사가 정한 제반 규정 또는 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          이용 조건을 위반하는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⒂ 기타 관계법령에 위배되는 행위 
          </span>
          <br/>
          <br/>
          </span>
          <span style={{fontSize:'20px', fontWeight:'bold'}}>[제 4 장 서비스 이용]</span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 14 조 정보의 제공 및 통지</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회사는 회원이 서비스 이용 중 필요하다고 인정되는 다양한 정보를 공지사항 혹은 전자우편 등의 방법으로 회원에게 제공할 수 있습니다.
          <br/>
          <br/>
          2. 회사는 불특정다수 회원에 대한 통지를 하는 경우 공지 게시판에 게시함으로써 개별 통지에 갈음할 수 있습니다.
          <br/>
          <br/>
          </span>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 15 조 게시물의 저작권 및 관리</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회사는 회원의 게시물을 소중하게 생각하며 변조, 훼손, 삭제되지 않도록 최선을 다하여 보호합니다.
다만, 다음 각 호에 해당하는 게시물이나 자료의 경우 사전통지 없이 삭제하거나 이동 또는 등록 거부를 할 수 있으며, 해당 회원의 자격을 제한, 정지 또는 상실시킬 수 있습니다.
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑴ 다른 회원 또는 제 3자에게 심한 모욕을 주거나 명예
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          를 손상시키는 내용인 경우 
          <br/>
          </span>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑵ 공공질서 및 미풍양속에 위반되는 내용을 유포하거나
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          링크시키는 경우
          <br/>
          </span>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑶ 불법복제 또는 해킹을 조장하는 내용인 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑷ 영리를 목적으로 하는 광고일 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑸ 범죄적 행위에 결부된다고 인정되는 내용인 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑹ 회사나 다른 회원의 저작권 혹은 제3자의 저작권 등
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          기타 권리를 침해하는 내용인 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑺ 회사에서 규정한 게시물 원칙에 어긋나거나, 게시판
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          성격에 부합하지 않는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑻ 스팸성 게시물인 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑼ 기타 관계법령에 위배된다고 판단되는 경우
          </span>
          <br/>
          <br/>
          2. 회사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 회사에 귀속됩니다.
          <br/>
          <br/>
          3. 회원이 서비스 화면 내에 게시한 게시물의 저작권은 게시한 회원에게 귀속됩니다. 또한 회사는 게시자의 동의 없이 게시물을 상업적으로 이용할 수 없습니다.
다만, 입사지원서의 경우 관련법규 및 회사규정에 따라 제출된 지원서를 회원 본인에게 반환하지 않을 수 있습니다.
          <br/>
          <br/>
          4. 회원은 서비스를 이용하여 취득한 정보를 회사의 사전 승낙 없이 임의가공, 판매, 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
          <br/>
          <br/>
          </span>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 16 조 광고게재 및 광고주와의 거래</span>
          <br />
          <br />
          <span style={{fontSize:'12px'}}>
          1. 회사가 제공하는 서비스 내에 다양한 배너와 링크(Link)를 포함할 수 있으며, 이는 광고주와의 계약관계에 의하거나 제공받은 컨텐츠의 출처를 밝히기 위한 조치입니다. 회원은 서비스 이용 시 노출되는 광고게재에 대해 동의합니다.
          <br/>
          <br/>
          2. 서비스 내에 포함되어 있는 링크를 클릭하여 타 사이트의 페이지로 옮겨갈 경우 해당 사이트의 개인정보보호정책은 회사와 무관합니다.
          <br/>
          <br/>
          </span>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 17 조 서비스 제공의 중단 등</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. 회사는 다음 각 호의 내용에 해당하는 경우 서비스 제공의 일부 혹은 전부를 제한하거나 중단할 수 있습니다.
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑴ 정보통신설비의 보수 점검, 교체 및 고장 등 공사로 인한 부
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          득이 한 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑵ 기간통신사업자가 전기통신서비스를 중단했을 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑶ 서비스 이용의 폭주 등으로 정상적인 서비스 이용에
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          지장이 있는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑷ 국가비상사태 등 기타 불가항력적인 사유가 있는 경우
          </span>
          <br/>
          <br/>
          2. 전항에 의한 서비스 중단의 경우에는 회사는 제14조에 정한 방법으로 그 사유 및 기간 등을 공지합니다.
다만, 회사가 통제할 수 없는 사유로 발생한 서비스의 중단(시스템관리자의 고의, 과실 없는 디스크 장애, 시스템 다운 등)에 대하여 사전공지가 불가능한 경우에는 예외로 합니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 18 조 회원 ID 관리</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. 회원 ID와 비밀번호에 관한 모든 관리책임은 회원에게 있습니다.
          <br/>
          <br/>
          2. 회원이 등록한 회원 ID 및 비밀번호에 의하여 발생되는 사용상의 과실 또는 제3자에 의한 부정사용 등에 대한 모든 책임은 해당 이용고객에게 있습니다.
          <br/>
          <br/>
          </span>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 19 조 정보의 제공</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. 회사는 회원에게 서비스 이용에 필요가 있다고 인정되는 각종 정보에 대해서 전자우편이나 서신우편 등의 방법으로 회원에게 제공할 수 있습니다.
          <br/>
          <br/>
          2. 회사는 서비스 개선 및 회원 대상의 서비스 소개 등의 목적으로 회원의 동의 하에 추가적인 개인 정보를 요구할 수 있습니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'20px', fontWeight:'bold'}}>[제 5 장 컨텐츠 서비스 제공]</span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 20 조 ("콘텐츠"의 내용 등의 게시)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. "회사"는 "콘텐츠"의 내용, 이용방법 등을 이용초기화면에 "이용자"가 알기 쉽게 표시합니다.
          <br/>
          <br/>
          2. "회사"는 "콘텐츠"별 이용가능기기 및 이용에 필요한 최소한의 기술사양에 관한 정보를 "이용자"에게 제공합니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 21 조 ("콘텐츠" 이용 신청)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. "이용자"는 "회사"가 제공하는 다음 또는 이와 유사한 절차에 의하여 이용신청을 합니다.
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ① "콘텐츠" 목록의 열람 및 선택
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ② "콘텐츠"의 이용신청에 관한 확인 또는 "회사"의 확인
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          에 대한 동의
          </span>
          <br/>
          <br/>
          2. "회사"는 "이용자"의 이용신청이 다음 각 호에 해당하는 경우에는 승낙하지 않거나 승낙을 유보할 수 있습니다.
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ① 실명이 아니거나 타인의 명의를 이용한 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ② 허위의 정보를 기재하거나, "회사"가 제시하는 내용을
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          기재하지 않은 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ③ 서비스 관련 설비의 여유가 없거나, 기술상 또는 업무
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          상 문제가 있는 경우
          </span>
          <br/>
          <br/>
          3. "회사"의 승낙의 의사표시에는 "이용자"의 이용신청에 대한 확인 및 서비스제공 가능여부, 이용신청의 정정/취소 등에 관한 정보 등을 포함합니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 22 조 ("회사"의 의무)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. "회사"는 법령과 본 약관이 정하는 권리의 행사와 의무의 이행을 신의에 좇아 성실하게 하여야 합니다.
          <br/>
          <br/>
          2. "회사"는 "이용자"가 안전하게 "콘텐츠"를 이용할 수 있도록 개인정보(신용정보 포함)보호를 위해 보안시스템을 갖추어야 하며 개인정보보호정책을 공시하고 준수합니다.
          <br/>
          <br/>
          3. "회사"는 콘텐츠 이용과 관련하여 "이용자"로 부터 제기된 의견이나 불만이 정당하다고 인정할 경우에는 이를 지체없이 처리합니다. 이용자가 제기한 의견이나 불만사항에 대해서는 게시판을 활용하거나 전자우편 등을 통하여 그 처리과정 및 결과를 전달합니다.
          <br/>
          <br/>
          </span>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 23 조 ("이용자"의 의무)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. "이용자"는 다음 행위를 하여서는 안 됩니다.
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ① 신청 또는 변경 시 허위내용의 기재
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ② 타인의 정보도용
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ③ "회사"에 게시된 정보의 변경
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ④ "회사"가 금지한 정보(컴퓨터 프로그램 등)의 송신 또
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          는 게시
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑤ "회사"와 기타 제3자의 저작권 등 지식재산권에 대한
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          침해
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑤ "회사"와 기타 제3자의 저작권 등 지식재산권에 대한
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          침해
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑦ 외설 또는 폭력적인 말이나 글, 화상, 음향, 기타 공서양속에
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          반하는 정보를 "회사"의 사이트에 공개 또는 게시하는 행위
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑧ 기타 불법적이거나 부당한 행위
          </span>
          <br/>
          <br/>
          2. "이용자"는 관계법령, 본 약관의 규정, 이용안내 및 "콘텐츠"와 관련하여 공지한 주의사항, "회사"가 통지하는 사항 등을 준수하여야 하며, 기타 "회사"의 업무에 방해되는 행위를 하여서는 안 됩니다.
          <br/>
          <br/>
          3. 이용자는 서비스의 이용권한, 기타 이용계약 상의 지위를 타인에게 양도, 증여할 수 없으며, 이를 담보로 제공할 수 없습니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 24 조 (콘텐츠 서비스의 제공 및 중단)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. 콘텐츠 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.
          <br/>
          <br/>
          2. "회사"는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 또는 운영상 상당한 이유가 있는 경우 콘텐츠서비스의 제공을 일시적으로 중단할 수 있습니다.
          <br/>
          <br/>
          3. "회사"는 콘텐츠서비스의 제공에 필요한 경우 정기점검을 실시할 수 있으며, 정기점검시간은 서비스제공화면에 공지한 바에 따릅니다.
          <br/>
          <br/>
          </span>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 25 조 (콘텐츠 서비스의 변경)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. "회사"는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에 따라 제공하고 있는 콘텐츠 서비스를 변경할 수 있습니다.
          <br/>
          <br/>
          2. "회사"는 콘텐츠 서비스의 내용, 이용방법, 이용시간을 변경할 경우에 변경사유, 변경될 콘텐츠 서비스의 내용 및 제공일자 등을 그 변경 전 7일 이상 해당 콘텐츠 초기화면에 게시합니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 26 조 (정보의 제공 및 광고의 게재)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. "회사"는 "이용자"가 콘텐츠 이용 중 필요하다고 인정되는 다양한 정보를 등의 방법으로 "회원"에게 제공할 수 있습니다.
          <br/>
          <br/>
          2. 제1항의 정보를 전자적 전송매체에 의하여 전송하려고 하는 경우에는 "회원"의 사전 동의를 받아서 전송합니다.
          <br/>
          <br/>
          3. "회사"는 "콘텐츠"서비스 제공과 관련하여 콘텐츠화면, 홈페이지, 전자우편 등에 광고를 게재할 수 있습니다. 광고가 게재된 전자우편 등을 수신한 "회원"은 수신거절을 "회사"에게 할 수 있습니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 27 조 (게시물의 삭제)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. "회사"는 게시판에 정보통신망이용촉진 및 정보보호 등에 관한 법률을 위반한 매체물이 게시되어 있는 경우에는 이를 지체 없이 삭제 합니다.
          <br/>
          <br/>
          2. "회사"가 운영하는 게시판 등에 게시된 정보로 인하여 법률상 이익이 침해된 자는 "회사"에게 당해 정보의 삭제 또는 반박내용의 게재를 요청할 수 있습니다. 이 경우 "회사"는 지체 없이 필요한 조치를 취하고 이를 즉시 신청인에게 통지합니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 28 조 (저작권 등의 귀속)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. "회사"가 작성한 저작물에 대한 저작권 기타 지식재산권은 "회사"에 귀속합니다.
          <br/>
          <br/>
          2. "회사"가 제공하는 서비스 중 제휴계약에 의해 제공되는 저작물에 대한 저작권 기타 지식재산권은 해당 제공업체에 귀속합니다.
          <br/>
          <br/>
          3. "이용자"는 "회사"가 제공하는 서비스를 이용함으로써 얻은 정보 중 "회사" 또는 제공업체에 지식재산권이 귀속된 정보를 "회사" 또는 제공업체의 사전서면승인 없이 복제, 전송, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 29 조 (개인정보보호)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          "회사"는 정보통신망이용촉진 및 정보보호에 관한 법률 등 관계 법령이 정하는 바에 따라 "이용자"의 "개인정보"를 보호하기 위해 노력합니다. "개인정보"의 보호 및 사용에 대해서는 관련법령 및 "회사"의 개인정보보호정책이 적용됩니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'20px', fontWeight:'bold'}}>[제 6 장 계약해지 및 이용제한]</span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 30 조 계약 변경 및 해지</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          회원이 이용계약을 해지하고자 하는 경우에는 회원 본인이 사이트 내의 개인정보관리 페이지를 통해 등록 해지 신청을 하여야 합니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 31 조 서비스 이용제한</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. 회원은 본 약관 제11조, 제12조 내용을 위반하거나 다음 각 호에 해당하는 행위를 하는 경우에 회사는 회원의 서비스 이용을 제한할 수 있습니다.
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑴ 미풍양속을 저해하는 비속한 ID 및 별명 사용
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑵ 타 이용자에게 심한 모욕을 주거나, 서비스 이용을 방해한 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑶ 정보통신 윤리위원회 등 관련 공공기관의 시정 요구가 
          </span>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          있는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑷ 36개월 이상 서비스를 이용한 적이 없는 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑸ 불법 게시물을 게재한 경우
          </span>
          <br/>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          - 상용소프트웨어나 크랙파일을 올린 경우
          </span>
          <br/>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          - 정보통신윤리위원회 심의세칙 제 7조에 어긋나는 
          </span>
          <br/>
          <span style={{fontSize:'10px', marginLeft:'34px'}}>
          음란물을 게재한 경우
          </span>
          <br/>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          - 반국가적 행위의 수행을 목적으로 하는 내용을 포함
          </span>
          <span style={{fontSize:'10px', marginLeft:'34px'}}>
          한 경우
          </span>
          <br/>
          <span style={{fontSize:'10px', marginLeft:'28px'}}>
          - 저작권이 있는 글이나 음원, 영상 등을 무단 복제하
          </span>
          <span style={{fontSize:'10px', marginLeft:'34px'}}>
          여 게재한 경우
          </span>
          <br/>
          <span style={{marginLeft:'15px', fontSize:'10px'}}>
          ⑹ 기타 정상적인 서비스 운영에 방해가 될 경우
          </span>
          <br/>
          <br/>
          2. 상기 이용제한 규정에 따라 서비스를 이용하는 회원에게 서비스 이용에 대하여 별도 공지없이 서비스 이용의 일시정지, 초기화, 이용계약 해지 등의 조치를 취할 수 있으며, 회원은 전항의 귀책사유로 인하여 회사나 다른 회원에게 입힌 손해를 배상할 책임이 있습니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'20px', fontWeight:'bold'}}>[제 7 장 기타사항]</span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 32 조 손해배상</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          회사는 무료로 제공하는 서비스의 이용과 관련하여 개인정보보호정책에서 정하는 내용에 해당하지 않는 사항에 대하여는 어떠한 손해도 책임을 지지 않습니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 33 조 (면책조항)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. 회사는 천재지변, 전쟁 및 기타 불가항력, 회사의 합리적인 통제범위를 벗어난 사유로 인하여 서비스를 제공할 수 없는 경우에는 그에 대한 책임이 면제됩니다.
          <br/>
          <br/>
          2. 회사는 기간통신 사업자가 전기통신 서비스를 중지하거나 정상적으로 제공하지 아니하여 손해가 발생한 경우 책임이 면제됩니다.
          <br/>
          <br/>
          3. 회사는 서비스용 설비의 보수, 교체, 정기점검, 공사 등 부득이한 사유로 발생한 손해에 대한 책임이 면제됩니다.
          <br/>
          <br/>
          4. 회사는 이용자의 귀책사유로 인한 서비스 이용의 장애 또는 손해에 대하여 책임을 지지 않습니다.
          <br/>
          <br/>
          5. 회사는 이용자의 컴퓨터 오류에 의해 손해가 발생한 경우, 또는 회원이 신상정보 및 전자우편 주소를 부실하게 기재하여 손해가 발생한 경우 책임을 지지 않습니다.
          <br/>
          <br/>
          6. 회사는 회원이 서비스를 이용하여 기대하는 수익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않습니다.
          <br/>
          <br/>
          7. 회사는 회원이 서비스를 이용하면서 얻은 자료로 인한 손해에 대하여 책임을 지지 않습니다. 또한 회사는 회원이 서비스를 이용하며 타 회원으로 인해 입게 되는 정신적 피해에 대하여 보상할 책임을 지지 않습니다.
          <br/>
          <br/>
          8. 회원이 서비스 화면에 게재한 정보, 자료, 사실 등의 내용에 관한 신뢰도 혹은 정확성에 대하여는 해당회원이 책임을 부담하며, 회사는 내용의 부정확 또는 허위로 인해 회원 또는 제3자에게 발생한 손해에 대하여는 아무런 책임을 부담하지 않습니다.
          <br/>
          <br/>
          9. 회사는 회원 상호 간 및 회원과 제3자 상호 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해를 배상할 책임도 없습니다.
          <br/>
          <br/>
          10. 회사는 서비스 이용과 관련하여 회원의 고의 또는 과실로 인하여 회원 또는 제3자에게 발생한 손해에 대하여는 아무런 책임을 부담하지 않습니다.
          <br/>
          <br/>
          11. 회사에서 회원에게 무료로 제공하는 서비스의 이용과 관련해서는 개인정보보호정책에서 정하는 내용을 제외하고 어떠한 손해도 책임을 지지 않습니다.
          <br/>
          <br/>
          </span>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 34 조 (분쟁의 해결)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. 회사는 회원이 제기하는 의견이나 불만에 대하여 적절하고 신속하게 처리하고, 그 결과를 통지합니다. 다만, 신속한 처리가 곤란한 경우에 회사는 회원에게 그 사유와 처리일정을 통보합니다.
          <br/>
          <br/>
          2. 회사는 회원이 제기한 의견 등이 정당하지 않음을 이유로 처리하지 않은 경우 이의 사유를 통보합니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'16px', fontWeight:'bold'}}>제 35 조 (재판권 및 준거법)</span>
          <br/>
          <br/>
          <span style={{fontSize:'12px'}}>
          1. 회사와 회원 간의 서비스 이용에 관한 소송은 제소 당시의 회원의 주소에 의하고, 주소가 없는 경우 거소를 관할하는 지방법원의 전속관할로 합니다.
          <br/>
          <br/>
          2. 제소 당시 회원의 주소 또는 거소가 분명하지 아니한 경우 관할법원은 「민사소송법」에 따라 정합니다.
          </span>
          <br/>
          <br/>
          <span style={{fontSize:'12px', color:'gray'}}>
          [부칙] 본 약관은 2023년 08월 18일부터 적용됩니다.
          </span>
          <br/>
          <br/>
          </Typography>
        </Box>
      </Modal>
    </div>
    );
}


export default Signup;