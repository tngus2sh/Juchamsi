import './footer.css';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';


function Footer(props) {
    const navigate = useNavigate();

    const handleOpenMainPage = () => {
      // 메인 페이지로 이동
      navigate('/');
    };
    return (
        <div>
            <HomeIcon className='footericon' sx={{ fontSize: 100 }} onClick={handleOpenMainPage}/>
            <p className='footernumber'>문의 : 02-123-4567</p>
        </div>
    )
}

export default Footer;