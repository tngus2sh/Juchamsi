import React from 'react';
import './parkinglot.css';
import Footer from './footer';
import Box from '@mui/material/Box';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import { useNavigate } from 'react-router-dom';

function Parkinglot() {
  const navigate = useNavigate();

  const handleOpenMycarPage = () => {
    // 내 주차현황 페이지로 이동
    navigate('/Mobile/Mycar');
  };

  // 주차장 행
  const Boxrow = 3;
  // 주차장 열
  const BoxColumn = 2;
  // 주차장 해당위치 차량 주차여부
  const BoxItem = [true, false, true, false, false, true];
  // 내 차량 주차 위치
  const mycar = 2;
  // 차량별 출차 시간
  const Outtime = ['23.08.01 09:00', '', '23.08.01 08:00', '', '', '23.08.01 07:00'];

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
              width: (200 - (Boxrow * 10)) / Boxrow,
              height: (180 - (BoxColumn * 10)) / BoxColumn,
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
            <p style={{ color: '#33907C', fontSize: '12px', textAlign: 'center', display: 'inline-block' }}>
              {Outtime[index] && (Outtime[index].length > 10 ? `~${Outtime[index].substring(9, 16)}` : Outtime[index])}
            </p>
          </button>
        );
      }
    }
    return boxes;
  };

  return (
    <div>
      <Box className='ParkinglotBox' sx={{ width: 250, height: 250, border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '10px'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {renderBoxGrid()}
        </Box>
      </Box>
      <Footer HomeiconColor="#33907C" />
    </div>
  );
}

export default Parkinglot;