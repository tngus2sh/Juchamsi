import React, { useState, useEffect } from "react";
import "./updateaccount.css";
import Footer from "./footer";
import { useSelector, useDispatch } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { setCarNumber, setphoneNumber, setVillaNumber } from "../../redux/mobileUserinfo";
import UpdateModal from "../../components/mobile/updateModal";
import http from "../../axios/http";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Account() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const carNumber = useSelector((state) => state.mobileInfo.carNumber);
  const loginId = useSelector((state) => state.mobileInfo.loginId);
  const name = useSelector((state) => state.mobileInfo.name);
  const phoneNumber = useSelector((state) => state.mobileInfo.phoneNumber);
  const password = useSelector((state) => state.auth.password).length;
  const pw = "*".repeat(password);
  const villarnumber = useSelector((state) => state.mobileInfo.villaNumber);
  const villaidnumber = useSelector((state) => state.mobileInfo.villaIdNumber);
  const [updatephonenumber, setupdatephonenumber] = React.useState(false);
  const [updatecarnumberModal, setupdatecarnumberModal] = React.useState(false);
  const [updatehousenumberModal, setupdatehousenumberModal] = React.useState(false);
  const [updatephonenumberupdate, setupdatephonenumberupdate] = React.useState(false);
  const [phonenumber, setPhoneNumber] = React.useState("");
  const [newcarnumber, setnewcarnumber] = React.useState("");
  const [newhousenumber, setnewhousenumber] = React.useState("");
  const [phonechecknumber, setphonechecknumber] = useState("");
  const [phoneCheckingNumber, setPhoneCheckingNumber] = useState(null);
  const [phoneModalTrueOpen, setPhoneModalTrueOpen] = React.useState(false);
  const [phoneModalFalseOpen, setPhoneModalFalseOpen] = React.useState(false);
  const handleOpenPhoneTrueCheck = () => setPhoneModalTrueOpen(true);
  const handleOpenPhoneFalseCheck = () => setPhoneModalFalseOpen(true);
  const handleClosePhoneTrueCheck = () => setPhoneModalTrueOpen(false);
  const [newcarResult, setnewResult] = React.useState(false);
  const [newhouseResult, setnewhouseResult] = React.useState(false);
  const logincheck = useSelector((state) => state.auth.isAutoLoginChecked)

  useEffect(() => {
      if (logincheck !== true) {
          navigate('/Mobile/Login')
        }
      })

  const style3 = {
    position: "fixed",
    top: "0",
    left: "0",
    rigiht: "0",
    width: "100%",
    height: "18rem",
    bgcolor: "white",
    borderRadius: "0 0 1rem 1rem",
    boxShadow: 20,
    textAlign: "center",
    overflowY: "auto", // 스크롤바 추가
    outline: "none",
  };

  const editnoteclick1 = () => {
    navigate("/Mobile/Acoount/Update/PasswordChange");
  };

  const editnoteclick3 = () => {
    setupdatecarnumberModal(true); // 모달 열기
  };

  const handlecloseupdatecarnumber = () => {
    setupdatecarnumberModal(false); // 모달 닫기
  };

  const editnoteclick4 = () => {
    setupdatehousenumberModal(true); // 모달 열기
  };

  const handlecloseupdatehousenumber = () => {
    setupdatehousenumberModal(false); // 모달 닫기
  };

  const handleCloseCarTrueCheck = () => {
    setnewResult(false); // 모달 닫기
  };

  const handleCloseHouseTrueCheck = () => {
    setnewhouseResult(false); // 모달 닫기
  };

  const handleopenmypage = () => {
    navigate("/Mobile/Account");
  };

  const handleOpenupdatephonenumber = () => {
    setupdatephonenumber(true); // 모달 열기
  };
  const handleCloseupdatephonenumber = () => {
    setupdatephonenumber(false); // 모달 닫기
  };

  const handleOpenupdatephonenumberupdate = () => {
    setupdatephonenumberupdate(true); // 모달 열기
    http({
      method: "post",
      url: "/sms/check",
      data: {
        name: name,
        to: phonenumber,
      },
    })
      .then((res) => {
        setPhoneCheckingNumber(res.data.response);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleCloseupdatephonenumberupdate = () => {
    setupdatephonenumberupdate(false); // 모달 닫기
  };

  // 핸드폰 번호 입력값이 변경될 때 호출되는 이벤트 핸들러
  const handlePhoneNumberChange = (e) => {
    // 숫자만 입력 가능하도록 정규식을 이용하여 유효성 검사
    const onlyNumbers = e.target.value.replace(/[^\d]/g, "");

    // 최대 11자까지만 입력 가능하도록 제한
    const maxLength = 11;
    const truncatedValue = onlyNumbers.slice(0, maxLength);

    setPhoneNumber(truncatedValue);
  };

  // 자동차번호 입력값이 변경될 때 호출되는 이벤트 핸들러
  const handleCarNumberChange = (e) => {
    // 숫자,한글만 입력가능하도록 규칙 설정
    const onlyCarnumber = e.target.value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣/0-9/ ]/g, "");

    // 최대 9자까지만 입력 가능하도록 제한
    const carnumbermaxLength = 9;
    const checkCarnumber = onlyCarnumber.slice(0, carnumbermaxLength);

    setnewcarnumber(checkCarnumber);
  };

  // 호수 입력값이 변경될 때 호출되는 이벤트 핸들러
  const handleHouseNumberChange = (e) => {
    // 숫자,한글만 입력가능하도록 규칙 설정
    const onlyHousenumber = e.target.value.replace(/[^\d]/g, "");

    // 최대 9자까지만 입력 가능하도록 제한
    const housenumbermaxLength = 3;
    const checkHousenumber = onlyHousenumber.slice(0, housenumbermaxLength);

    setnewhousenumber(checkHousenumber);
  };

  const handleChangePhoneCheck = () => {
    if (phonenumber.trim() !== "") {
      handleCloseupdatephonenumber();
      handleOpenupdatephonenumberupdate();
    }
  };

  const handleOpenupdatecarnumber = () => {
    setnewResult(true);
  };
  const handleOpenupdateHousenumber = () => {
    setnewhouseResult(true);
  };

  const handleChangeCarResult = () => {
    if (newcarnumber.trim() !== "") {
      handlecloseupdatecarnumber();
      handleOpenupdatecarnumber();
    }
  };

  const handleChangeHouseResult = () => {
    if (newhousenumber.trim() !== "") {
      handlecloseupdatehousenumber();
      handleOpenupdateHousenumber();
    }
  };

  // 비밀번호 인증번호가 변경될 때 호출되는 이벤트 핸들러
  const handlephonechecknumberChange = (e) => {
    // 숫자 입력가능하도록 규칙 설정
    const onlyphonechecknumber = e.target.value.replace(/[^0-9/ ]/g, "");

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
      handleCloseupdatephonenumberupdate();
      handleOpenPhoneTrueCheck(); // 첫 번째 모달 (성공 모달)을 엽니다.
    } else {
      // 인증이 실패한 경우
      // 기존모달 종료
      handleCloseupdatephonenumberupdate();
      handleOpenPhoneFalseCheck(); // 첫 번째 모달 (실패 모달)을 엽니다.
    }
  };

  // 핸드폰 인증 실패 모달 닫기 이벤트 핸들러
  const handleClosePhoneFalseCheck = () => {
    setPhoneModalFalseOpen(false);
    setphonechecknumber(""); // 핸드폰 인증번호를 초기화
    setupdatephonenumberupdate(true); // 인증번호 입력모달창으로
  };

  const handleChangPhonnumberResult = () => {
    // 핸드폰 번호 정보변경요청
    http({
      method: "put",
      url: "/tenant",
      data: {
        carNumber: carNumber,
        loginId: loginId,
        loginPassword: password,
        name: name,
        phoneNumber: phonenumber,
        villaIdNumber: villaidnumber,
        villaNumber: villarnumber,
      },
    })
      .then((res) => {
        if (res.data.success === true) {
          dispatch(setphoneNumber(phonenumber));
          navigate("/Mobile/Login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangCarnumberResult = () => {
    // 자동차 번호 정보변경요청
    http({
      method: "put",
      url: "/tenant",
      data: {
        carNumber: newcarnumber,
        loginId: loginId,
        loginPassword: password,
        name: name,
        phoneNumber: phoneNumber,
        villaIdNumber: villaidnumber,
        villaNumber: villarnumber,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.data.success === true) {
          dispatch(setCarNumber(newcarnumber));
          navigate("/Mobile/Login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangHousenumberResult = () => {
    // 호수 번호 정보변경요청
    http({
      method: "put",
      url: "/tenant",
      data: {
        carNumber: carNumber,
        loginId: loginId,
        loginPassword: password,
        name: name,
        phoneNumber: phoneNumber,
        villaIdNumber: villaidnumber,
        villaNumber: newhousenumber,
      },
    })
      .then((res) => {
        if (res.data.success === true) {
          dispatch(setVillaNumber(carNumber));
          navigate("/Mobile/Login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <div className="update-account-main-container">
        <div className="update-account-header-container" style={{ color: "white" }}>
          <div className="account-padding-container">
            <div className="update-account-warning-container" style={{ textAlign: "center", paddingTop: "1.5rem" }}>
              <span className="bold-text" style={{ fontSize: "1.3rem", marginRight:'11rem' }} onClick={handleopenmypage}>
                <ArrowBackIcon/>
              </span>
              <span className="bold-text" style={{ fontSize: "1.3rem", marginLeft:'-3rem' }}>
                정보 수정
              </span>
            </div>
            <div className="update-account-title-container" style={{ marginTop: "1.5rem", textAlign: "right" }}>
              <span style={{ fontSize: "0.7rem" }}>※ 수정시 관리자 승인 후 서비스 이용이 가능합니다</span>
            </div>
          </div>
        </div>

        <div className="update-account-input-container" style={{ marginTop: "2.5rem" }}>
          <div className="account-padding-container">
            <div className="update-account-name-container">
              <div className="update-account-flex-container">
                <div className="update-account-info-container">
                  <span className="bold-text">이름</span>
                </div>
                <div className="update-account-content-container">
                  <span>{name}</span>
                </div>
              </div>
            </div>

            <div className="update-account-id-container input-container">
              <div className="update-account-flex-container">
                <div className="update-account-info-container">
                  <span className="bold-text">아이디</span>
                </div>
                <div className="update-account-content-container">
                  <span>{loginId}</span>
                </div>
              </div>
            </div>

            <div onClick={editnoteclick1} className="update-account-pw-container input-container">
              <div className="update-account-flex-container">
                <div className="update-account-info-container">
                  <span className="bold-text">비밀번호</span>
                </div>
                <div className="update-account-content-container">
                  <span>{pw}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1rem" }} />
                </div>
              </div>
            </div>

            <div onClick={handleOpenupdatephonenumber} className="update-account-phone-number-container input-container">
              <div className="update-account-flex-container">
                <div className="update-account-info-container">
                  <span className="bold-text">핸드폰 번호</span>
                </div>
                <div className="update-account-content-container">
                  <span>{phoneNumber.substr(0, 3) + "-" + phoneNumber.substr(3, 4) + "-" + phoneNumber.substr(7)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1rem" }} />
                </div>
              </div>
            </div>

            <div onClick={editnoteclick3} className="update-account-car-number-container input-container">
              <div className="update-account-flex-container">
                <div className="update-account-info-container">
                  <span className="bold-text">차량 번호</span>
                </div>
                <div className="update-account-content-container">
                  <span>{carNumber}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1rem" }} />
                </div>
              </div>
            </div>

            <div onClick={editnoteclick4} className="update-account-villa-number-container input-container">
              <div className="update-account-flex-container">
                <div className="update-account-info-container">
                  <span className="bold-text">빌라 호수</span>
                </div>
                <div className="update-account-content-container">
                  <span>{villarnumber}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1rem" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 핸드폰 인증 */}
      <UpdateModal
        open={updatephonenumber}
        onClose={handleCloseupdatephonenumber}
        style={style3}
        title="핸드폰 번호 변경"
        name="phonenumber"
        label="핸드폰 번호"
        value={phonenumber}
        onChange={handlePhoneNumberChange}
        onClick={handleChangePhoneCheck}
      />

      {/* 인증 번호 입력 */}
      <UpdateModal
        open={updatephonenumberupdate}
        onClose={handleCloseupdatephonenumberupdate}
        style={style3}
        title="인증 번호"
        name="phonenumber"
        label="인증 번호"
        value={phonechecknumber}
        onChange={handlephonechecknumberChange}
        onClick={handlePhoneModalConfirmClick}
      />

      {/* 핸드폰 인증 성공 */}
      <Modal open={phoneModalTrueOpen} onClose={handleClosePhoneTrueCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style3}>
          <div className="modal-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            <div className="modal-title-container" style={{ marginTop: "2rem" }}>
              <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                인증 성공
              </span>
            </div>

            <div className="modal-content-container" style={{ flex: "1" }}>
              <div className="modal-content-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <div className="model-content-info-container" style={{ width: "70%" }}>
                  <div style={{ fontSize: "1.1rem" }}>
                    인증을 성공했습니다
                    <br />
                    관리자 승인을 기다려 주세요
                  </div>
                  <button className="login-box" onClick={handleChangPhonnumberResult} style={{ marginTop: "1.7rem", backgroundColor: "#006DD1", color: "white" }}>
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      {/* 핸드폰 인증 실패 */}
      <Modal open={phoneModalFalseOpen} onClose={handleClosePhoneFalseCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style3}>
          <div className="modal-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            <div className="modal-title-container" style={{ marginTop: "2rem" }}>
              <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                인증 실패
              </span>
            </div>

            <div className="modal-content-container" style={{ flex: "1" }}>
              <div className="modal-content-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <div className="model-content-info-container" style={{ width: "70%" }}>
                  <div style={{ fontSize: "1.1rem" }}>
                    인증을 실패했습니다
                    <br />
                    바른 인증 번호를 입력해 주세요
                  </div>
                  <button className="login-box" onClick={handleClosePhoneFalseCheck} style={{ marginTop: "1.7rem", backgroundColor: "#006DD1", color: "white" }}>
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <UpdateModal
        open={updatecarnumberModal}
        onClose={handlecloseupdatecarnumber}
        style={style3}
        title="차량 번호 변경"
        label="차량 번호"
        name="newcarnumber"
        value={newcarnumber}
        onChange={handleCarNumberChange}
        onClick={handleChangeCarResult}
      />
      <Modal open={newcarResult} onClose={handleCloseCarTrueCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style3}>
          <div className="modal-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            <div className="modal-title-container" style={{ marginTop: "2rem" }}>
              <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                수정 요청
              </span>
            </div>

            <div className="modal-content-container" style={{ flex: "1" }}>
              <div className="modal-content-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <div className="model-content-info-container" style={{ width: "70%" }}>
                  <div style={{ fontSize: "1.1rem" }}>
                    요청을 처리하였습니다
                    <br />
                    관리자 승인을 기다려 주세요
                  </div>
                  <button className="login-box" onClick={handleChangCarnumberResult} style={{ marginTop: "2rem", backgroundColor: "#006DD1", color: "white" }}>
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <UpdateModal
        open={updatehousenumberModal}
        onClose={handlecloseupdatehousenumber}
        style={style3}
        title="빌라 호수 변경"
        label="호수"
        name="newhousenumber"
        value={newhousenumber}
        onChange={handleHouseNumberChange}
        onClick={handleChangeHouseResult}
      />
      <Modal open={newhouseResult} onClose={handleCloseHouseTrueCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style3}>
          <div className="modal-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
            <div className="modal-title-container" style={{ marginTop: "2rem" }}>
              <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                수정 요청
              </span>
            </div>

            <div className="modal-content-container" style={{ flex: "1" }}>
              <div className="modal-content-flex-container" style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <div className="model-content-info-container" style={{ width: "70%" }}>
                  <div style={{ fontSize: "1.1rem" }}>
                    요청을 처리하였습니다
                    <br />
                    관리자 승인을 기다려 주세요
                  </div>
                  <button className="login-box" onClick={handleChangHousenumberResult} style={{ marginTop: "2rem", backgroundColor: "#006DD1", color: "white" }}>
                    확인
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Modal>

      <Footer AccounticonColor="#006DD1" />
    </React.Fragment>
  );
}

export default Account;
