export const caculateTimeDifference = () => {
  const today = new Date();

  const diffTime = today.getTime() / (1000 * 3600 * 24);
  return Math.ceil(diffTime / 7);
};
