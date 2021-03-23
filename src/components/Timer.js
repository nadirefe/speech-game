import React, { useEffect, useState } from "react";

const Timer = (props) => {
  const [timer, setTimer] = useState(props.time);
  useEffect(() => {
    if (timer === 0 || props.isStop) {
      if (timer === 0) {
        props.handleGameOver(true);
      }
      props.handleStop(true);
      clearInterval(timer);
    } else {
      const interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [timer]);

  return (
    <div>
      <h1>{timer}</h1>
    </div>
  );
};

export default Timer;
