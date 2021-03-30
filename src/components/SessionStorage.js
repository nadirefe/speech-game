export const addUsedWordsToSS = (word) => {
  let usedWordsArr = sessionStorage.getItem("usedWords");
  if (!usedWordsArr) {
    sessionStorage.setItem("usedWords", JSON.stringify([word]));
  } else {
    usedWordsArr = JSON.parse(usedWordsArr);
    usedWordsArr = [...usedWordsArr, word];
    sessionStorage.setItem("usedWords", JSON.stringify(usedWordsArr));
  }
};
