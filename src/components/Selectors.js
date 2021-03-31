import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Input,
  Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  timeSelector: {
    position: "relative",
    bottom: 15,
  },
  formControl: {
    width: 100,
    fontSize: 30,
    marginLeft: 100,
  },
}));

const Selectors = (props) => {
  const classes = useStyles();
  const [answerProb, setAnswerProb] = useState(0.3);
  const [language, setLanguage] = useState("tr");
  const [time, setTime] = useState(8);

  const handleDifficultyChange = (event) => {
    setAnswerProb(event.target.value);
    props.onSelectDifficulty(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    props.onSelectLanguage(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value === "" ? "" : Number(event.target.value));
    props.onSelectTime(
      event.target.value === "" ? "" : Number(event.target.value)
    );
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
            <InputLabel
              classes={{
                root: classes.selector,
              }}
              id="demo-simple-select-label"
            >
              Difficulty
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={answerProb}
              onChange={(event) => handleDifficultyChange(event)}
            >
              <MenuItem value={0.4}>Easy</MenuItem>
              <MenuItem value={0.3}>Normal</MenuItem>
              <MenuItem value={0.2}>Hard</MenuItem>
              <MenuItem value={0.05}>Master</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl className={classes.formControl}>
            <InputLabel
              classes={{
                root: classes.selector,
              }}
              id="demo-simple-select-label"
            >
              Language
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={language}
              onChange={(event) => handleLanguageChange(event)}
            >
              <MenuItem value={"tr"}>Turkish</MenuItem>
              <MenuItem value={"en-US"}>English</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <div className={classes.timeSelector}>
            <p>Time (seconds)</p>
            <Input
              value={time}
              margin="dense"
              onChange={handleTimeChange}
              inputProps={{
                step: 1,
                min: 5,
                max: 100,
                type: "number",
                "aria-labelledby": "input-slider",
              }}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Selectors;
