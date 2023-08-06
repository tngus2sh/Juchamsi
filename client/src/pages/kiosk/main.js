import "./main.css";
// import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";

function Home(props) {
  const navigate = useNavigate();

  const handleOpenSavePage = () => {
    // 보관 페이지로 이동
    navigate("/Kiosk/savepage");
  };

  const handleOpenfindPage = () => {
    // 찾기 페이지로 이동
    navigate("/Kiosk/findpage");
  };

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

        {/* <Box component="span" className="kiosk-main-box" onClick={handleOpenSavePage}>
          <p className="kioskmaintext">보관</p>
        </Box>
        <Box component="span" className="kiosk-main-box" onClick={handleOpenfindPage}>
          <p className="kioskmaintext">찾기</p>
        </Box> */}
      </div>
    </div>
  );
}

export default Home;
