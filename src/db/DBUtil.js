import RobloxAccount from '../rbx/RobloxAccount.js';
import MySQLConnector from './connector/MySQLConnector.js';
import VeduConnector from './connector/VeduConnector.js';
import DBConnector from './connector/DBConnector.js';
import FileConnector from './connector/FileConnector.js';

/**
 * @type {DBConnector}
 */
let connector;
let connectorType;

switch (process.env.DB_TYPE) {
  case 'mysql':
    connector = MySQLConnector;
    connectorType = 'mysql';
    break;
  case 'file':
    connector = FileConnector;
    connectorType = 'file';
    break;
  case 'vedu':
  default:
    connector = VeduConnector;
    connectorType = 'vedu';
    break;
}

console.log('[➖] Using DB type ' + connectorType);

class DBUtil {
  constructor() {}

  /**
   * Initalize the VeduDB database
   * @returns {Promise<boolean>}
   */
  async setupDB() {
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
  async addAccount(userId, username, password, cookie) {
    return await connector.addAccount(userId, username, password, cookie);
  }

  /**
   * Gets a random ROBLOX account from the database
   * @returns {Promise<RobloxAccount>}
   */
  async getRandomAccount() {
    return await connector.getRandomAccount();
  }

  /**
   * Gets all accounts from the database
   * @returns {Promise<RobloxAccount[]>}
   */
  async getAllAccounts() {
    return await connector.getAllAccounts();
  }
}

export default new DBUtil();
