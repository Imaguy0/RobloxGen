import randomUseragent from 'random-useragent';

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

/**
 * Generates a number between the two parameters
 * @param  {number} min
 * @param  {number} max
 * @returns {number} Random number between min and max
 */
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Generates a random birthday
 * @returns {string} Birthday
 */
function randomBirthday() {
  const randomDay = randomBetween(1, 28); // 28 incase february
  const randomMonth = months[Math.floor(Math.random() * months.length)];
  const randomYear = randomBetween(1923, new Date().getFullYear() - 14); // 1923 to (subtract 14 from current year)

  return `${randomDay} ${randomMonth} ${randomYear}`;
}

/**
 * Generates a random gender
 * @returns {number} Gender
 */
function randomGender() {
  return randomBetween(1, 2);
}

/**
 * Generate a random user agent
 * @returns {string} User Agent
 * @deprecated Not in use
 */
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

/**
 * Generates a random user agent
 * @returns {string} User Agent
 */
const generateUseragent = () => randomUseragent.getRandom();

export { randomBirthday, randomGender, generateUseragent };
