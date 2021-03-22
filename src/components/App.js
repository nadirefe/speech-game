import React, { useState, useEffect, useRef } from "react";
import trWords from "../wordsData/trWords";
import "./App.css";
import Timer from "./Timer";
import {
  makeUpperCase,
  makeLowerCase,
  getRandomValueFromArray,
} from "./helpers.js";

const App = () => {
  const [isRoundStart, setIsRoundStart] = useState(false);
  const [speech, setSpeech] = useState(""); //ok
  const [selectedWord, setSelectedWord] = useState(null); //ok
  const [isStop, setIsStop] = useState(false); //ok?
  const [isGameOver, setIsGameOver] = useState(false); //ok
  const [isComputerThink, setIsComputerThink] = useState(false); //ok
  const [wordsOfComputer, setWordsOfComputer] = useState(null); //ok

  useEffect(() => {
    //render random words
    if (isComputerThink) {
      setInterval(() => {
        const randWord = getRandomValueFromArray(trWords);
        setWordsOfComputer(randWord);
      }, 100);
    }
  }, [isComputerThink]);

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
        checkIsWordValid(formerWord, transcript);
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
  };

  const startTheRound = (word) => {
    setIsRoundStart(!isRoundStart); //true
    const formerWord = getRandomWord(word);
    handleListen(formerWord);
  };

  const getRandomWord = (formerWord) => {
    //after first name
    if (typeof formerWord === "string") {
      const correctWordArray = trWords.filter((word) =>
        checkLettersAreEqual(formerWord, word)
      );
      const randWord = getRandomValueFromArray(correctWordArray);
      setSelectedWord(randWord);
      return randWord;
    } else {
      const randWord = getRandomValueFromArray(trWords);
      setSelectedWord(randWord);
      return randWord;
    }
  };

  const checkIsWordValid = (formerWord, latterWord) => {
    latterWord = makeLowerCase(latterWord);
    const isWordInList = checkIsWordInList(latterWord);
    const areLettersEqual = checkLettersAreEqual(formerWord, latterWord);
    // checking
    setTimeout(() => {
      // getting new word
      if (areLettersEqual && isWordInList) {
        setIsRoundStart(false);
        setIsStop(false);
        setIsComputerThink(true);
        console.log("game continue");
        setTimeout(() => {
          setSpeech("");
          startTheRound(latterWord);
          setIsComputerThink(false);
        }, 1000);
      } else {
        setIsGameOver(true);
      }
    }, 1000);
  };

  const checkIsWordInList = (word) => {
    const isWordInList = trWords.includes(word);
    return isWordInList;
  };

  const checkLettersAreEqual = (formerWord, latterWord) => {
    let lastLetterOfFormerWord = formerWord.charAt(formerWord.length - 1);
    lastLetterOfFormerWord = makeLowerCase(lastLetterOfFormerWord);
    let firstLetterOfLatterWord = latterWord.charAt(0);
    firstLetterOfLatterWord = makeLowerCase(firstLetterOfLatterWord);
    const areLettersEqual = lastLetterOfFormerWord === firstLetterOfLatterWord;
    return areLettersEqual;
  };

  return (
    <div>
      <button onClick={startTheRound}>Start Game</button>
      {isRoundStart && (
        <div>
          <h1>Last Word: {selectedWord}</h1>
          <h1>Answer: {speech}</h1>
          <Timer
            time={5}
            handleGameOver={handleGameOver}
            handleStop={handleStop}
            isStop={isStop}
          />
          {isGameOver && <h1 style={{ color: "red" }}>Game Over</h1>}
        </div>
      )}

      {isComputerThink && (
        <div>
          <h1>Your answer: {speech}</h1>
          <h1>Computer is thinking</h1>
          <h1>{wordsOfComputer}</h1>
        </div>
      )}

      {/* {isStop && <div>is stopped</div>} */}
    </div>
  );
};

export default App;
