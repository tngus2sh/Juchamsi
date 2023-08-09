import React, { useState, useEffect } from "react";
import "./account.css";
import Footer from "./footer";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import Fab from "@mui/material/Fab";
import { useNavigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import http from "../../axios/http";
import { setMileageList, setLogout } from "../../redux/mobileUserinfo";
import { Button, Container, Grid, Typography } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import LocalParkingRoundedIcon from "@mui/icons-material/LocalParkingRounded";

function Account() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginId = useSelector((state) => state.mobileInfo.loginId);
  const name = useSelector((state) => state.mobileInfo.name);
  let totalmileage = useSelector((state) => state.mobileInfo.totalMileage);
  const [MileageOpen, setMileageOpen] = React.useState(false);
  const ID = useSelector((state) => state.mobileInfo.id);
  const imageUrl = useSelector((state) => state.mobileInfo.imageUrl); // 이미지 URL 가져오기

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  // { 'id': 1, 'point': 100, 'type': '적립', 'description': '출금 시간 등록 적립', 'createdDate': 날짜, 'lastModifiedDate': 날짜}
  const alltext = useSelector((state) => state.mobileInfo.mileagelist);

  const carNumber = useSelector((state) => state.mobileInfo.carNumber);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
  }, []);

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

  const handleOpenupdateAccount = () => {
    navigate("/Mobile/Account/Update");
  };

  const handleOpenMileageChange = () => {
    if (totalmileage >= 3000) {
      navigate("/Mobile/Mileage/Change");
    } else {
      alert("3000마일리지 이상 보유시 교환이 가능합니다.");
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
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: viewportWidth * 0.6,
    height: viewportHeight * 0.4,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh", // 최대 높이 설정
    overflowY: "auto", // 스크롤바 추가
  };

  return (
    <React.Fragment>
      <div className="account-main-container">
        <div className="account-header-container" style={{ color: "white" }}>
          <div className="account-padding-container">
            <div className="account-header-info-container" style={{ paddingTop: "1.5rem", textAlign: "left" }}>
              <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                마이 페이지
              </span>
            </div>
            <div className="account-header-content-container" style={{ marginTop: "2.5rem", textAlign: "left" }}>
              <div className="account-header-content-flex-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="account-header-info-container">
                  <div className="account-header-name-container">
                    <span>
                      <span className="bold-text" style={{ fontSize: "1.3rem" }}>
                        {name}
                      </span>
                      &nbsp;님, 환영합니다!
                    </span>
                  </div>
                  <div className="account-header-car-number-container" style={{ marginTop: "1.2rem" }}>
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

            <div onClick={handleOpenMileage} className="account-mileage-history-container" style={{ marginTop: "1.9rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

            <div onClick={handleOpenMileageChange} className="account-mileage-exchange-container" style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

            <div className="account-privacy-detail-container" style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="account-mileage-history-info-container">
                  <span className="bold-text" style={{ fontSize: "1.1rem" }}>
                    개인정보 상세
                  </span>
                </div>
                <div className="account-mileage-history-icon-container">
                  <ArrowForwardIosRoundedIcon sx={{ fontSize: "1.3rem" }} />
                </div>
              </div>
            </div>

            <div onClick={handleOpenupdateAccount} className="account-privacy-update-container" style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

            <div onClick={handleSignoutOpen} className="account-delete-user-container" style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

            <div onClick={handleLoginoutOpen} className="account-logout-container" style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

      <Modal open={MileageOpen} onClose={handleCloseMileage} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style1}>
          <p className="modaltext1">마일리지 이용내역</p>
          <p className={`modaltext2 ${selectedTag === "전체" ? "selected" : ""}`} onClick={() => handleTagClick("전체")}>
            전체
          </p>
          <p className={`modaltext3 ${selectedTag === "적립" ? "selected" : ""}`} onClick={() => handleTagClick("적립")}>
            적립
          </p>
          <p className={`modaltext4 ${selectedTag === "사용" ? "selected" : ""}`} onClick={() => handleTagClick("사용")}>
            사용
          </p>
          {/* 보여질 내용을 상태에 따라 렌더링 */}
          {content.map((item) => (
            <div className="pointtext" key={item.id}>
              <Stack direction="row" sx={{ display: "flex", justifyContent: "space-between" }}>
                <p className="pointtext1">{item.description}</p>
                <p className="pointtext1">{item.point}</p>
              </Stack>
              <br />
              <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
                <p className="pointtext1">{item.createDate}</p>
              </Box>
              <hr />
            </div>
          ))}
        </Box>
      </Modal>

      <Footer AccounticonColor="#006DD1" />
    </React.Fragment>
  );
}

export default Account;
