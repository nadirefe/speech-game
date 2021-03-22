import React, { useState, useEffect } from "react";
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
    //not sure about if statement
    const interval = setInterval(() => {
      const randWord = getRandomValueFromArray(trWords);
      setWordsOfComputer(randWord);
    }, 100);
    return () => clearInterval(interval);
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
      addUsedWordsToSS(randWord);
      return randWord;
    } else {
      const randWord = getRandomValueFromArray(trWords);
      setSelectedWord(randWord);
      sessionStorage.setItem("usedWords", JSON.stringify([randWord]));
      return randWord;
    }
  };

  const addUsedWordsToSS = (word) => {
    let usedWordsArr = sessionStorage.getItem("usedWords");
    usedWordsArr = JSON.parse(usedWordsArr);
    usedWordsArr = [...usedWordsArr, word];
    sessionStorage.setItem("usedWords", JSON.stringify(usedWordsArr));
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
        setIsRoundStart(false);
        setIsStop(false);
        setIsComputerThink(true);
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

  const checkIsWordUsed = (word) => {
    word = makeUpperCase(word);
    const usedWordsArr = JSON.parse(sessionStorage.getItem("usedWords"));
    const isWordUsed = usedWordsArr.includes(word);
    return isWordUsed;
  };

  const checkIsWordInList = (word) => {
    const isWordInList = trWords.includes(word);
    return isWordInList;
  };

  const checkLettersAreEqual = (formerWord, latterWord) => {
    let lastLetterOfFormerWord = formerWord.charAt(formerWord.length - 1);
    lastLetterOfFormerWord = makeLowerCase(lastLetterOfFormerWord);
    let firstLetterOfLatterWord = latterWord.charAt(0);
    firstLetterOfLatterWord = makeLowerCase(latterWord);
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
