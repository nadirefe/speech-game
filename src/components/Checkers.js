import { makeUpperCase, makeLowerCase } from "./Helpers";
import trWords from "../wordsData/trWords";

export const checkIsWordUsed = (word) => {
  word = makeUpperCase(word);
  const usedWordsArr = JSON.parse(sessionStorage.getItem("usedWords"));
  const isWordUsed = usedWordsArr.includes(word);
  return isWordUsed;
};

export const checkIsWordInList = (word) => {
  const isWordInList = trWords.includes(word);
  return isWordInList;
};

export const checkLettersAreEqual = (formerWord, latterWord) => {
  let lastLetterOfFormerWord = formerWord.charAt(formerWord.length - 1);
  lastLetterOfFormerWord = makeLowerCase(lastLetterOfFormerWord);
  let firstLetterOfLatterWord = latterWord.charAt(0);
  firstLetterOfLatterWord = makeLowerCase(firstLetterOfLatterWord);
  const areLettersEqual = lastLetterOfFormerWord === firstLetterOfLatterWord;
  return areLettersEqual;
};
