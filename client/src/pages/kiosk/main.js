import "./main.css";
import React, { useEffect, useState } from "react";
// import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import { PropaneSharp } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setKioskVillaId } from '../../redux/kioskInfo';

function Home(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const openInitialState = useSelector((state) => state.kioskInfo.kioskVillaId) === "";
  const [open, setOpen] = useState(openInitialState);
  const [villaId, setVillaId] = React.useState("");

  const handleOpenSavePage = () => {
    // 보관 페이지로 이동
    navigate("/Kiosk/savepage");
  };

  const handleOpenfindPage = () => {
    // 찾기 페이지로 이동
    navigate("/Kiosk/findpage");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "20rem",
    height: "12rem",
    bgcolor: "white",
    border: "1px solid c5c5c5",
    borderRadius: "0.4rem",
    boxShadow: 24,
    padding: "2rem",
    textAlign: "center",
  };

  const handleVillaId = (e) => {
    setVillaId(e.target.value);
  }

  const submitVillaId = () => {
    // 빌라번호가 등록되어있는지 확인 후
    // redux에 담음!

    dispatch(setKioskVillaId(villaId));
    setOpen(false);
  }

  return (
    <div className="home">
      <div className="logo-container">
        <img className="kiosklogo" src={process.env.PUBLIC_URL + "/img/kiosk/logo.png"} alt={"title"}></img>
      </div>

      <Container className="centerpage">
        <p>원하시는 항목을 선택해 주세요.</p>
      </Container>

      <div className="button-container">
        <div className="kiosk-main-box" onClick={handleOpenSavePage}>
          <p className="kiosk-main-text">보관</p>
        </div>
        <div className="kiosk-main-box" onClick={handleOpenfindPage}>
          <p className="kiosk-main-text">찾기</p>
        </div>
      </div>
      <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography variant="h5">빌라 식별 번호를 입력하세요.</Typography>
          <TextField
            required
            id="outlined-required"
            sx={{ mt: "1.4rem" }}
            size="small"
            onChange={handleVillaId}
            
          />
          <Box sx={{mt:"1rem"}}>
            <Button sx={{
              backgroundColor: "#112d4e",
              p: ".8rem",
              '&:hover': { backgroundColor: "#0f2743" },
              mt: "1.4rem"
            }}
            onClick={submitVillaId}><Typography sx={{ color: "white" }}>등록하고 시작</Typography></Button>
          </Box>
      </Box>
    </Modal>
    </div>
    
    
  );
}

export default Home;
