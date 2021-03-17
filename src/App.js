import React, { useState, useEffect } from "react";

// const recognition = new SpeechRecognition();
// window.SpeechRecognition =
//   window.webkitSpeechRecognition || window.SpeechRecognition;

// const recognition = new SpeechRecognition();

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

const App = () => {
  const [isListening, setIsListening] = useState(false);
  const [speech, setSpeech] = useState(null);
  // const [savedSpeech, setSavedSpeech] = useState([]);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stopped Mic on Click");
        console.log(speech);
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
      setSpeech(transcript);

      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  return (
    <div>
      App
      <button onClick={() => setIsListening(!isListening)}>Start/Stop</button>
    </div>
  );
};

export default App;
