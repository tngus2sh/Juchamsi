import "./footer.css";
// import HomeIcon from "@mui/icons-material/Home";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { useNavigate } from "react-router-dom";

function Footer(props) {
  const navigate = useNavigate();

  const handleOpenMainPage = () => {
    // 메인 페이지로 이동
    navigate("/");
  };
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-home-button-container">
          <HomeRoundedIcon className="footer-icon" onClick={handleOpenMainPage} />
          <span className="footer-home-text">홈으로 이동</span>
        </div>
        <div className="footer-number-container">
          <p className="footer-number">문의 : 02-123-4567</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
