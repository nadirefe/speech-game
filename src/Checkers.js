import { makeUpperCase, makeLowerCase } from "./Helpers";

export const checkIsWordUsed = (word, language) => {
  word = makeUpperCase(word, language);
  const usedWordsArr = JSON.parse(sessionStorage.getItem("usedWords"));
  if (usedWordsArr) {
    const isWordUsed = usedWordsArr.includes(word);
    return isWordUsed;
  } else {
    return false;
  }
};

export const checkIsWordInList = (word, nameList) => {
  const isWordInList = nameList.includes(word);
  return isWordInList;
};

export const checkLettersAreEqual = (formerWord, latterWord, language) => {
  let lastLetterOfFormerWord = formerWord.charAt(formerWord.length - 1);
  lastLetterOfFormerWord = makeLowerCase(lastLetterOfFormerWord, language);
  let firstLetterOfLatterWord = latterWord.charAt(0);
  firstLetterOfLatterWord = makeLowerCase(firstLetterOfLatterWord, language);
  const areLettersEqual = lastLetterOfFormerWord === firstLetterOfLatterWord;
  return areLettersEqual;
};

export const checkComputerLost = (word, answerProb) => {
  const num = Math.random();
  const isWordUsed = checkIsWordUsed(word);
  if (num < answerProb || isWordUsed) {
    return true;
  } else {
    return false;
  }
};
