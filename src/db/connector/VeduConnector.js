import veduDb from '@vedux/vedudb';
import DBConnector from './DBConnector.js';
import RobloxAccount from '../../rbx/RobloxAccount.js';

class VeduConnector extends DBConnector {
  /**
   * Initalize the VeduDB database
   * @returns {Promise<boolean>}
   */
  async setupDB() {
    try {
      this.database = new veduDb('database.json');
    } catch (err) {
      console.log(`[❌] Unexpected vedu error (${err})`);
      return false;
    }

    return true;
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
      await this.database.set(userId.toString(), {
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

    let accountList = await this.getAllAccounts();
    let count = countProperties(accountList);

    let randomAcc = findRandom(accountList, Math.floor(Math.random() * count));

    return randomAcc;
  }

  /**
   * Gets all accounts from the database
   * @returns {Promise<RobloxAccount[]>}
   */
  async getAllAccounts() {
    return await this.database.fetchAll();
  }
}

export default new VeduConnector();
