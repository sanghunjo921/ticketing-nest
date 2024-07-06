export const caculateTimeDifference = () => {
  const today = new Date();

  // 올해의 첫 날 (1월 1일)
  const startOfYear = new Date(today.getFullYear(), 0, 1);

  // 밀리초 단위의 차이 계산
  const diffTime = today.getTime() - startOfYear.getTime();

  // 밀리초를 일 단위로 변환
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // 몇 번째 주인지 계산
  const weekNumber = Math.ceil((diffDays + startOfYear.getDay() + 1) / 7);

  return weekNumber;
};
