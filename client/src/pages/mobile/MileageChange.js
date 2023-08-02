import React from 'react';
import './MileageChange.css';
import Footer from './footer';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

function MileageChange() {
    const navigate = useNavigate();
    const usermileage = 20000;
    const [changemileage, setchangemileage] = React.useState(3000); // 수정된 부분
    const [maxMileage, setMaxMileage] = React.useState(usermileage);
    const [openModal, setOpenModal] = React.useState(false);

    const handlechangemileageChange = (event) => {
        setchangemileage(event.target.value);
    };

    const generateOptions = () => {
        const options = [];
        for (let i = 3000; i <= maxMileage; i += 1000) {
            options.push(i); // 수정된 부분
        }
        return options;
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleOpenMyPage = () => {
        navigate('/Mobile/Account')
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // modal 스타일
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
    };

    return (
        <div>
            <div className='mileagechangetext1'>
                <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p className='pointtext1'>보유마일리지</p>
                    <p className='pointtext2'>{usermileage}</p>
                </Stack>
                <br />
                <Stack direction="row" className='stack2'>
                    <p className='pointtext3'>현금 교환 마일리지</p>
                    <Box sx={{ minWidth: 80 }} className='pointbox1'>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                value={changemileage}
                                onChange={handlechangemileageChange}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200,
                                            overflowY: 'auto',
                                        },
                                    },
                                }}
                            >
                                 {generateOptions().map((value) => (
                                    <MenuItem
                                        key={value}
                                        value={value}
                                    >
                                        {value}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Stack>
                <br/>
                <Stack
                    direction="row"
                    className='stack1'
                >
                    <p className='bankname1'>예금주</p>
                    <TextField className='bankname2' variant="standard" sx={{ '& input': { textAlign: 'center' } }} />
                </Stack>
                <br />
                <Stack
                    direction="row"
                    className='stack3'
                >
                    <p className='bankname3'>은행명</p>
                    <FormControl fullWidth>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        defaultValue={30}
                        inputProps={{
                            name: 'bankName',
                            id: 'uncontrolled-native-bank',
                        }}
                        className='formcontrol1'
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                    overflowY: 'auto',
                                },
                            },
                        }}
                    >
                        <MenuItem value={10}>KB국민</MenuItem>
                        <MenuItem value={20}>기업</MenuItem>
                        <MenuItem value={30}>농협</MenuItem>
                        <MenuItem value={40}>산업</MenuItem>
                        <MenuItem value={50}>수협</MenuItem>
                        <MenuItem value={60}>신한</MenuItem>
                        <MenuItem value={70}>우리</MenuItem>
                        <MenuItem value={80}>우체국</MenuItem>
                        <MenuItem value={90}>하나</MenuItem>
                        <MenuItem value={100}>한국씨티</MenuItem>
                        <MenuItem value={110}>SC제일</MenuItem>
                        <MenuItem value={120}>카카오뱅크</MenuItem>
                        <MenuItem value={130}>케이뱅크</MenuItem>
                        <MenuItem value={140}>토스뱅크</MenuItem>
                        <MenuItem value={150}>경남</MenuItem>
                        <MenuItem value={160}>광주</MenuItem>
                        <MenuItem value={170}>대구</MenuItem>
                        <MenuItem value={180}>부산</MenuItem>
                        <MenuItem value={190}>전북</MenuItem>
                        <MenuItem value={200}>신협</MenuItem>
                    </Select>
                    </FormControl>
                </Stack>
                <br />
                <Stack
                    direction="row"
                    className='stack1'
                >
                    <p className='bankname4'>계좌번호</p>
                    <TextField className='bankname5' variant="standard" sx={{ '& input': { textAlign: 'center' } }} />
                </Stack>
            </div>
            <Box
                component="span"
                className='okbtn'
                onClick={handleOpenModal}
            >
                <p className="mileagechangetext2">교환신청</p>
            </Box>
            <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style1}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        1.1마일리지
                        1-1. 최소 1000마일리지 이상~~
                    </Typography>
                </Box>
            </Modal>
            <Box
                component="span"
                className='closebtn'
                onClick={handleOpenMyPage}
            >
                <p className="mileagechangetext3">취소</p>
            </Box>
            <Footer AccounticonColor="#33907C" />
        </div>
    );
}

export default MileageChange;