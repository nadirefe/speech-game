import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  timer: {
    fontSize: "5em",
    marginTop: "20%",
    textAlign: "center",
  },
}));

const Timer = (props) => {
  const classes = useStyles();
  const [timer, setTimer] = useState(props.time);
  console.log(timer, "new render");
  useEffect(() => {
    if (timer === 0 || props.isStop) {
      // if (timer === 0) {
      props.handleGameOver(true);
      clearInterval(timer); //?
      console.log("not working");
      // }
    } else {
      console.log("works");
      const interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [timer]);

  return <div className={classes.timer}>{timer}</div>;
};

export default Timer;
