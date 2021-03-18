import React, { useState, useEffect, useRef } from "react";
import trWords from "../wordsData/trWords";
import "./App.css";
import Timer from "./Timer";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "tr";

const App = () => {
  const [isGameStart, setIsGameStart] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speech, setSpeech] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);
  const [isStop, setIsStop] = useState(false);
  const [usedWords, setUsedWords] = useState([]);
  // const test = useRef(selectedWord);

  useEffect(() => {
    getRandomWord();
  }, [isGameStart]);

  useEffect(() => {
    handleListen();
    isWordValid(usedWords, speech);
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        setIsStop(true);
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };
    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      if (transcript) {
        setSpeech(transcript);
        mic.stop();
        console.log(transcript);
      }
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const startTheGame = () => {
    setIsGameStart(!isGameStart); //true
    setIsListening(!isListening); //true
  };

  const getRandomWord = () => {
    if (isGameStart) {
      const randIndex = Math.floor(Math.random() * (trWords.length + 1));
      const randWord = trWords[randIndex];
      addSelectedWordToUsedWords(randWord);
      setSelectedWord(randWord);
    }
  };

  const handleStop = (isStop) => {
    setIsStop(isStop);
    setIsListening(false);
  };

  const isWordValid = (usedWords, latterWord) => {
    const isPresent = usedWords.includes(latterWord);
    // if (!isPresent) {
    // startTheGame();
    // } else console.log("game over");
  };

  const addSelectedWordToUsedWords = (word) => {
    // const selectedWord = trWords.indexOf(word);
    const array = [...usedWords, word];
    setUsedWords(array);
  };

  return (
    <div>
      <button onClick={startTheGame}>Start Game</button>

      {/* <button onClick={() => setIsListening(!isListening)}>
        Start Listening
      </button> */}
      {isGameStart && (
        <div>
          <h1>{selectedWord}</h1>
          <Timer time={5} handleStop={handleStop} isStop={isStop} />
        </div>
      )}
      {isStop && <div>is stopped</div>}
    </div>
  );
};

export default App;
