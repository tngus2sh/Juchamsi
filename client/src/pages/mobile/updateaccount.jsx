import React, { useState, useRef } from "react";
import "./updateaccount.css";
import Footer from "./footer";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useNavigate } from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { setCarNumber, setphoneNumber, setVillaNumber, setImageUrl, setLogout } from "../../redux/mobileUserinfo";
import { Grid } from "@mui/material";
import Button from "@mui/material/Button";
import UpdateModal from "../../components/mobile/updateModal";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import http from "../../axios/http";

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
  const fileInput = useRef(null);
  const imageUrl = useSelector((state) => state.mobileInfo.imageUrl); // 이미지 URL 가져오기

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const style3 = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    height: "10rem",
    bgcolor: "white",
    border: "1px solid c5c5c5",
    borderRadius: "0.4rem",
    boxShadow: 24,
    padding: "2rem",
    textAlign: "center",
    // maxHeight: "50vh", // 최대 높이 설정
    overflowY: "auto", // 스크롤바 추가
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

  const editnoteclick5 = () => {
    console.log("editnoteclick5");
  };

  const handleopenmypage = () => {
    navigate("/Mobile/Account");
  };

  const handleLoginoutOpen = () => {
    http({
      method: "get",
      url: `/tenant/logout/${loginId}`,
    })
      .then(() => {
        dispatch(setLogout());
        navigate("/Mobile/Login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSignoutOpen = () => {
    http({
      method: "delete",
      url: `/tenant/${loginId}`,
    })
      .then((res) => {
        navigate("/Mobile/Login");
      })
      .catch((err) => {
        console.log(err);
      });
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target.result;
        dispatch(setImageUrl(imageUrl)); // 이미지 URL을 Redux 상태에 저장
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          width: "100%",
          height: "3.3rem",
          backgroundColor: "#112D4E",
          position: "fixed",
          top: 0,
        }}
      >
        <Grid container sx={{ justifyContent: "center", height: "3.3rem", alignContent: "center" }}>
          <KeyboardBackspaceIcon
            sx={{
              position: "fixed",
              left: 0,
              color: "white",
              width: "2.1rem",
              height: "2.8rem",
              ml: ".5rem",
              mt: ".2rem",
            }}
            onClick={handleopenmypage}
          />
          <Typography className="main-info-text" sx={{ fontWeight: "bold" }}>
            회원 정보 수정
          </Typography>
        </Grid>
      </Box>

      <div className="user-profile-container">
        <div className="user-img-container">
          <Avatar
            alt="Remy Sharp"
            src={imageUrl}
            sx={{ width: "5rem", height: "5rem" }}
            onClick={() => fileInput.current.click()} // 파일 입력(input) 요소를 클릭하도록 설정
          />
        </div>
        <div className="user-text-container">
          <Typography>{loginId}</Typography>
          <Typography style={{ fontSize: "0.95rem" }}>{name}</Typography>
        </div>
      </div>

      <div className="user-update-container">
        <div className="update-header-container">
          <p>회원 정보</p>
        </div>

        <div className="update-text-container">
          <div className="update-pw-container" onClick={editnoteclick1}>
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <p>비밀번호</p>
              </Grid>
              <Grid item xs={7}>
                <p>{pw}</p>
              </Grid>
              <Grid item xs={1}>
                <EditNoteIcon />
              </Grid>
            </Grid>
          </div>

          <div className="update-phone-number-container" onClick={handleOpenupdatephonenumber}>
            <Grid id container spacing={1}>
              <Grid item xs={4}>
                <p>핸드폰 번호</p>
              </Grid>
              <Grid item xs={7}>
                <p>{phoneNumber}</p>
              </Grid>
              <Grid item xs={1}>
                <EditNoteIcon />
              </Grid>
            </Grid>
          </div>

          <div className="update-car-number-container" onClick={editnoteclick3}>
            <Grid id container spacing={1}>
              <Grid item xs={4}>
                <p>차량 번호</p>
              </Grid>
              <Grid item xs={7}>
                <p>{carNumber}</p>
              </Grid>
              <Grid item xs={1}>
                <EditNoteIcon />
              </Grid>
            </Grid>
          </div>

          <div className="update-villa-number-container" onClick={editnoteclick4}>
            <Grid id container spacing={1}>
              <Grid item xs={4}>
                <p>호수</p>
              </Grid>
              <Grid item xs={7}>
                <p>{villarnumber}호</p>
              </Grid>
              <Grid item xs={1}>
                <EditNoteIcon />
              </Grid>
            </Grid>
          </div>

          <div className="update-easy-pw-container" onClick={editnoteclick5}>
            <Grid id container spacing={1}>
              <Grid item xs={4}>
                <p>간편 비밀번호</p>
              </Grid>
              <Grid item xs={7}>
                <p>******</p>
              </Grid>
              <Grid item xs={1}>
                <EditNoteIcon />
              </Grid>
            </Grid>
          </div>
        </div>
      </div>

      {/* <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInput} onChange={handleImageChange} /> */}

      {/* <Box component="span" className="Loginoutbtn" onClick={handleLoginoutOpen}>
        <p className="Loginoutbtntext">로그아웃</p>
      </Box>

      <Box component="span" className="Signoutbtn" onClick={handleSignoutOpen}>
        <p className="Signoutbtntext">회원탈퇴</p>
      </Box> */}

      {/* 핸드폰 인증 */}
      <UpdateModal
        open={updatephonenumber}
        onClose={handleCloseupdatephonenumber}
        style={style3}
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
        name="phonenumber"
        label="인증 번호"
        value={phonechecknumber}
        onChange={handlephonechecknumberChange}
        onClick={handlePhoneModalConfirmClick}
      />

      {/* 핸드폰 인증 성공 */}
      <Modal open={phoneModalTrueOpen} onClose={handleClosePhoneTrueCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style3}>
          <div className="modal-flex-container" style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <div className="modal-content-container">
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: "center" }}>
                인증 성공
              </Typography>
              <Typography id="modal-modal-description" sx={{ marginTop: "0.8rem", fontSize: "0.9rem" }}>
                인증을 성공했습니다
                <br />
                관리자 승인을 기다려 주세요
              </Typography>
              <button className="login-box" onClick={handleChangPhonnumberResult} style={{ marginTop: "1rem", backgroundColor: "#2d4356", color: "white" }}>
                확인
              </button>
            </div>
          </div>

          {/* <Box component="span" className="Checkidresult2" onClick={handleChangPhonnumberResult}>
            <p className="Checkidresult1text">확인</p>
          </Box> */}
        </Box>
      </Modal>

      {/* 핸드폰 인증 실패 */}
      <Modal open={phoneModalFalseOpen} onClose={handleClosePhoneFalseCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style3}>
          <div className="modal-flex-container" style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <div className="modal-content-container">
              <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: "center" }}>
                인증 실패
              </Typography>
              <Typography id="modal-modal-description" sx={{ marginTop: "0.8rem", fontSize: "0.9rem" }}>
                인증을 실패했습니다
                <br />
                바른 인증 번호를 입력해 주세요
              </Typography>
              <button className="login-box" onClick={handleClosePhoneFalseCheck} style={{ marginTop: "1rem", backgroundColor: "#2d4356", color: "white" }}>
                확인
              </button>
            </div>
          </div>

          {/* <Box component="span" className="Checkidresult2" onClick={handleClosePhoneFalseCheck}>
            <p className="Checkidresult1text">확인</p>
          </Box> */}
        </Box>
      </Modal>

      <UpdateModal
        open={updatecarnumberModal}
        onClose={handlecloseupdatecarnumber}
        style={style3}
        label="자동차 번호"
        name="newcarnumber"
        value={newcarnumber}
        onChange={handleCarNumberChange}
        onClick={handleChangeCarResult}
      />
      <Modal open={newcarResult} onClose={handleCloseCarTrueCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style3}>
          <div className="modal-flex-container" style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <div className="modal-content-container">
              <Typography id="modal-modal-description">
                요청을 처리하였습니다
                <br />
                관리자 승인을 기다려 주세요
              </Typography>
              <button className="login-box" onClick={handleChangCarnumberResult} style={{ marginTop: "1rem", backgroundColor: "#2d4356", color: "white" }}>
                확인
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      <UpdateModal
        open={updatehousenumberModal}
        onClose={handlecloseupdatehousenumber}
        style={style3}
        label="호수"
        name="newhousenumber"
        value={newhousenumber}
        onChange={handleHouseNumberChange}
        onClick={handleChangeHouseResult}
      />
      <Modal open={newhouseResult} onClose={handleCloseHouseTrueCheck} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style3}>
          <div className="modal-flex-container" style={{ display: "flex", width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <div className="modal-content-container">
              <Typography id="modal-modal-description">
                요청을 처리하였습니다
                <br />
                관리자 승인을 기다려 주세요
              </Typography>
              <button className="login-box" onClick={handleChangHousenumberResult} style={{ marginTop: "1rem", backgroundColor: "#2d4356", color: "white" }}>
                확인
              </button>
            </div>
          </div>
        </Box>
      </Modal>

      <Footer AccounticonColor="#006DD1" />
    </React.Fragment>
  );
}

export default Account;
