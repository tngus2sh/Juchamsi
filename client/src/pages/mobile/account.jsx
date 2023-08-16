import React, { useEffect } from "react";
import "./account.css";
import Footer from "./footer";
import { useSelector, useDispatch } from "react-redux";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import http from "../../axios/http";
import { setMileageList, setUserLogout } from "../../redux/mobileUserinfo";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import LocalParkingRoundedIcon from "@mui/icons-material/LocalParkingRounded";
import dayjs from "dayjs";
import Alert from "@mui/material/Alert";

function Account() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginId = useSelector((state) => state.mobileInfo.loginId);
  const name = useSelector((state) => state.mobileInfo.name);
  let totalmileage = useSelector((state) => state.mobileInfo.totalMileage);
  const [MileageOpen, setMileageOpen] = React.useState(false);
  // { 'id': 1, 'point': 100, 'type': '적립', 'description': '출금 시간 등록 적립', 'createdDate': 날짜, 'lastModifiedDate': 날짜}
  const alltext = useSelector((state) => state.mobileInfo.mileagelist);

  const carNumber = useSelector((state) => state.mobileInfo.carNumber);
  const [showAlert, setShowAlert] = React.useState(false);

  useEffect(() => {
    if (loginId === "") {
      navigate("/Mobile/Login");
    }
  }, []);

  useEffect(() => {
    http({
      method: "get",
      url: `/mileage/${loginId}`,
    })
      .then((res) => {
        let milelist = [];
        for (let i = 0; i < res.data.response.length; i++) {
          milelist.push(res.data.response[i]);
        }
        dispatch(setMileageList(milelist));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch, loginId]);

  const handleSignoutOpen = () => {
    http({
      method: "delete",
      url: `/tenant/${loginId}`,
    })
      .then(() => {
        navigate("/Mobile/Login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLoginoutOpen = () => {
    http({
      method: "get",
      url: `/tenant/logout/${loginId}`,
    })
      .then(() => {
        dispatch(setUserLogout());
        navigate("/Mobile/Login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOpenupdateAccount = () => {
    navigate("/Mobile/Account/Update");
  };

  const handleOpenMileageChange = () => {
    if (totalmileage >= 3000) {
      navigate("/Mobile/Mileage/Change");
    } else {
      setShowAlert(true); // Alert을 표시
      setTimeout(() => {
        setShowAlert(false); // 2초 후에 Alert을 숨김
      }, 2000);
    }
  };
  const handleOpenMileage = () => {
    handleTagClick("전체");
    setMileageOpen(true); // 모달 열기
  };
  const handleCloseMileage = () => {
    setMileageOpen(false); // 모달 닫기
  };

  // type이 '적립'인 것만 filtering하여 savingtext 배열로 생성
  const savingtext = alltext.filter((item) => item.type === "적립");

  // type이 '사용'인 것만 filtering하여 usetext 배열로 생성
  const usetext = alltext.filter((item) => item.type === "사용");

  const [selectedTag, setSelectedTag] = React.useState("전체");
  const [content, setContent] = React.useState(alltext); // 보여질 내용을 관리하는 상태 추가

  // 선택한 태그에 따라 보여질 내용을 설정하는 함수
  const handleTagClick = (tag) => {
    setSelectedTag(tag);
    // 선택한 태그에 따라 보여질 내용을 설정
    if (tag === "전체") {
      setContent(alltext);
    } else if (tag === "적립") {
      setContent(savingtext);
    } else if (tag === "사용") {
      setContent(usetext);
    }
  };

  const style1 = {
    position: "fixed",
    top: "0",
    left: "0",
    rigiht: "0",
    width: "100%",
    height: "20rem",
    bgcolor: "white",
    borderRadius: "0 0 1rem 1rem",
    boxShadow: 20,
    textAlign: "center",
    overflowY: "auto", // 스크롤바 추가
    outline: "none",
  };

  return (
    <React.Fragment>
      {showAlert && (
        <Alert severity="error" className="signup-alert" sx={{ justifyContent: "center" }}>
          3000 마일리지 이상이어야 교환신청이 가능합니다.
        </Alert>
      )}
      <div className="account-main-container">
        <div className="account-header-container" style={{ color: "white" }}>
          <div className="account-padding-container">
            <div
              className="account-header-info-container"
              style={{ paddingTop: "1.5rem", textAlign: "left" }}
            >
              <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                마이 페이지
              </span>
            </div>
            <div
              className="account-header-content-container"
              style={{ marginTop: "2.5rem", textAlign: "left" }}
            >
              <div
                className="account-header-content-flex-container"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="account-header-info-container">
                  <div className="account-header-name-container">
                    <span>
                      <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                        {name}
                      </span>
                      &nbsp;님, 환영합니다!
                    </span>
                  </div>
                  <div
                    className="account-header-car-number-container"
                    style={{ marginTop: "1.2rem" }}
                  >
                    <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                      {carNumber}
                    </span>
                  </div>
                </div>
                <div className="account-header-icon-container">
                  <div className="account-header-icon-box-container">
                    <div className="account-header-icon-box-flex-container">
                      <LocalParkingRoundedIcon sx={{ fontSize: "2.5rem" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="account-mileage-container" style={{ marginTop: "2.5rem" }}>
          <div className="account-padding-container">
            <div className="account-mileage-title-container" style={{ color: "#006DD1" }}>
              <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                마일리지
              </span>
            </div>

            <div className="account-mileage-total-container" style={{ marginTop: "2rem" }}>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="account-mileage-total-info-container">
                  <span className="bold-text" style={{ fontSize: "1.1rem" }}>
                    총 마일리지
                  </span>
                </div>
                <div className="account-mileage-total-number-container">
                  <div className="bold-text" style={{ fontSize: "2rem", paddingRight: "1rem" }}>
                    <span style={{ color: "#EE1D4F" }}>{totalmileage}</span>
                    <span>&nbsp;P</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              onClick={handleOpenMileage}
              className="account-mileage-history-container"
              style={{ marginTop: "1.9rem" }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="account-mileage-history-info-container">
                  <span className="bold-text" style={{ fontSize: "1.1rem" }}>
                    마일리지 내역
                  </span>
                </div>
                <div className="account-mileage-history-icon-container">
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1.3rem" }} />
                </div>
              </div>
            </div>

            <div
              onClick={handleOpenMileageChange}
              className="account-mileage-exchange-container"
              style={{ marginTop: "1.5rem" }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="account-mileage-history-info-container">
                  <span className="bold-text" style={{ fontSize: "1.1rem" }}>
                    마일리지 교환
                  </span>
                </div>
                <div className="account-mileage-history-icon-container">
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1.3rem" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="account-privacy-container" style={{ marginTop: "2.5rem" }}>
          <div className="account-padding-container">
            <div className="account-privacy-title-container" style={{ color: "#006DD1" }}>
              <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                개인정보
              </span>
            </div>

            <div
              onClick={handleOpenupdateAccount}
              className="account-privacy-update-container"
              style={{ marginTop: "1.5rem" }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="account-mileage-history-info-container">
                  <span className="bold-text" style={{ fontSize: "1.1rem" }}>
                    개인정보 수정
                  </span>
                </div>
                <div className="account-mileage-history-icon-container">
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1.3rem" }} />
                </div>
              </div>
            </div>

            <div
              onClick={handleSignoutOpen}
              className="account-delete-user-container"
              style={{ marginTop: "1.5rem" }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="account-mileage-history-info-container">
                  <span className="bold-text" style={{ fontSize: "1.1rem" }}>
                    회원 탈퇴
                  </span>
                </div>
                <div className="account-mileage-history-icon-container">
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1.3rem" }} />
                </div>
              </div>
            </div>

            <div
              onClick={handleLoginoutOpen}
              className="account-logout-container"
              style={{ marginTop: "1.5rem" }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div className="account-mileage-history-info-container">
                  <span className="bold-text" style={{ fontSize: "1.1rem" }}>
                    로그아웃
                  </span>
                </div>
                <div className="account-mileage-history-icon-container">
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1.3rem" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="empty-container" style={{ display: "inline-block", height: "7rem" }}></div>
      </div>
      <Modal
        open={MileageOpen}
        onClose={handleCloseMileage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style1}>
          <div
            className="modal-flex-container"
            style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}
          >
            <div className="modal-title-container" style={{ marginTop: "2rem" }}>
              <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                마일리지 내역
              </span>
            </div>
            <div className="modal-content-container" style={{ flex: "1" }}>
              <div
                className="modal-content-flex-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div className="modal-content-input-container" style={{ width: "70%" }}>
                  <div style={{ display: "flex", position: "absolute", top: "5rem", width: "80%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "90%" }}>
                      <p
                        className={`modaltext2 ${selectedTag === "전체" ? "selected" : ""}`}
                        onClick={() => handleTagClick("전체")}
                      >
                        전체
                      </p>
                      <p
                        className={`modaltext2 ${selectedTag === "적립" ? "selected" : ""}`}
                        onClick={() => handleTagClick("적립")}
                      >
                        적립
                      </p>
                      <p
                        className={`modaltext2 ${selectedTag === "사용" ? "selected" : ""}`}
                        onClick={() => handleTagClick("사용")}
                      >
                        사용
                      </p>
                    </div>
                  </div>
                  {/* 보여질 내용을 상태에 따라 렌더링 */}
                  <div style={{ marginTop: "5rem" }} />
                  {content.map((item) => (
                    <div className="pointtext" key={item.id} style={{ marginTop: "2rem" }}>
                      <Stack
                        direction="row"
                        sx={{ display: "flex", justifyContent: "space-between" }}
                      >
                        <p className="pointtext1">{item.description}</p>
                        <p className="pointtext1">{item.point}</p>
                      </Stack>
                      <br />
                      <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
                        <p className="pointtext1">
                          {dayjs(item.createDate).format("YY.MM.DD HH:mm")}
                        </p>
                      </Box>
                      <hr />
                    </div>
                  ))}
                  <button
                    className="login-box"
                    onClick={handleCloseMileage}
                    style={{
                      marginTop: "1.7rem",
                      backgroundColor: "#006DD1",
                      color: "white",
                      marginBottom: "1rem",
                    }}
                  >
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
