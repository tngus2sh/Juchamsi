import React, { useState, useEffect } from "react";
import "./account.css";
import Footer from "./footer";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import Fab from "@mui/material/Fab";
import { useNavigate } from "react-router-dom";
import DescriptionIcon from "@mui/icons-material/Description";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axiosInstance from "../../axios/axios";
import { Button, Container, Grid, Typography } from "@mui/material";

function Account() {
  const navigate = useNavigate();
  const loginId = useSelector((state) => state.mobileInfo.loginId);
  const name = useSelector((state) => state.mobileInfo.name);
  const totalmileage = useSelector((state) => state.mobileInfo.totalMileage);
  const [MileageOpen, setMileageOpen] = React.useState(false);
  const ID = useSelector((state) => state.mobileInfo.id);
  const imageUrl = useSelector((state) => state.mobileInfo.imageUrl); // 이미지 URL 가져오기

  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

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
    axiosInstance({
      method: "get",
      url: `/mileage/${loginId}`,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    setMileageOpen(true); // 모달 열기
  };
  const handleCloseMileage = () => {
    setMileageOpen(false); // 모달 닫기
  };

  // axios결과 res.data.response 리스트 안에 딕셔너리 형태인듯?
  // { 'id': 1, 'point': 100, 'type': '적립', 'description': '출금 시간 등록 적립', 'createdDate': 날짜, 'lastModifiedDate': 날짜}
  const alltext = [
    {
      id: 1,
      point: 100,
      type: "적립",
      description: "출차 시간 등록 적립",
      createDate: "2023.08.02 09:56",
    },
    { id: 2, point: -100, type: "사용", description: "교환", createDate: "2023.08.03 09:56" },
    {
      id: 3,
      point: 30,
      type: "적립",
      description: "출차 시간 등록 적립",
      createDate: "2023.08.03 19:56",
    },
    {
      id: 4,
      point: 40,
      type: "적립",
      description: "차량 키 보관 적립",
      createDate: "2023.08.03 20:00",
    },
    {
      id: 5,
      point: 30,
      type: "적립",
      description: "출차 시간 준수",
      createDate: "2023.08.04 07:35",
    },
  ];
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
      <Box
        sx={{
          backgroundColor: "gray",
          m: "20px",
          borderRadius: "0.8rem",
          p: "10px",
        }}
      >
        <Grid container sx={{ height: "10vh", alignItems: "center" }}>
          <Stack direction="row" spacing={2} sx={{ ml: "1rem" }}>
            <Avatar alt="Remy Sharp" src={imageUrl} sx={{ width: 50, height: 50 }} />
            <Stack direction="column" sx={{ alignItems: "start" }}>
              <Typography>{loginId}</Typography>
              <Typography className="namestyle">
                {name} <span className="namestyle2">님 환영합니다.</span>
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid container sx={{ justifyContent: "end" }}>
          <Fab
            sx={{ width: "2rem", height: "1.8rem" }}
            aria-label="edit"
            onClick={handleOpenupdateAccount}
          >
            <EditIcon sx={{ width: "1.5rem", height: "1.4rem" }} />
          </Fab>
        </Grid>
      </Box>
      <Box
        sx={{
          backgroundColor: "gray",
          m: "20px",
          borderRadius: "0.8rem",
          p: "10px",
        }}
      >
        <Typography sx={{ fontSize: "1.0rem" }}>현재 마일리지</Typography>
        <Grid container sx={{ height: "7vh" }}>
          <Grid item xs={5}>
            <Stack
              direction="row"
              sx={{ width: "100%", height: "7vh", alignItems: "center", ml: "1rem" }}
            >
              <img
                src={process.env.PUBLIC_URL + "/img/mobile/2.png"}
                className="mileimg"
                alt="moneylogo"
              ></img>
              <Typography sx={{ fontSize: "1.6rem", ml: "1rem" }}>{totalmileage}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={5} />
          <Grid item xs={2}></Grid>
        </Grid>
        <Grid container sx={{ justifyContent: "end" }}>
          <DescriptionIcon sx={{}} onClick={handleOpenMileage} />
        </Grid>
      </Box>
      <Box sx={{ backgroundColor: "gray", m: "20px", borderRadius: "0.8rem", p: "10px" }}>
        <Typography sx={{ fontSize: "1.0rem" }}>마일리지 교환</Typography>
        <Typography sx={{ fontSize: "0.7rem" }}>
          (보유 마일리지 3000이상시 1000포인트 단위 교환가능)
        </Typography>
        <Button
          sx={{
            backgroundColor: "black",
            mt: "1rem",
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.16)",
            borderRadius: "10px",
          }}
          onClick={handleOpenMileageChange}
        >
          <Typography className="mileagebtntext">교환</Typography>
        </Button>
      </Box>
      <Modal
        open={MileageOpen}
        onClose={handleCloseMileage}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style1}>
          <p className="modaltext1">마일리지 이용내역</p>
          <p
            className={`modaltext2 ${selectedTag === "전체" ? "selected" : ""}`}
            onClick={() => handleTagClick("전체")}
          >
            전체
          </p>
          <p
            className={`modaltext3 ${selectedTag === "적립" ? "selected" : ""}`}
            onClick={() => handleTagClick("적립")}
          >
            적립
          </p>
          <p
            className={`modaltext4 ${selectedTag === "사용" ? "selected" : ""}`}
            onClick={() => handleTagClick("사용")}
          >
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
      <Footer AccounticonColor="#B7C4CF" />
    </React.Fragment>
  );
}

export default Account;
