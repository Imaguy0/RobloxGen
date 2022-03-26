import veduDb from '@vedux/vedudb';
import RobloxAccount from '../../rbx/RobloxAccount';

export default class VeduConnector {
  database: any;
  /**
   * Initalize the VeduDB database
   * @returns {Promise<boolean>}
   */
  async setupDB(): Promise<boolean> {
    try {
      this.database = new veduDb('database.json');
      console.log(`[✅] Vedu database setup`);
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
  async addAccount(
    userId: number,
    username: string,
    password: string,
    cookie: string
  ): Promise<void> {
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
  async getRandomAccount(): Promise<RobloxAccount> {
    /**
     * Counts properties
     * @param  {object} obj
     * @return {number}
     */
    function countProperties(obj: object): number {
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
    function findRandom(obj: any, countt: number) {
      var count = 0;
      var data: any;
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
  async getAllAccounts(): Promise<RobloxAccount[]> {
    return await this.database.fetchAll();
  }
}
