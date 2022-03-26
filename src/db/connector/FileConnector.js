import fs from 'fs';
import writeFileAtomic from 'write-file-atomic';
import RobloxAccount from '../../rbx/RobloxAccount.js';

class FileConnector {
  database = [];
  currentData = '';

  /**
   * Sets up the database
   * @returns {Promise<boolean>} If the database was succesfully setup
   */
  async setupDB() {
    try {
      if (!fs.existsSync('accounts.txt')) {
        fs.writeFileSync('accounts.txt', '');
      }
      this.currentData = fs.readFileSync('accounts.txt', 'utf-8');
      return true;
    } catch (err) {
      console.log(`[❌] Failed to create file accounts.txt (${err})`);
      return;
    }
  }

  /**
   * Adds an account into the database
   * @param  {number} userId
   * @param  {string} username
   * @param  {string} password
   * @param  {string} cookie
   */
  async addAccount(userId, username, password, cookie) {
    this.currentData += `${userId} ${username} ${password} ${cookie}\n`;
    await writeFileAtomic('accounts.txt', this.currentData);

    console.log(`[✅] Account ${username} inserted into the database!`);
  }

  /**
   * Gets a random ROBLOX account from the database
   * @returns {Promise<RobloxAccount>}
   */
  async getRandomAccount() {
    const accounts = this._getSplitAccounts();

    if (accounts.length === 0) {
      return null;
    }

    const entry = accounts[Math.floor(Math.random() * accounts.length)];
    const entryData = entry.split(' ');

    return new RobloxAccount(
      entryData[0],
      entryData[1],
      entryData[2],
      entryData[3]
    );
  }

  /**
   * Gets all the ROBLOX accounts from the database
   * @returns {Promise<RobloxAccount[]>}
   */
  async getAllAccounts() {
    const fileAccounts = this._getSplitAccounts();
    const accounts = [];

    for (const account of fileAccounts) {
      const accountData = account.split(' ');
      accounts.push(
        new RobloxAccount(
          accountData[0],
          accountData[1],
          accountData[2],
          accountData[3]
        )
      );
    }

    return accounts;
  }

  /**
   * Gets the split accounts from the file
   * @returns {string[]} An array of accounts with values split by ' '
   */
  _getSplitAccounts() {
    const accounts = this.currentData.replace(/\r\n|\n+$/, '').split(/\n|\r\n/); // remove final newline

    return accounts;
  }
}

export default new FileConnector();
