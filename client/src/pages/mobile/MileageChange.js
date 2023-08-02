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
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function MileageChange() {
    const [showPassword, setShowPassword] = React.useState(false);
    const navigate = useNavigate();
    const usermileage = 20000;
    const [changemileage, setchangemileage] = React.useState(3000);
    const [maxMileage, setMaxMileage] = React.useState(usermileage);
    const [openModal, setOpenModal] = React.useState(false);
    const [accountHolder, setAccountHolder] = React.useState('');
    const [accountNumber, setAccountNumber] = React.useState('');
    const [bankName, setBankName] = React.useState(10); // 기본 값 설정
    const [password1, setPasswordLocal1] = React.useState('');
    const [simplePasswordEntered, setSimplePasswordEntered] = React.useState(false);


    const handlechangemileageChange = (event) => {
        setchangemileage(event.target.value);
    };

    const getAccountHolder = () => {
        if (accountHolder) {
            return accountHolder
        }
        return '';
    };


    const generateOptions = () => {
        const options = [];
        for (let i = 3000; i <= maxMileage; i += 1000) {
            options.push(i);
        }
        return options;
    };

    const handleOpenModal = () => {
        if (accountHolder && accountNumber) {
            setOpenModal(true);
        }
    };

    const handleOpenMyPage = () => {
        navigate('/Mobile/Account');
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAccountHolderChange = (event) => {
        const value = event.target.value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, '').slice(0, 4);
        setAccountHolder(value);
    };

    const handleAccountNumberChange = (event) => {
        const value = event.target.value.replace(/\D/g, '').slice(0, 16);
        setAccountNumber(value);
    };

    const handleBankNameChange = (event) => {
        setBankName(event.target.value);
    };

    const [openFinalModal, setOpenFinalModal] = React.useState(false);
    const [openResultModal, setOpenResultModal] = React.useState(false);

    const handlechangeModal = () => {
        handleCloseModal(); // 기존 모달 닫기
        setOpenFinalModal(true); // 최종 확인 모달 열기
    };

    const handleOpenNewModal = () => {
        setOpenResultModal(true);
    };


    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const getBankNameByValue = (value) => {
        switch (value) {
            case 10:
                return 'KB국민';
            case 20:
                return '기업';
            case 30:
                return '농협';
            case 40:
                return '산업';
            case 50:
                return '수협';
            case 60:
                return '신한';
            case 70:
                return '우리';
            case 80:
                return '우체국';
            case 90:
                return '하나';
            case 100:
                return '한국씨티';
            case 110:
                return 'SC제일';
            case 120:
                return '카카오뱅크';
            case 130:
                return '케이뱅크';
            case 140:
                return '토스뱅크';
            case 150:
                return '경남';
            case 160:
                return '광주';
            case 170:
                return '대구';
            case 180:
                return '부산';
            case 190:
                return '전북';
            case 200:
                return '신협';
            default:
                return ''; // 처리하지 않은 값에 대한 디폴트 값
        }
    };

    const isOkBtnDisabled = !(accountHolder && accountNumber);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

      const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'password1') {
           // 비밀번호 입력 길이를 6글자로 제한
           const onlynumb = value.replace(/[^0-9/ ]/g, '');
           const checkpasswordvalue = onlynumb.slice(0, 6);
           setPasswordLocal1(checkpasswordvalue);
           setSimplePasswordEntered(checkpasswordvalue.length > 0);
        }
      };

    // modal 스타일
    const style1 = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 230,
        height:'280px',
        bgcolor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        maxHeight: '80vh', // 최대 높이 설정
        overflowY: 'auto', // 스크롤바 추가
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
                    <TextField
                        className='bankname2'
                        variant="standard"
                        sx={{ '& input': { textAlign: 'center' } }}
                        value={accountHolder}
                        onChange={handleAccountHolderChange}
                    />
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
                        value={bankName} // 은행명을 선택한 값으로 설정
                        onChange={handleBankNameChange} // 은행명 변경 이벤트 연결
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
                    <TextField
                        className='bankname5'
                        variant="standard"
                        sx={{ '& input': { textAlign: 'center' } }}
                        value={accountNumber}
                        onChange={handleAccountNumberChange}
                    />
                </Stack>
            </div>
            <Box
                component="span"
                className={isOkBtnDisabled ? 'okbtn3' : 'okbtn'}
                onClick={handleOpenModal}
            >
                <p className="mileagechangetext2">교환신청</p>
            </Box>
            <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style1}>
                    <Typography id="modal-modal-description">
                        <span style={{fontSize:'16px', fontWeight:'bold'}}>1.마일리지</span>
                        <br/>
                        <br/>
                        <span style={{fontSize:'12px', fontWeight:'bold'}}>1-1. 최소 1000마일리지 이상만 마일리지 교환을 신청할 수있으며  1000포인트 단위로 마일리지 교환이 가능합니다.</span>
                        <br/>
                        <br/>
                        <span style={{fontSize:'12px', fontWeight:'bold'}}>1-2. 마일리지 교환 신청 후 영업일 기준 2~3일 정도 시간이 소요됩니다.</span>
                        <br/>
                        <br/>
                        <span style={{fontSize:'12px', fontWeight:'bold'}}>1-3. 영업일 3일 이후에도 마일리지 교환이 완료되지 않을경우 고객센터로 문의해주시기 바랍니다.</span>
                        <br/>
                        <span style={{fontSize:'12px', fontWeight:'bold'}}>고객센터 : 02-123-4567</span>
                        <br/>
                        <br/>
                        <span style={{fontSize:'16px', fontWeight:'bold'}}>2.은행 정보 관련</span>
                        <br/>
                        <br/>
                        <span style={{fontSize:'12px', fontWeight:'bold'}}>2-1. 예금주, 은행명, 계좌번호 오기재로 인한 마일리지 환급문제의 경우 당사에서 책임지지 않음을 안내드립니다.</span>
                        <br/>
                        <br/>
                        <span style={{fontSize:'12px', fontWeight:'bold'}}>2-2. 별도의 은행명, 계좌번호, 예금주 확인을 진행하지 않음으로 신청자 본인이 잘 확인해서 입력해주시기 바랍니다.</span>
                    </Typography>
                    <Box
                        component="span"
                        className='okbtn1'
                        onClick={handlechangeModal}
                    >
                        <p className="mileagechangetext4">확인</p>
                    </Box>
                    <br/>
                    <br/>
                    <br/>
                </Box>
            </Modal>
            <Box
                component="span"
                className='closebtn'
                onClick={handleOpenMyPage}
            >
                <p className="mileagechangetext3">취소</p>
            </Box>
            <Modal open={openFinalModal} onClose={() => setOpenFinalModal(false)}>
                <Box sx={style1}>
                    {/* 사용자가 선택한 값을 표시 */}
                    <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p className='pointtext1'>현재 보유 마일리지</p>
                        <p className='pointtext2'>{usermileage}</p>
                    </Stack>
                    <br/>
                    <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p className='pointtext1'>현금 교환 마일리지</p>
                        <p className='pointtext2'>{changemileage}</p>
                    </Stack>
                    <br/>
                    <Stack direction="row" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p className='pointtext1'>교환후 남은 마일리지</p>
                        <p className='pointtext2'>{usermileage - changemileage}</p>
                    </Stack>
                    <br/>
                    <br/>
                    {/* 선택한 은행명과 계좌 정보를 표시 */}
                    <p>계좌정보</p>
                    <br/>
                    <div className='mileageresulttext1'>
                        <p className='mileagetext2'>{getBankNameByValue(bankName)}</p>
                        <p className='mileagetext2'>{accountNumber}</p>
                        <p className='mileagetext2'>{getAccountHolder()}</p>
                    </div>
                    <FormControl sx={{width: '25ch' }} variant="outlined" className="easypw1" required>
                        <InputLabel htmlFor="outlined-adornment-password1">간편 비밀번호</InputLabel>
                        <OutlinedInput
                        id="outlined-adornment-password1"
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        }
                        label="비밀번호"
                        name="password1"
                        value={password1}
                        onChange={handleInputChange}
                        sx={{ '& input': { textAlign: 'center' } }}
                        />
                    </FormControl>
                    <Box
                        component="span"
                        className={simplePasswordEntered ? 'okbtn4' : 'okbtn5'}
                        onClick={handleOpenNewModal}
                    >
                        <p className="mileagechangetext2">교환신청</p>
                    </Box>
                </Box>
            </Modal>
            <Modal open={openResultModal} onClose={() => setOpenResultModal(false)}>
                <Box sx={style1}>
                    <p>결과창</p>
                </Box>
            </Modal>
            <Footer AccounticonColor="#33907C" />
        </div>
    );
}

export default MileageChange;