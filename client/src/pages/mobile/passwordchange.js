import React, { useState } from 'react';
import './passwordchange.css'
import Footer from './footer';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import axiosInstance from '../../axios/axios'
import { setPassword } from '../../redux/mobileauthlogin'
import { useSelector, useDispatch } from 'react-redux';


function Passwordchange() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const carNumber = useSelector((state) => state.mobileInfo.carNumber);
    const loginId = useSelector((state) => state.mobileInfo.loginId);
    const name = useSelector((state) => state.mobileInfo.name);
    const phoneNumber = useSelector((state) => state.mobileInfo.phoneNumber);
    const password = useSelector((state) => state.auth.password)
    const villarnumber = useSelector((state) => state.mobileInfo.villaNumber)
    const villaidnumber = useSelector((state) => state.mobileInfo.villaIdNumber)

    const [showPassword, setShowPassword] = React.useState(false);
    const [shownewPassword, setShownewPassword] = React.useState(false);
    const [showCheckPassword, setShowCheckPassword] = React.useState(false);
    const [password1, setPasswordLocal1] = React.useState('');
    const [password2, setPasswordLocal2] = React.useState('');
    const [password3, setPasswordLocal3] = React.useState('');
    const [passwordChecking, setPasswordChecking] = useState(false);
    const [NewpasswordChecking, setNewPasswordChecking] = useState(false);
    const [NowAndNewpasswordChecking, setNowAndNewpasswordChecking] = useState(false);
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    // 비밀번호 보기 / 숨기기 토글
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    // 새 비밀번호 확인 보기 / 숨기기 토글
    const handleClickShowNewPassword = () => setShownewPassword((show) => !show);

    // 새 비밀번호 확인 보기 / 숨기기 토글
    const handleClickShowCheckPassword = () => setShowCheckPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleopenmyupdatepage = () => {
        navigate('/Mobile/Account/Update')
    }

    //비밀번호 규칙 체크 함수
    const passwordCheck = (password) => {
        // 비밀번호 유효성 검사: 최소 8자 이상, 최대 16자 이하, 문자/숫자/특수문자 포함 여부 체크
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,17}$/;
        return passwordRegex.test(password);
    };

        // 입력값이 변경될때 호출되는 이벤트
        const handleInputChange = (event) => {
            const { name, value } = event.target;
            if (name === 'password1') {
                const checkpasswordvalue = value.slice(0, 16);
                setPasswordLocal1(checkpasswordvalue);
                if (value.trim() === password.trim()) {
                    setPasswordChecking(false)
                } else {
                    setPasswordChecking(true)
                }
            } else if (name === 'password2') {
                // 비밀번호 입력 길이를 16글자로 제한
                const checkpasswordvalue1 = value.slice(0, 16);
                setPasswordLocal2(checkpasswordvalue1);
                if (value.trim() === '') {
                    setNewPasswordChecking(false); // 빈 칸일 때 규칙 메시지 숨김
                } else {
                    setNewPasswordChecking(!passwordCheck(value));
                    if (value.trim() === password1) {
                        setNowAndNewpasswordChecking(true)
                    } else {
                        setNowAndNewpasswordChecking(false)
                }
            }

    
            } else if (name === 'password3') {
                // 비밀번호 확인 입력 길이를 16글자로 제한
                const checkpasswordvalue2 = value.slice(0, 16);
                setPasswordLocal3(checkpasswordvalue2);
                if (value.trim() === '') {
                    setPasswordMismatch(false);
                } else {
                    // 비밀번호 확인과 일치하는지 확인
                    setPasswordMismatch(value !== password2);
                }
            }
            };

    // 기존 비밀번호 입력 및 새 비밀번호/새 비밀번호 확인 일치, 기존 비밀번호 새 비밀번호가 다를 경우 확인 버튼 활성화
    const isChangePasswordClickable = password1.trim() !== password2.trim && password2.trim() === password3.trim() && password1.trim() !== '' && password2.trim() !== '';

    // 비밀번호 변경 완료시 결과
    const handleOpenChangePasswordResultPage = () => {
        if (isChangePasswordClickable) {
            axiosInstance({
                method:'put',
                url:'/tenant',
                data:{
                  "carNumber": carNumber,
                  "loginId": loginId,
                  "loginPassword": password2,
                  "name": name,
                  "phoneNumber": phoneNumber,
                  "villaIdNumber": villaidnumber,
                  "villaNumber": villarnumber
                },
              })
              .then((res) => {
                if (res.data.success === true) {
                  dispatch(setPassword(password2));
                  navigate('/Mobile/Login')
                }
              })
              .catch((err) => {
                console.log(err)
              })
        }
    }
    return (
        <div>
          <Box sx={{        
                height: 30,
                backgroundColor: '#212121',
                }} onClick={handleopenmyupdatepage} >
          <KeyboardBackspaceIcon sx={{color:'white', position:'absolute', top:'0.5%', left:'3%'}} />
          <p className='myinfoupdatetext'>비밀번호 변경</p>
          </Box>
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" className="updatenowpw" required>
            <InputLabel htmlFor="outlined-adornment-password1">기존 비밀번호</InputLabel>
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
            label="기존 비밀번호"
            name="password1"
            value={password1}
            onChange={handleInputChange}
            />
        </FormControl>
        {passwordChecking && <p className="nowpassword-check-text">기존 비밀번호와 일치하지 않습니다.</p>}
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" className="updatenewpw" required>
            <InputLabel htmlFor="outlined-adornment-password1">새 비밀번호</InputLabel>
            <OutlinedInput
            id="outlined-adornment-password1"
            type={shownewPassword ? 'text' : 'password'}
            endAdornment={
                <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowNewPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                >
                    {shownewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
                </InputAdornment>
            }
            label="새 비밀번호"
            name="password2"
            value={password2}
            onChange={handleInputChange}
            />
        </FormControl>
        {NowAndNewpasswordChecking && <p className="updatenewpassword-check-text">기존 비밀번호와 새 비밀번호가 같습니다.</p>}
        {NewpasswordChecking && <p className="updatenewpassword-check-text">비밀번호에는 숫자,문자,특수문자가 최소 1개이상씩 포함되어야 합니다.</p>}
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" className="updatenewpw1" required>
            <InputLabel htmlFor="outlined-adornment-password2">새 비밀번호 확인</InputLabel>
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
            label="새 비밀번호 확인"
            name="password3"
            value={password3}
            onChange={handleInputChange}
            />
        </FormControl>
        {passwordMismatch && <p className="newpassword-checked-text">비밀번호가 다릅니다. 다시 확인바랍니다.</p>}
            <Box
            component="span"
            className={`loginbox ${isChangePasswordClickable ? 'passwordupdatebtn2' : 'passwordupdatebtn1'}`}
            onClick={handleOpenChangePasswordResultPage}
            >
            <p className="text1">확인</p>
            </Box>
            <Footer AccounticonColor="#33907C"/>
        </div>
    )
}

export default Passwordchange;