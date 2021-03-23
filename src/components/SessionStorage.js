export const addUsedWordsToSS = (word) => {
  let usedWordsArr = sessionStorage.getItem("usedWords");
  usedWordsArr = JSON.parse(usedWordsArr);
  usedWordsArr = [...usedWordsArr, word];
  sessionStorage.setItem("usedWords", JSON.stringify(usedWordsArr));
};
