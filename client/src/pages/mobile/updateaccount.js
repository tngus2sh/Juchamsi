import React, { useState } from 'react'
import './updateaccount.css'
import Footer from './footer';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import axiosInstance from '../../axios/axios'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { setCarNumber, setphoneNumber, setVillaNumber} from '../../redux/mobileUserinfo'

function Account() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const carNumber = useSelector((state) => state.mobileInfo.carNumber);
    const loginId = useSelector((state) => state.mobileInfo.loginId);
    const name = useSelector((state) => state.mobileInfo.name);
    const phoneNumber = useSelector((state) => state.mobileInfo.phoneNumber);
    const password = localStorage.getItem('password').length;
    const pw = '*'.repeat(password);
    const villarnumber = useSelector((state) => state.mobileInfo.villaNumber)
    const villaidnumber = useSelector((state) => state.mobileInfo.villaIdNumber)
    const [updatephonenumber, setupdatephonenumber] = React.useState(false);
    const [updatecarnumberModal, setupdatecarnumberModal] = React.useState(false);
    const [updatehousenumberModal, setupdatehousenumberModal] = React.useState(false);
    const [updatephonenumberupdate, setupdatephonenumberupdate] = React.useState(false);
    const [phonenumber, setPhoneNumber] = React.useState('');
    const [newcarnumber, setnewcarnumber] = React.useState('');
    const [newhousenumber, setnewhousenumber] = React.useState('');
    const [phonechecknumber, setphonechecknumber] = useState('');
    const [phoneCheckingNumber, setPhoneCheckingNumber] = useState(null);
    const [phoneModalTrueOpen, setPhoneModalTrueOpen] = React.useState(false);
    const [phoneModalFalseOpen, setPhoneModalFalseOpen] = React.useState(false);
    const handleOpenPhoneTrueCheck = () => setPhoneModalTrueOpen(true);
    const handleOpenPhoneFalseCheck = () => setPhoneModalFalseOpen(true);
    const handleClosePhoneTrueCheck = () => setPhoneModalTrueOpen(false)
    const [newcarResult, setnewResult] = React.useState(false);
    const [newhouseResult, setnewhouseResult] = React.useState(false);

    const style3 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 230,
        height:'160px',
        bgcolor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        maxHeight: '80vh', // 최대 높이 설정
        overflowY: 'auto', // 스크롤바 추가
      };

      const editnoteclick1 = () => {
        navigate('/Mobile/Acoount/Update/PasswordChange')
      }

      const editnoteclick3 = () => {
        setupdatecarnumberModal(true); // 모달 열기
      }

      const handlecloseupdatecarnumber = () => {
        setupdatecarnumberModal(false); // 모달 닫기
      }

      const editnoteclick4 = () => {
        setupdatehousenumberModal(true); // 모달 열기
      }

      const handlecloseupdatehousenumber = () => {
        setupdatehousenumberModal(false); // 모달 닫기
      }

      const handleCloseCarTrueCheck = () => {
        setnewResult(false); // 모달 닫기
      }
      
      const handleCloseHouseTrueCheck = () => {
        setnewhouseResult(false); // 모달 닫기
      }

      const editnoteclick5 = () => {
        console.log('editnoteclick5')
      }

      const handleopenmypage = () => {
        navigate('/Mobile/Account')
      }

      const handleLoginoutOpen = () => {
        axiosInstance({
          method:'get',
          url:`/tenant/logout/${loginId}`,
        })
        .then(() => {
          navigate('/Mobile/Login')
        })
        .catch((err) => {
          console.log(err)
        })
      }

    const handleOpenupdatephonenumber = () => {
      setupdatephonenumber(true); // 모달 열기
    }
    const handleCloseupdatephonenumber = () => {
      setupdatephonenumber(false); // 모달 닫기
    }

    const handleOpenupdatephonenumberupdate = () => {
      setupdatephonenumberupdate(true); // 모달 열기
      axiosInstance({
        method:'post',
        url:'/sms/check',
        data:{
          "name": name,
          "to": phonenumber
        },
      })
      .then((res) => {
        setPhoneCheckingNumber(res.data.response);
      })
      .catch((err) => {
        console.log(err)
      })
    }
    const handleCloseupdatephonenumberupdate = () => {
      setupdatephonenumberupdate(false); // 모달 닫기
    }

    // 핸드폰 번호 입력값이 변경될 때 호출되는 이벤트 핸들러
    const handlePhoneNumberChange = (e) => {
      // 숫자만 입력 가능하도록 정규식을 이용하여 유효성 검사
      const onlyNumbers = e.target.value.replace(/[^\d]/g, '');
  
      // 최대 11자까지만 입력 가능하도록 제한
      const maxLength = 11;
      const truncatedValue = onlyNumbers.slice(0, maxLength);
  
      setPhoneNumber(truncatedValue);
      };

    // 자동차번호 입력값이 변경될 때 호출되는 이벤트 핸들러
    const handleCarNumberChange = (e) => {
      // 숫자,한글만 입력가능하도록 규칙 설정
      const onlyCarnumber = e.target.value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣/0-9/ ]/g, '');

      // 최대 9자까지만 입력 가능하도록 제한
      const carnumbermaxLength = 9;
      const checkCarnumber = onlyCarnumber.slice(0, carnumbermaxLength);

      setnewcarnumber(checkCarnumber);
      };

    // 호수 입력값이 변경될 때 호출되는 이벤트 핸들러
    const handleHouseNumberChange = (e) => {
      // 숫자,한글만 입력가능하도록 규칙 설정
      const onlyHousenumber = e.target.value.replace(/[^\d]/g, '');

      // 최대 9자까지만 입력 가능하도록 제한
      const housenumbermaxLength = 3;
      const checkHousenumber = onlyHousenumber.slice(0, housenumbermaxLength);

      setnewhousenumber(checkHousenumber);
      };

    const handleChangePhoneCheck = () => {
      if (phonenumber.trim() !== '') {
        handleCloseupdatephonenumber()
        handleOpenupdatephonenumberupdate()
      } else {
        console.log(2)
      }
    }

    const handleOpenupdatecarnumber = () => {
      setnewResult(true)
    }
    const handleOpenupdateHousenumber = () => {
      setnewhouseResult(true)
    }

    const handleChangeCarResult = () => {
      if (newcarnumber.trim() !== '') {
        handlecloseupdatecarnumber()
        handleOpenupdatecarnumber()
      } else {
        console.log(2)
      }
    }

    const handleChangeHouseResult = () => {
      if (newhousenumber.trim() !== '') {
        handlecloseupdatehousenumber()
        handleOpenupdateHousenumber()
      } else {
        console.log(2)
      }
    }

    // 비밀번호 인증번호가 변경될 때 호출되는 이벤트 핸들러
    const handlephonechecknumberChange = (e) => {
      // 숫자 입력가능하도록 규칙 설정
      const onlyphonechecknumber = e.target.value.replace(/[^0-9/ ]/g, '');
  
      // 최대 9자까지만 입력 가능하도록 제한
      const phonechecknumbermaxLength = 6;
      const phonecheckumber = onlyphonechecknumber.slice(0, phonechecknumbermaxLength);
  
      setphonechecknumber(phonecheckumber);
      };

    // 핸드폰 인증 모달 확인버튼 클릭 이벤트 핸들러
    const handlePhoneModalConfirmClick = () => {
      if (phonechecknumber === phoneCheckingNumber) {
        // 인증이 성공한 경우
        // 기존모달 종료
        handleCloseupdatephonenumberupdate()
        handleOpenPhoneTrueCheck(); // 첫 번째 모달 (성공 모달)을 엽니다.
      } else {
        // 인증이 실패한 경우
        // 기존모달 종료
        handleCloseupdatephonenumberupdate()
        handleOpenPhoneFalseCheck(); // 첫 번째 모달 (실패 모달)을 엽니다.
      }
      }

      // 핸드폰 인증 실패 모달 닫기 이벤트 핸들러
      const handleClosePhoneFalseCheck = () => {
        setPhoneModalFalseOpen(false);
        setphonechecknumber(''); // 핸드폰 인증번호를 초기화
        setupdatephonenumberupdate(true) // 인증번호 입력모달창으로
      };


    const handleChangPhonnumberResult = () => {
      // 핸드폰 번호 정보변경요청
      axiosInstance({
        method:'put',
        url:'/tenant',
        data:{
          "carNumber": carNumber,
          "loginId": loginId,
          "loginPassword": password,
          "name": name,
          "phoneNumber": phonenumber,
          "villaIdNumber": villaidnumber,
          "villaNumber": villarnumber
        },
      })
      .then((res) => {
        console.log(phoneNumber)
        console.log(res)
        if (res.data.success === true) {
          dispatch(setphoneNumber(phonenumber));
          navigate('/Mobile/Login')
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }

    const handleChangCarnumberResult = () => {
      // 자동차 번호 정보변경요청
      axiosInstance({
        method:'put',
        url:'/tenant',
        data:{
          "carNumber": newcarnumber,
          "loginId": loginId,
          "loginPassword": password,
          "name": name,
          "phoneNumber": phoneNumber,
          "villaIdNumber": villaidnumber,
          "villaNumber": villarnumber
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          dispatch(setCarNumber(newcarnumber));
          navigate('/Mobile/Login')
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }

    const handleChangHousenumberResult = () => {
      // 호수 번호 정보변경요청
      axiosInstance({
        method:'put',
        url:'/tenant',
        data:{
          "carNumber": carNumber,
          "loginId": loginId,
          "loginPassword": password,
          "name": name,
          "phoneNumber": phoneNumber,
          "villaIdNumber": villaidnumber,
          "villaNumber": newhousenumber
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          dispatch(setVillaNumber(carNumber));
          navigate('/Mobile/Login')
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }

    return (
        <div>
          <Box sx={{        
                height: 30,
                backgroundColor: '#212121',
                }} onClick={handleopenmypage} >
          <KeyboardBackspaceIcon sx={{color:'white', position:'absolute', top:'0.5%', left:'3%'}} />
          <p className='myinfoupdatetext'>내 정보 수정</p>
          </Box>
            <div className='updatefirstinfo'>
                <Stack direction="row" spacing={2}>
                    <Avatar alt="Remy Sharp" src={process.env.PUBLIC_URL + '/img/mobile/1.jpg'} sx={{ width: 50, height: 50 }}/>
                    <Stack direction="column">
                        <p className='idstyle'>{loginId}</p>
                        <p className='namestyle'>{name}</p>
                    </Stack>
                </Stack>
            </div>
            <Box
                component="span"
                className='Loginoutbtn'
                onClick={handleLoginoutOpen}
            >
                <p className="Loginoutbtntext">로그아웃</p>
            </Box>
            <Box component="span" className='userinfobox'>
            </Box>
            <div onClick={editnoteclick1}>
            <p className='updatepw'>비밀번호 </p>
            <p className='updatepw1'>{pw}</p>
            <EditNoteIcon className='editnote1'/>
            </div>
            <div onClick={handleOpenupdatephonenumber}>
            <p className='updatephonenumber'>핸드폰 번호 </p>
            <p className='updatephonenumber1'>{phoneNumber}</p>
            <EditNoteIcon className='editnote2'/>
            </div>
            <Modal open={updatephonenumber} onClose={handleCloseupdatephonenumber} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" className='updatemodal1' >
              <Box sx={style3} className='updatemodal1'>
              <TextField
                required
                className="updatephonenumbermodal"
                id="outlined-phonenumber-input"
                label="핸드폰 번호"
                name="phonenumber"
                value={phonenumber}
                onChange={handlePhoneNumberChange}
                sx={{ '& input': { textAlign: 'center' } }}
              />
              <p className='updatephonetext1'>관리자의 승인 이후 서비스 이용이 가능합니다.</p>
              <Box
                component="span"
                className='updatephonenumberbtn1'
                onClick={handleChangePhoneCheck}
              >
                <p className="updatephonenumberbtn1text">확인</p>
              </Box>
              </Box>
            </Modal>
            <Modal open={updatephonenumberupdate} onClose={handleCloseupdatephonenumberupdate} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" className='updatemodal1' >
              <Box sx={style3} className='updatemodal1'>
              <TextField
                required
                className="updatephonenumbermodal"
                id="outlined-phonenumber-input"
                label="인증 번호"
                name="phonenumber"
                value={phonechecknumber}
                onChange={handlephonechecknumberChange}
                sx={{ '& input': { textAlign: 'center' } }}
              />
            <Box component="span" className="updatephonecheckingbtn" onClick={handlePhoneModalConfirmClick}>
              <p className="Checkidresult1text">확인</p>
            </Box>
              </Box>
            </Modal>

            {/* 핸드폰 인증 성공 */}
            <Modal open={phoneModalTrueOpen} onClose={handleClosePhoneTrueCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx={style3}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                  인증 성공
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  인증이 성공적으로 완료되었습니다. 관리자의 승인을 기다려주시기 바랍니다.
                </Typography>
                <Box component="span" className="Checkidresult2" onClick={handleChangPhonnumberResult}>
                  <p className="Checkidresult1text">확인</p>
                </Box>
              </Box>
            </Modal>

            {/* 핸드폰 인증 실패 */}
            <Modal open={phoneModalFalseOpen} onClose={handleClosePhoneFalseCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx={style3}>
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
            <div onClick={editnoteclick3}>
            <p className='updatecarnumber'>차량 번호 </p>
            <p className='updatecarnumber1'>{carNumber}</p>
            <EditNoteIcon className='editnote3'/>
            </div>

            <Modal open={updatecarnumberModal} onClose={handlecloseupdatecarnumber} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" className='updatemodal1' >
              <Box sx={style3} className='updatemodal1'>
              <TextField
                required
                className="updatephonenumbermodal"
                id="outlined-phonenumber-input"
                label="자동차 번호"
                name="newcarnumber"
                value={newcarnumber}
                onChange={handleCarNumberChange}
                sx={{ '& input': { textAlign: 'center' } }}
              />
              <p className='updatephonetext1'>관리자의 승인 이후 서비스 이용이 가능합니다.</p>
              <Box
                component="span"
                className='updatephonenumberbtn1'
                onClick={handleChangeCarResult}
              >
                <p className="updatephonenumberbtn1text">확인</p>
              </Box>
              </Box>
            </Modal>
            <Modal open={newcarResult} onClose={handleCloseCarTrueCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx={style3}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  요청을 처리하였습니다. 관리자의 승인을 기다려주시기 바랍니다.
                </Typography>
                <Box component="span" className="Checkidresult2" onClick={handleChangCarnumberResult}>
                  <p className="Checkidresult1text">확인</p>
                </Box>
              </Box>
            </Modal>
            <div onClick={editnoteclick4}>
              <p className='updatehousenumber'>호수 </p>
              <p className='updatehousenumber1'>{villarnumber}</p>
              <EditNoteIcon className='editnote4'/>
            </div>
            <Modal open={updatehousenumberModal} onClose={handlecloseupdatehousenumber} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" className='updatemodal1' >
              <Box sx={style3} className='updatemodal1'>
              <TextField
                required
                className="updatephonenumbermodal"
                id="outlined-phonenumber-input"
                label="호수"
                name="newhousenumber"
                value={newhousenumber}
                onChange={handleHouseNumberChange}
                sx={{ '& input': { textAlign: 'center' } }}
              />
              <p className='updatephonetext1'>관리자의 승인 이후 서비스 이용이 가능합니다.</p>
              <Box
                component="span"
                className='updatephonenumberbtn1'
                onClick={handleChangeHouseResult}
              >
                <p className="updatephonenumberbtn1text">확인</p>
              </Box>
              </Box>
            </Modal>
            <Modal open={newhouseResult} onClose={handleCloseHouseTrueCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
              <Box sx={style3}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  요청을 처리하였습니다. 관리자의 승인을 기다려주시기 바랍니다.
                </Typography>
                <Box component="span" className="Checkidresult2" onClick={handleChangHousenumberResult}>
                  <p className="Checkidresult1text">확인</p>
                </Box>
              </Box>
            </Modal>
            <div onClick={editnoteclick5}>
            <p className='updateeasypwnumber'>간편 비밀번호 </p>
            <p className='updateeasypwnumber1'>******</p>
            <EditNoteIcon className='editnote5'/>
            </div>
            <Footer AccounticonColor="#33907C"/>
        </div>
    )
}

export default Account;