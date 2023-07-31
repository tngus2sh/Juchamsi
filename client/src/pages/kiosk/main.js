import './main.css';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';


function Home(props) {
  const navigate = useNavigate();

  const handleOpenSavePage = () => {
    // 보관 페이지로 이동
    navigate('/Kiosk/savepage');
  };

  const handleOpenfindPage = () => {
    // 찾기 페이지로 이동
    navigate('/Kiosk/findpage');
  };

  return (
    <div className="home">
      <img
        className="kiosklogo"
        src={process.env.PUBLIC_URL + '/img/kiosk/예비로고.png'}
        alt={'title'}
      ></img>
      <Container className="centerpage">
        <p>원하시는 항목을 선택해 주세요.</p>
      </Container>

      <Box component="span" className="kioskmainbox1" onClick={handleOpenSavePage}>
        <p className="kioskmaintext">보관</p>
      </Box>
      <Box component="span" className="kioskmainbox2" onClick={handleOpenfindPage}>
        <p className="kioskmaintext">찾기</p>
      </Box>
    </div>
  );
}

export default Home;
