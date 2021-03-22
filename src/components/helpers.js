export const makeUpperCase = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const makeLowerCase = (word) => {
  return word.charAt(0).toLowerCase() + word.slice(1);
};

export const getRandomValueFromArray = (array) => {
  const randIndex = Math.floor(Math.random() * (array.length + 1));
  let randValue = array[randIndex];
  randValue = makeUpperCase(randValue);
  return randValue;
};
