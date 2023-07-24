import * as React from 'react';

function Timer() {
  const [minutes, setMinutes] = React.useState(10);
  const [seconds, setSeconds] = React.useState(0);

  // 타이머 시작
  React.useEffect(() => {
    let interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [minutes, seconds]);

  return (
    <div style={{ fontSize: '70px', fontWeight: 'bold', textAlign: 'center',  position:'absolute' ,top:'30%', left:'30%'}}>
      {minutes.toString().padStart(2, '0')}분 {seconds.toString().padStart(2, '0')}초
    </div>
  );
}

export default Timer;
