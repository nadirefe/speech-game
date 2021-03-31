import React, { useState, useEffect } from "react";
import trWords from "./wordsData/tr-names";
import enWords from "./wordsData/en-names";
import ResultChain from "./components/ResultChain";
import Selectors from "./components/Selectors";
import "./Game.css";
import Timer from "./components/Timer";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";
import { addUsedWordsToSS } from "./SessionStorage";
import {
  checkIsWordUsed,
  checkIsWordInList,
  checkLettersAreEqual,
  checkComputerLost,
} from "./Checkers.js";
import { makeLowerCase, getRandomValueFromArray } from "./Helpers.js";

const useStyles = makeStyles((theme) => ({
  button: {
    width: 250,
    height: 70,
    fontSize: "1.5em",
  },
  upperContainer: {
    height: "30%",
    marginTop: 20,
  },
  mainContainer: {
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
  resultContainer: {
    marginTop: 10,
  },
  lostText: {
    color: "red",
    margin: "auto",
    fontSize: "3.5em",
  },
  winText: {
    color: "#0288d1",
    margin: "auto",
    fontSize: "3.5em",
  },
}));

const Game = () => {
  const classes = useStyles();
  const [isRoundStart, setIsRoundStart] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isComputerThink, setIsComputerThink] = useState(false);
  const [isGameStart, setIsGameStart] = useState(false);
  const [isYouWin, setIsYouWin] = useState(false);
  const [wordsOfComputer, setWordsOfComputer] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);
  const [speech, setSpeech] = useState("");
  const [answerProb, setAnswerProb] = useState(0.3);
  const [language, setLanguage] = useState("tr");
  const [time, setTime] = useState(8);

  useEffect(() => {
    if (isComputerThink) {
      const nameList = language === "tr" ? trWords : enWords;
      const interval = setInterval(() => {
        const randWord = getRandomValueFromArray(nameList, language);
        setWordsOfComputer(randWord);
      }, 100);
      return () => {
        clearInterval(interval);
      };
    }
  }, [isComputerThink]);

  const handleDifficultyChange = (answerProb) => {
    setAnswerProb(answerProb);
  };

  const handleLanguageChange = (language) => {
    setLanguage(language);
  };

  const handleTimeChange = (time) => {
    setTime(time);
  };

  const computerSays = (word) => {
    let synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(word);
    utterThis.lang = language;
    synth.speak(utterThis);
  };

  const handleListenFromUser = (formerWord) => {
    computerSays(formerWord);
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const mic = new SpeechRecognition();
    mic.continuous = true;
    mic.interimResults = true;
    mic.lang = language;
    setTimeout(() => {
      mic.start();
    }, 500);
    setTimeout(() => {
      mic.stop();
    }, (time - 1) * 1000);

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      mic.stop();
      mic.onend = () => {
        mic.stop();
        setSpeech(transcript);
        checkIsWordValid(formerWord, transcript);
        addUsedWordsToSS(transcript);
      };
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleGameOver = (isGameOver) => {
    addUsedWordsToSS(selectedWord);
    setIsGameOver(isGameOver);
    setIsGameStart(false);
    setIsRoundStart(false);
  };

  const startTheGame = () => {
    setIsYouWin(false);
    setIsGameOver(false);
    startTheRound();
    setIsGameStart(true);
  };

  const startTheRound = (word) => {
    setIsRoundStart(true);
    const formerWord = getRandomWord(word);
    handleListenFromUser(formerWord);
  };

  const getRandomWord = (formerWord) => {
    const nameList = language === "tr" ? trWords : enWords;
    if (typeof formerWord === "string") {
      const correctWordArray = nameList.filter((word) =>
        checkLettersAreEqual(formerWord, word)
      );
      const randWord = getRandomValueFromArray(correctWordArray);
      setSelectedWord(randWord);
      return randWord;
    } else {
      const randWord = getRandomValueFromArray(nameList);
      setSelectedWord(randWord);
      sessionStorage.clear();
      return randWord;
    }
  };

  const checkIsWordValid = (formerWord, latterWord) => {
    const nameList = language === "tr" ? trWords : enWords;
    latterWord = makeLowerCase(latterWord, language);
    const isWordInList = checkIsWordInList(latterWord, nameList);
    const areLettersEqual = checkLettersAreEqual(
      formerWord,
      latterWord,
      language
    );
    const isWordUsed = checkIsWordUsed(latterWord, language);
    const isComputerLost = checkComputerLost(formerWord, answerProb);
    const computerThinkingTime = Math.floor(Math.random() * 3000) + 1000;
    addUsedWordsToSS(formerWord);

    setTimeout(() => {
      setIsRoundStart(false);
      if (areLettersEqual && isWordInList && !isWordUsed) {
        setIsComputerThink(true);
        setTimeout(() => {
          setSpeech("");
          if (isComputerLost) {
            setIsYouWin(true);
            setIsGameStart(false);
          } else {
            startTheRound(latterWord);
          }
          setIsComputerThink(false);
        }, computerThinkingTime);
      } else {
        setIsGameOver(true);
        setSpeech("");
        setIsGameStart(false);
      }
    }, 500);
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.upperContainer}>
        <Selectors
          onSelectDifficulty={handleDifficultyChange}
          onSelectLanguage={handleLanguageChange}
          onSelectTime={handleTimeChange}
        />
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
          <div className={classes.resultContainer}>
            {isGameOver && <h1 className={classes.lostText}>You Lost!</h1>}
            {isYouWin && (
              <div>
                <h3>Tom couldn't find any name!</h3>
                <h1 className={classes.winText}>You Win!</h1>
              </div>
            )}
          </div>
        </Grid>
        <Grid item xs={2}>
          {isRoundStart && (
            <Timer time={time} handleGameOver={handleGameOver} />
          )}
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
              <ResultChain selectedWord={selectedWord} />
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Game;
