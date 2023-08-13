import * as React from "react";
import "./timer.css";

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
    <div className="timer-text-container">
      <div className="timer-text">
        {minutes.toString().padStart(2, "0")}분 {seconds.toString().padStart(2, "0")}초
      </div>
    </div>
  );
}

export default Timer;
