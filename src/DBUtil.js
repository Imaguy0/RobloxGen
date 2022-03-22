import veduDb from '@vedux/vedudb';
import RobloxAccount from './rbx/RobloxAccount.js';

class DBUtil {
  constructor() {}

  /**
   * Initalize the VeduDB database
   * @param {string} _database Give the database a file name like, database.json
   * @returns {Promise<boolean>}
   */
  async setupDB(_database) {
    try {
      this.database = new veduDb(_database);
    } catch (e) {
      return new TypeError('Please provide a valid databse name!');
    }
  }

  /**
   * Adds an account into the database
   * @param  {number} userId
   * @param  {string} username
   * @param  {string} password
   * @param  {string} cookie
   * @returns {Promise<void>}
   */
  async addAccount(userId, username, password, cookie) {
    try {
      await this.database.set(username, {
        username: username,
        userId: userId,
        password: password,
        cookie: cookie
      });

      console.log(`[✅] Account ${username} inserted into the database!`);
    } catch (err) {
      console.log('[❌] Error inserting account: ' + err);
    }
  }

  /**
   * Gets a random ROBLOX account from the database
   * @returns {Promise<RobloxAccount>}
   */
  async getRandomAccount() {
    /**
     * Counts properties
     * @param  {object} obj
     * @return {number}
     */
    function countProperties(obj) {
      var count = 0;

      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) ++count;
      }

      return count;
    }
    /**
     * Finds a random account
     * @param  {object} obj
     * @param  {number} countt
     */
    function findRandom(obj, countt) {
      var count = 0;
      var data;
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          count++;
          data = obj[prop];
        }
        if (count === countt) break;
      }

      return data;
    }

    let accountList = this.database.fetchAll();
    let count = countProperties(await accountList);

    let random = Math.floor(Math.random() * count);
    let randomAcc = findRandom(await accountList, random);

    return randomAcc;
  }

  /**
   * Gets all accounts from the database
   * @returns {Promise<RobloxAccount[]>}
   */
  async getAllAccounts() {
    return this.database.fetchAll();
  }
}

export default new DBUtil();
