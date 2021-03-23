import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  button: {
    width: 250,
    height: 70,
    fontSize: "1.5em",
  },
}));

const Board = (props) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.button}
      variant="contained"
      color="primary"
      onClick={props.startTheRound}
    >
      Start the Game
    </Button>
  );
};

export default Board;
