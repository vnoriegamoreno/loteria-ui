export const getLoteriaRand = () => {
  let num = Math.floor(Math.random() * 54) + 1;
  return num < 10 ? `0${num}` : num;
};
