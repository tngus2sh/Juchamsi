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
import http from "../../axios/http";
import { setBoxItem, setOuttime, setmycar, setParkingnow } from '../../redux/mobileparking'; 


function Parkinglot() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOpen = () => dispatch(setWhenEnteringCar(true));

  const handleOpenMycarPage = () => {
    // 내 주차현황 페이지로 이동
    navigate('/Mobile/Mycar');
  };

  const userid = useSelector((state) => state.mobileInfo.loginId)

  const villanumber = useSelector((state) => state.mobileInfo.villaIdNumber);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 내 주차현황 입력여부 확인
        http({
          method:'get',
          url:`/parking/entrance/${userid}`
        })
        .then((res) => {
          if (res.data.response !== null) {
            if (res.data.response.parkingNowFlag === 'TRUE') {
              dispatch(setmycar(res.data.response.seatNumber))
              handleOpen()
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })

        // 주차현황 가지고오기
        http({
          method:'get',
          url:`/parking/lot/${villanumber}`
        })
        .then((res) => {
          let resultbox = []
            for (let i=0; i<res.data.response.length; i++) {
              if (res.data.response[i].active === 'ACTIVE') {
                resultbox.push(res.data.response[i])
                if (res.data.response[i].userId === userid) {
                  dispatch(setmycar(res.data.response[i].seatNumber))
                }
                }
              }
            dispatch(setBoxItem(resultbox))
          })
        .catch((err) => {
          console.log(err)
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // fetchData 함수를 호출하여 데이터를 받아옴
    fetchData();
  }, [villanumber]); // 빈 배열을 넣어서 페이지 로드 시에만 useEffect 내부 코드가 실행되도록 설정

  // Redux 상태에서 정보 가져오기
  const BoxItem = useSelector((state) => state.mycar.BoxItem);
  const mycar = useSelector((state) => state.mycar.mycar);
  const Boxrow = useSelector((state) => state.mycar.Boxrow);
  const BoxColumn = useSelector((state) => state.mycar.BoxColumn);
  const allbox = Boxrow * BoxColumn
  const Outtime = () => {
    let timelist = [];
    for (let j = 0; j < allbox; j++) {
      timelist.push('');
    }
    for (let k = 0; k < BoxItem.length; k++) {
      timelist[BoxItem[k].seatNumber] = BoxItem[k].outTime;
    }
    return timelist;
  }
  
  const outTimeArray = Outtime(); // Outtime 함수를 호출하여 반환된 배열을 저장


  const open = useSelector((state) => state.mobileInfo.whenEnteringCar);

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


  const boxWidth = (viewportWidth * 0.6 - (Boxrow * 10)) / Boxrow;
  const boxHeight = (viewportHeight * 0.3 - (BoxColumn * 10)) / BoxColumn;

  // Box 그리드를 생성하는 함수
  const renderBoxGrid = () => {
    const boxes = [];
    for (let i = 0; i < Boxrow; i++) {
      for (let j = 0; j < BoxColumn; j++) {
        const index = i * BoxColumn + j;
        const showIcon = outTimeArray[index] !== '';
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
              {outTimeArray[index] && (outTimeArray[index].length > 10 ? `~${outTimeArray[index].substring(11, 16)}` : outTimeArray[index])}
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
      <Box className='ParkinglotBox' sx={{ width: viewportWidth*0.8, height: viewportHeight*0.5, border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '10px'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width:viewportWidth*0.8, height:viewportHeight*0.5, justifyContent:'center'}}>
          {renderBoxGrid()}
        </Box>
        </Box>
      <InCar open={open} />
        </Container>
      <Footer HomeiconColor="#B7C4CF"/>
    </React.Fragment>
  );
}

export default Parkinglot;