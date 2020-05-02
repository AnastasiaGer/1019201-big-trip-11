const MINUTES_PER_HOUR = 60;

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

export const getDurationTime = (timeInMs) => {
  const days = Math.floor(timeInMs / (1000 * MINUTES_PER_HOUR * MINUTES_PER_HOUR * 24)).toString().padStart(2, `0`);
  const hours = (Math.floor(timeInMs / (1000 * MINUTES_PER_HOUR * MINUTES_PER_HOUR)) % 24).toString().padStart(2, `0`);
  const minutes = (Math.floor(timeInMs / (1000 * MINUTES_PER_HOUR)) % MINUTES_PER_HOUR).toString().padStart(2, `0`);
  const modifiedDays = days > 0 ? `${days}D ` : ``;
  let modifiedHours = `${hours}H `;

  if (days === 0) {
    modifiedHours = hours > 0 ? `${hours}H ` : ``;
  }

  return `${modifiedDays}${modifiedHours}${minutes}M`;
};