export const makeUpperCase = (word, language) => {
  return word.charAt(0).toLocaleUpperCase(language) + word.slice(1);
};

export const makeLowerCase = (word, language) => {
  return word.charAt(0).toLocaleLowerCase(language) + word.slice(1);
};

export const getRandomValueFromArray = (array, language) => {
  const randIndex = Math.floor(Math.random() * (array.length + 1));
  let randValue = array[randIndex];
  randValue = makeUpperCase(randValue, language);
  return randValue;
};
