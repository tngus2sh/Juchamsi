import React from 'react'
import './account.css'
import Footer from './footer';
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import { useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';


function Account() {
    const navigate = useNavigate();
    const carNumber = useSelector((state) => state.mobileInfo.carNumber);
    const loginId = useSelector((state) => state.mobileInfo.loginId);
    const name = useSelector((state) => state.mobileInfo.name);
    const phoneNumber = useSelector((state) => state.mobileInfo.phoneNumber);
    const [MileageOpen, setMileageOpen] = React.useState(false);
    const handleOpenupdateAccount = () => {
        navigate('/Mobile/Account/Update')
    }

    const handleOpenMileageChange = () => {
        navigate('/Mobile/Mileage/Change')
    }
    const handleOpenMileage = () => {
        setMileageOpen(true); // 모달 열기
    }
    const handleCloseMileage = () => {
        setMileageOpen(false); // 모달 닫기
    }

    // axios결과 res.data.response 리스트 안에 딕셔너리 형태인듯?
    // { 'id': 1, 'point': 100, 'type': '적립', 'description': '출금 시간 등록 적립', 'createdDate': 날짜, 'lastModifiedDate': 날짜}
    const alltext = [{id:1,point:100,type:'적립',description:'출차 시간 등록 적립', createDate:'2023.08.02 09:56'},
                     {id:2,point:-100,type:'사용',description:'교환', createDate:'2023.08.03 09:56'},
                     {id:3,point:30,type:'적립',description:'출차 시간 등록 적립', createDate:'2023.08.03 19:56'},
                     {id:4,point:40,type:'적립',description:'차량 키 보관 적립', createDate:'2023.08.03 20:00'},
                     {id:5,point:30,type:'적립',description:'출차 시간 준수', createDate:'2023.08.04 07:35'},]
    // type이 '적립'인 것만 filtering하여 savingtext 배열로 생성
    const savingtext = alltext.filter((item) => item.type === '적립');

    // type이 '사용'인 것만 filtering하여 usetext 배열로 생성
    const usetext = alltext.filter((item) => item.type === '사용');

    const [selectedTag, setSelectedTag] = React.useState('전체');
    const [content, setContent] = React.useState(alltext); // 보여질 내용을 관리하는 상태 추가

      // 선택한 태그에 따라 보여질 내용을 설정하는 함수
    const handleTagClick = (tag) => {
      setSelectedTag(tag);
      // 선택한 태그에 따라 보여질 내용을 설정
      if (tag === '전체') {
          setContent(alltext);
          } else if (tag === '적립') {
          setContent(savingtext);
          } else if (tag === '사용') {
          setContent(usetext);
          }
    };

    const style1 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 230,
        height:'260px',
        bgcolor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        maxHeight: '80vh', // 최대 높이 설정
        overflowY: 'auto', // 스크롤바 추가
      };


    return (
        <div>
            <div className='firstinfo'>
                <Stack direction="row" spacing={2}>
                    <Avatar alt="Remy Sharp" src={process.env.PUBLIC_URL + '/img/mobile/1.jpg'} sx={{ width: 50, height: 50 }}/>
                    <Stack direction="column">
                        <p className='idstyle'>{loginId}</p>
                        <p className='namestyle'>{name}</p>
                    </Stack>
                </Stack>
            </div>
            <Fab color="secondary" aria-label="edit" className='editicon' onClick={handleOpenupdateAccount}>
                <EditIcon />
            </Fab>
            <hr className='hr1'/>
            <p className='miletext1'>현재 마일리지</p>
            <img src={process.env.PUBLIC_URL + '/img/mobile/2.png'} className='mileimg'></img>
            <p className='miletext'>20000</p>
            <DescriptionIcon className='descripticon' onClick={handleOpenMileage} />
            <Modal open={MileageOpen} onClose={handleCloseMileage} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style1}>
                    <p className='modaltext1'>마일리지 이용내역</p>
                    <p className={`modaltext2 ${selectedTag === '전체' ? 'selected' : ''}`} onClick={() => handleTagClick('전체')}>전체</p>
                    <p className={`modaltext3 ${selectedTag === '적립' ? 'selected' : ''}`} onClick={() => handleTagClick('적립')}>적립</p>
                    <p className={`modaltext4 ${selectedTag === '사용' ? 'selected' : ''}`} onClick={() => handleTagClick('사용')}>사용</p>
                    {/* 보여질 내용을 상태에 따라 렌더링 */}
                    {content.map((item) => (
                    <div className='pointtext' key={item.id}>
                        <Stack direction="row" sx={{display:'flex', justifyContent:'space-between'}}>
                            <p className='pointtext1'>{item.description}</p>
                            <p className='pointtext1'>{item.point}</p>
                        </Stack>
                        <br/>
                        <Box sx={{display:'flex', flexDirection: 'row-reverse'}}>
                            <p className='pointtext1' >{item.createDate}</p>
                        </Box>
                        <hr />
                    </div>
                    ))}
                </Box>
            </Modal>
            <hr className='hr2'/>
            <p className='miletext2'>마일리지 교환</p>
            <p className='miletext3'>보유 마일리지 3000이상시 1000포인트 단위 교환가능</p>
            <Box
                component="span"
                className='mileagebtn'
                onClick={handleOpenMileageChange}
            >
                <p className="mileagebtntext">교환</p>
            </Box>
            <Footer AccounticonColor="#33907C"/>
        </div>
    )
}

export default Account;