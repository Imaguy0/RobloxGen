export default class RobloxAccount {
  username: string;
  userId: number;
  password: string;
  cookie: string;

  /**
   * @param  {string} username
   * @param  {number} userId
   * @param  {string} password
   * @param  {string} cookie
   */

  constructor(
    username: string,
    userId: number,
    password: string,
    cookie: string
  ) {
    this.username = username;
    this.userId = userId;
    this.password = password;
    this.cookie = cookie;
  }
}
