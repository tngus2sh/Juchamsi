import './footer.css';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TextsmsIcon from '@mui/icons-material/Textsms';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

function Footer(props) {
    const navigate = useNavigate();

    const handleOpenParkinglotPage = () => {
      // 주차현황페이지로 이동
      navigate('/Mobile/Parkinglot');
    };
    const handleOpenMycarPage = () => {
      // 내 주차현황 페이지로 이동
      navigate('/Mobile/Mycar');
    };
    const handleOpenTermessagePage = () => {
      // 대화방 페이지로 이동
      navigate('/Mobile/Termessage');
    };
    const handleOpenAccountPage = () => {
      // 마이페이지로 이동
      navigate('/Mobile/Account');
    };
    return (
        <div>
            <Box sx={{        
                width: 320,
                height: 80,
                backgroundColor: '#212121',
                }} className='footer_box'>
            </Box>
            <HomeIcon className='footerhomeicon' sx={{ fontSize: 50, color: props.HomeiconColor }} onClick={handleOpenParkinglotPage}/>
            <DirectionsCarIcon className='footercaricon' sx={{ fontSize: 50, color: props.MycariconColor }} onClick={handleOpenMycarPage}/>
            <TextsmsIcon className='footermessageicon' sx={{ fontSize: 50, color: props.TermessageiconColor }} onClick={handleOpenTermessagePage}/>
            <ManageAccountsIcon className='footeraccounticon' sx={{ fontSize: 50, color: props.AccounticonColor }} onClick={handleOpenAccountPage}/>
            <img
              className="footerlogo"
              src={process.env.PUBLIC_URL + '/img/kiosk/logo1.png'}
              alt={'title'}
            ></img>
        </div>
    )
}

export default Footer;