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
  usedWords: {
    textAlign: "left",
    fontSize: "1.2em",
    "& p": {
      color: "#0288d1",
      marginLeft: 35,
    },
  },
}));

const App = () => {
  const classes = useStyles();
  const [isRoundStart, setIsRoundStart] = useState(false);
  const [speech, setSpeech] = useState(""); //ok
  const [selectedWord, setSelectedWord] = useState(null); //ok
  const [isGameOver, setIsGameOver] = useState(false); //ok
  const [isComputerThink, setIsComputerThink] = useState(false); //ok
  const [wordsOfComputer, setWordsOfComputer] = useState(null); //ok
  const [isGameStart, setIsGameStart] = useState(false); //ok?
  const [isYouWin, setIsYouWin] = useState(false);

  useEffect(() => {
    //render random words
    if (isComputerThink) {
      const interval = setInterval(() => {
        const randWord = getRandomValueFromArray(trWords);
        setWordsOfComputer(randWord);
      }, 100);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isComputerThink]);

  // OK
  const computerSays = (word) => {
    let synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(word);
    utterThis.lang = "tr";
    synth.speak(utterThis);
  };

  const handleListen = (formerWord) => {
    computerSays(formerWord);
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

  const handleGameOver = (isGameOver) => {
    setIsGameOver(isGameOver);
    setIsGameStart(false); //button get active
    setIsRoundStart(false);
  };

  const startTheGame = () => {
    setIsYouWin(false);
    setIsGameOver(false); //remove Gameover at DOM.
    startTheRound(); //start the game
    setIsGameStart(true); //disable button
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

  const isComputerLost = () => {
    const num = Math.random();
    console.log(num);
    //Cs lost
    if (num < 0.3) {
      return true;
    } else {
      return false;
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
      setIsRoundStart(false);
      if (areLettersEqual && isWordInList && !isWordUsed) {
        setIsComputerThink(true); //ok
        setTimeout(() => {
          setSpeech(""); //ok
          if (isComputerLost()) {
            setIsYouWin(true);
            setIsGameStart(false);
          } else {
            startTheRound(latterWord); //ok
          }
          setIsComputerThink(false); //ok
        }, 1000);
      } else {
        setIsGameOver(true); //ok, DOM
        setSpeech(""); // remove speech at DOM.
        setIsGameStart(false); //active button
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
        <Grid item xs={6}>
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
          {isGameOver && (
            <h1 style={{ color: "red", margin: "auto", fontSize: "3.5em" }}>
              You Lost!
            </h1>
          )}
          {isYouWin && (
            <div>
              <h3>Tom couldn't find any name!</h3>
              <h1
                style={{ color: "#0288d1", margin: "auto", fontSize: "3.5em" }}
              >
                You Win!
              </h1>
            </div>
          )}
        </Grid>
        <Grid item xs={2}>
          {isRoundStart && <Timer time={5} handleGameOver={handleGameOver} />}
        </Grid>
        <Grid
          className={classes.usedWords}
          item
          container
          xs={4}
          direction="row"
        >
          {(isGameOver || isYouWin) && (
            <>
              <Grid item xs={6}>
                <p>TOM</p>
              </Grid>
              <Grid item xs={6}>
                <p>YOU</p>
              </Grid>
              {JSON.parse(sessionStorage.getItem("usedWords")).map(
                (item, index) => {
                  return (
                    <>
                      {index % 2 === 0 && (
                        <Grid item xs={6}>
                          <ul>
                            <li>{item}</li>
                          </ul>
                        </Grid>
                      )}
                      {index % 2 === 1 && (
                        <Grid
                          style={{ position: "relative", top: 30 }}
                          item
                          xs={6}
                        >
                          <ul>
                            <li>{item} </li>
                          </ul>
                        </Grid>
                      )}
                    </>
                  );
                }
              )}
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
