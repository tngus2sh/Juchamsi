import React, { useState, useEffect } from 'react';
import './parkinglot.css';
import Footer from './footer';
import Box from '@mui/material/Box';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import InCar from '../../components/mobile/incar';
import { Container } from '@mui/material';
import { setWhenEnteringCar } from '../../redux/mobileUserinfo'; 


function Parkinglot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpenMycarPage = () => {
    // 내 주차현황 페이지로 이동
    navigate('/Mobile/Mycar');
  };

  // Redux 상태에서 정보 가져오기
  const BoxItem = useSelector((state) => state.mycar.BoxItem);
  const mycar = useSelector((state) => state.mycar.mycar);
  const Outtime = useSelector((state) => state.mycar.Outtime);
  const Boxrow = useSelector((state) => state.mycar.Boxrow);
  const BoxColumn = useSelector((state) => state.mycar.BoxColumn);


  const open = useSelector((state) => state.mobileInfo.whenEnteringCar);
  const handleOpen = () => dispatch(setWhenEnteringCar(true));
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);


  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const boxWidth = (viewportWidth * 0.7 - (Boxrow * 10)) / Boxrow;
  const boxHeight = (viewportHeight * 0.3 - (BoxColumn * 10)) / BoxColumn;

  // Box 그리드를 생성하는 함수
  const renderBoxGrid = () => {
    const boxes = [];
    for (let i = 0; i < Boxrow; i++) {
      for (let j = 0; j < BoxColumn; j++) {
        const index = i * BoxColumn + j;
        const showIcon = BoxItem[index] === true;
        const MycarIcon = i * BoxColumn + j === mycar;
        boxes.push(
          <button key={`${i}-${j}`} onClick={MycarIcon ? handleOpenMycarPage : null} style={{ border: 'none', backgroundColor: 'transparent', padding: 0 }}>
            <Box key={`${i}-${j}`} sx={{
              width: boxWidth,
              height: boxHeight,
              border: '1px solid',
              marginBottom: '3px',
              marginRight: '10px',
              marginLeft: '10px',
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: MycarIcon ? '#33907C' : 'transparent',
              flexDirection: 'column', // 수직 방향으로 아이콘과 텍스트 정렬
            }}>
              {showIcon && <DriveEtaIcon sx={{ fontSize: 50 }} />}
            </Box>
            <p style={{ color: '#33907C', fontSize: '16px', textAlign: 'center', display: 'inline-block' }}>
              {Outtime[index] && (Outtime[index].length > 10 ? `~${Outtime[index].substring(9, 16)}` : Outtime[index])}
            </p>
          </button>
        );
      }
    }
    return boxes;
  };

  return (
    <React.Fragment>
      <Container sx={{height:"100vh", weight:"100%"}}>
      <Box className='ParkinglotBox' sx={{ width: 250, height: 250, border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '10px'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {renderBoxGrid()}
        </Box>
      <Button sx={{mt:"30px"}} onClick={handleOpen}>입차 하면</Button>
        </Box>
      <InCar open={open} />
        </Container>
      <Footer HomeiconColor="#B7C4CF"/>
    </React.Fragment>
  );
}

export default Parkinglot;