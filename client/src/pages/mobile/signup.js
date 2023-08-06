import './signup.css'
import React, { useState } from 'react';
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
        <Box sx={style1}>
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
    </div>
    );
}


export default Signup;