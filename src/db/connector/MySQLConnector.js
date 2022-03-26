import mysql from 'mysql2/promise';
import DBConnector from './DBConnector.js';
import RobloxAccount from '../../rbx/RobloxAccount.js';

class MySQLConnector extends DBConnector {
  host;
  user;
  pass;
  database;

  /**
   * @type {mysql.Connection}
   */
  connection;

  /**
   * Connects to the MySQL database
   * @returns {Promise<boolean>} If the database was connected to succesfully
   */
  async _connect() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DB
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
  async setupDB() {
    if (!await this._connect()) {
      return false;
    }
    try {
      await this.connection.execute(`
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
  async addAccount(userId, username, password, cookie) {
    try {
      await this.connection.execute(
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
  async getRandomAccount() {
    const results = await this.connection.execute(
      'SELECT * FROM accounts ORDER BY rand() LIMIT 1'
    );

    const row = results[0][0];

    const account = new RobloxAccount(
      row.username,
      row.user_id,
      row.password,
      row.cookie
    );

    return account;
  }
  
}

export default new MySQLConnector();