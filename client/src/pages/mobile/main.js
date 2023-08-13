import './main.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

function Home() {
  const navigate = useNavigate();
  const [showLogo, setShowLogo] = useState(true);

  const handleOpenLoginPage = useCallback(() => {
    setShowLogo(false);
    setTimeout(() => {
      navigate('/Mobile/Login');
    }, 500);
  }, [navigate]);

  const transitionRef = useRef(null); // Transition 컴포넌트에 대한 ref를 생성합니다.

  useEffect(() => {
    const timer = setTimeout(() => {
      handleOpenLoginPage();
    }, 1000);

    return () => clearTimeout(timer);
  }, [handleOpenLoginPage]);

  
  return (
    <div className="home">
      <CSSTransition
        in={showLogo}
        timeout={500}
        classNames="logo-transition"
        unmountOnExit
        // Transition 컴포넌트에 ref를 적용합니다.
        nodeRef={transitionRef}
      >
        {/* img 요소에 ref를 적용합니다. */}
        <img
          ref={transitionRef}
          className="mainlogo"
          src={process.env.PUBLIC_URL + '/img/mobile/logo.png'}
          alt="title"
        ></img>
      </CSSTransition>
    </div>
  );
}

export default Home;
