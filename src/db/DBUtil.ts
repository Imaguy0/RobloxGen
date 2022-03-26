import RobloxAccount from '../rbx/RobloxAccount.js';
import { Account } from './connector/Account.js';
import MySQLConnector from './connector/MySQLConnector.js';
import VeduConnector from './connector/VeduConnector.js';

var connector: VeduConnector | MySQLConnector;
var connectorType: 'mysql' | 'vedu';

switch (process.env.DB_TYPE) {
  case 'mysql':
    connector = new MySQLConnector();
    connectorType = 'mysql';
    break;
  case 'vedu':
  default:
    connector = new VeduConnector();
    connectorType = 'vedu';
    break;
}

console.log('[➖] Using DB type ' + connectorType);

class DBUtil {
  /**
   * Initalize the VeduDB database
   * @returns {Promise<boolean>}
   */
  async setupDB(): Promise<boolean> {
    return await connector.setupDB();
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
    return await connector.addAccount(userId, username, password, cookie);
  }

  /**
   * Gets a random ROBLOX account from the database
   * @returns {Promise<RobloxAccount>}
   */
  async getRandomAccount(): Promise<RobloxAccount> {
    return await connector.getRandomAccount();
  }

  /**
   * Gets all accounts from the database
   * @returns {Promise<Account[] | RobloxAccount[]>}
   */
  async getAllAccounts(): Promise<Account[] | RobloxAccount[]> {
    return await connector.getAllAccounts();
  }
}

export default new DBUtil();
