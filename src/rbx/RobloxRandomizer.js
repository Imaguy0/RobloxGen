const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomBirthday() {
  const randomDay = randomBetween(1, 28); // 28 incase february
  const randomMonth = months[Math.floor(Math.random() * months.length)];
  const randomYear = randomBetween(1923, new Date().getFullYear()); // 1923 to current year

  return `${randomDay} ${randomMonth} ${randomYear}`;
}

function randomGender() {
  return randomBetween(1, 2);
}

function randomUserAgent() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const version = randomBetween(0, 9) + '.' + randomBetween(0, 9);

  let endStr = '';

  for (let i = 0; i < randomBetween(8, 13); i++) {
    endStr += chars[Math.floor(Math.random() * chars.length)];
  }

  endStr += '/' + version;

  return endStr;
}

export { randomBirthday, randomGender };
