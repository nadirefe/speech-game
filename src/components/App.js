import React, { useState, useEffect, useRef } from "react";
import trWords from "../wordsData/trWords";
import "./App.css";
import Timer from "./Timer";
import { makeUpperCase, makeLowerCase } from "./helpers.js";

const App = () => {
  const [isRoundStart, setIsRoundStart] = useState(false);
  const [speech, setSpeech] = useState(""); //ok
  const [selectedWord, setSelectedWord] = useState(null); //ok
  const [isStop, setIsStop] = useState(false); //ok?

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
    }, 5000);
    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      mic.stop();
      setIsStop(true);

      mic.onend = () => {
        console.log("it ends");
        mic.stop();

        setSpeech(transcript);
        isWordValid(formerWord, transcript);
      };
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const startTheGame = () => {
    setIsRoundStart(!isRoundStart); //true
    const formerWord = getRandomWord();
    handleListen(formerWord);
  };

  const getRandomWord = () => {
    const randIndex = Math.floor(Math.random() * (trWords.length + 1));
    let randWord = trWords[randIndex];
    randWord = makeUpperCase(randWord);
    setSelectedWord(randWord);
    return randWord;
  };

  const handleStop = (isStop) => {
    setIsStop(isStop);
  };

  const isWordValid = (usedWords, latterWord) => {
    const formerWord = usedWords[usedWords.length - 1];
    let lastLetterOfFormerWord = formerWord.charAt(formerWord.length - 1);
    lastLetterOfFormerWord = makeLowerCase(lastLetterOfFormerWord);
    let firstLetterOfLatterWord = latterWord.charAt(0);
    firstLetterOfLatterWord = makeLowerCase(firstLetterOfLatterWord);
    const isPresent = usedWords.includes(latterWord);
    const isLettersEqual = lastLetterOfFormerWord === firstLetterOfLatterWord;

    console.log(latterWord);
    console.log(lastLetterOfFormerWord);
    console.log(firstLetterOfLatterWord);
    if (!isPresent && isLettersEqual) {
      console.log("game continue");
      setIsRoundStart(false);
      setIsStop(false);
      // setSpeech(null);
      startTheGame();
    } else console.log("game over");
  };

  return (
    <div>
      <button onClick={startTheGame}>Start Game</button>
      {isRoundStart && (
        <div>
          <h1>Former Word: {selectedWord}</h1>
          <h1>Latter Word: {speech}</h1>
          <Timer time={5} handleStop={handleStop} />
        </div>
      )}

      {isStop && <div>is stopped</div>}
    </div>
  );
};

export default App;
