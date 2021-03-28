import React, { useState, useEffect } from "react";
import trWords from "../wordsData/trWords";
import "./Game.css";
import Timer from "./Timer";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { addUsedWordsToSS } from "./SessionStorage";
import {
  checkIsWordUsed,
  checkIsWordInList,
  checkLettersAreEqual,
} from "./Checkers.js";
import {
  makeUpperCase,
  makeLowerCase,
  getRandomValueFromArray,
} from "./Helpers.js";

const useStyles = makeStyles((theme) => ({
  button: {
    width: 250,
    height: 70,
    fontSize: "1.5em",
    margin: "50px auto",
  },
  mainContainer: {
    border: "2px solid white",
    borderRadius: 5,
    width: "70%",
    height: "80%",
    margin: "0 auto",
    position: "relative",
    top: "10%",
    textAlign: "center",
  },
  wordBoard: {
    fontSize: "1.5em",
    textAlign: "left",
    marginLeft: "10%",
    "& span": {
      color: "#0288d1",
    },
  },
}));

const App = () => {
  const classes = useStyles();
  const [isRoundStart, setIsRoundStart] = useState(false);
  const [speech, setSpeech] = useState(""); //ok
  const [selectedWord, setSelectedWord] = useState(null); //ok
  const [isStop, setIsStop] = useState(false); //ok?
  const [isGameOver, setIsGameOver] = useState(false); //ok
  const [isComputerThink, setIsComputerThink] = useState(false); //ok
  const [wordsOfComputer, setWordsOfComputer] = useState(null); //ok
  const [isGameStart, setIsGameStart] = useState(false); //ok?
  const [usedWords, setUsedWords] = useState([]);

  useEffect(() => {
    //render random words
    const interval = setInterval(() => {
      const randWord = getRandomValueFromArray(trWords);
      setWordsOfComputer(randWord);
    }, 100);
    return () => {
      clearInterval(interval);
    };
  }, [isComputerThink]);

  // OK
  const handleListen = (formerWord) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const mic = new SpeechRecognition();
    mic.continuous = true;
    mic.interimResults = true;
    mic.lang = "tr";
    mic.start();
    mic.onstart = () => {
      console.log("Mics on");
    };
    setTimeout(() => {
      mic.stop();
    }, 4000);

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setIsStop(true);
      mic.stop();

      mic.onend = () => {
        console.log("it ends");
        mic.stop();
        setSpeech(transcript);
        console.log(transcript);
        checkIsWordValid(formerWord, transcript);
        addUsedWordsToSS(transcript);
      };
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleStop = (isStop) => {
    setIsStop(isStop);
  };

  const handleGameOver = (isGameOver) => {
    setIsGameOver(isGameOver);
    setIsGameStart(false);
  };

  const startTheGame = () => {
    setIsGameOver(false); //?
    startTheRound();
    setIsGameStart(true);
  };

  //OK
  const startTheRound = (word) => {
    setIsRoundStart(true);
    const formerWord = getRandomWord(word);
    handleListen(formerWord);
  };

  //OK
  const getRandomWord = (formerWord) => {
    //after first name
    if (typeof formerWord === "string") {
      const correctWordArray = trWords.filter((word) =>
        checkLettersAreEqual(formerWord, word)
      );
      const randWord = getRandomValueFromArray(correctWordArray);
      setSelectedWord(randWord);
      addUsedWordsToSS(randWord);
      return randWord;
    } else {
      const randWord = getRandomValueFromArray(trWords);
      setSelectedWord(randWord);
      sessionStorage.setItem("usedWords", JSON.stringify([randWord]));
      return randWord;
    }
  };

  const checkIsWordValid = (formerWord, latterWord) => {
    latterWord = makeLowerCase(latterWord);
    const isWordInList = checkIsWordInList(latterWord);
    const areLettersEqual = checkLettersAreEqual(formerWord, latterWord);
    const isWordUsed = checkIsWordUsed(latterWord);
    // checking
    setTimeout(() => {
      // getting new word
      if (areLettersEqual && isWordInList && !isWordUsed) {
        setIsRoundStart(false); //ok
        setIsStop(false); //ok
        setIsComputerThink(true); //ok
        setTimeout(() => {
          setSpeech(""); //ok
          startTheRound(latterWord); //ok
          setIsComputerThink(false); //ok
        }, 1000);
      } else {
        setIsGameOver(true); //ok
        setIsStop(false); //ok
        setIsRoundStart(false);
        setIsGameStart(false);
        setSpeech("");
      }
    }, 1000);
  };

  return (
    <div className={classes.mainContainer}>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={startTheGame}
          disabled={isGameStart}
        >
          Start the Game
        </Button>
      </div>
      <Grid container>
        <Grid item xs={8}>
          {isRoundStart && (
            <div className={classes.wordBoard}>
              <h1>
                <span>TOM: &nbsp;</span>
                {selectedWord}
              </h1>
              <h1>
                <span>YOU: &nbsp;</span>
                {speech}
              </h1>
            </div>
          )}
          {isComputerThink && (
            <div className={classes.wordBoard}>
              <h1>
                <span>YOU: &nbsp;</span>
                {speech}
              </h1>
              <h1>
                <span>TOM: &nbsp;</span>
                {wordsOfComputer}
              </h1>
            </div>
          )}
        </Grid>
        <Grid item xs={4}>
          {isRoundStart && (
            <Timer
              time={5}
              handleGameOver={handleGameOver}
              handleStop={handleStop}
              isStop={isStop}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          {isGameOver && (
            <div>
              <h1 style={{ color: "red" }}>Game Over</h1>
              {JSON.parse(sessionStorage.getItem("usedWords")).map(
                (item) => item
              )}
            </div>
          )}
        </Grid>
      </Grid>
      <div></div>
    </div>
  );
};

export default App;
