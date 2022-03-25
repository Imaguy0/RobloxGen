import mysql from 'mysql2/promise';
import RobloxAccount from '../../rbx/RobloxAccount.js';
import { Account } from './Account';

export default class MySQLConnector {
  host: string | undefined;
  user: string | undefined;
  pass: string | undefined;
  database: string | undefined;

  connection: mysql.Connection | undefined;

  constructor() {
    this.host = process.env.DB_HOST;
    this.user = process.env.DB_USER;
    this.pass = process.env.DB_PASS;
    this.database = process.env.DB_DB;

    this.connection = undefined;
  }

  /**
   * Connects to the MySQL database
   * @returns {Promise<boolean>} If the database was connected to succesfully
   */
  async _connect(): Promise<boolean> {
    try {
      this.connection = await mysql.createConnection({
        host: this.host,
        user: this.user,
        password: this.pass,
        database: this.database
      });

      console.log('[✅] Connected to the database');
      return true;
    } catch (ex) {
      console.log(`[❌] Failed to connect to the database (${ex})`);
      return false;
    }
  }

  /**
   * Sets up the MySQL database
   * @returns {Promise<boolean>} If the database was succesfully setup
   */
  async setupDB(): Promise<boolean> {
    if (!(await this._connect())) {
      return false;
    }
    try {
      await this.connection!.execute(`
            CREATE TABLE \`accounts\` (
                id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
                user_id BIGINT NOT NULL,
                username VARCHAR(30) NOT NULL,
                password VARCHAR(30) NOT NULL,
                cookie VARCHAR(900) NOT NULL
            );`);
      console.log('[✅] Created accounts table');
    } catch (ex) {}

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
      await this.connection!.execute(
        'INSERT INTO `accounts` (user_id, username, password, cookie) VALUES (?, ?, ?, ?)',
        [userId, username, password, cookie]
      );
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
    const results = await this.connection!.execute(
      'SELECT * FROM accounts ORDER BY rand() LIMIT 1'
    );

    const row: Account = results[0][0];

    const account = new RobloxAccount(
      row.username,
      row.user_id,
      row.password,
      row.cookie
    );

    return account;
  }

  /**
   * Gets all accounts from the database
   * @returns {Promise<Account[]>}
   */
  async getAllAccounts(): Promise<Account[]> {
    const results = await this.connection!.execute('SELECT * FROM accounts');

    return results[0][0];
  }
}
