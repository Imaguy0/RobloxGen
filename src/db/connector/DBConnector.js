class DBConnector {
  /**
   * Sets up the database
   * @returns {Promise<boolean>} If the database was succesfully setup
   */
  async setupDB() {}

  /**
   * Adds an account into the database
   * @param  {number} userId
   * @param  {string} username
   * @param  {string} password
   * @param  {string} cookie
   */
  async addAccount(userId, username, password, cookie) {}

  /**
   * Gets a random ROBLOX account from the database
   * @returns {Promise<RobloxAccount>}
   */
  async getRandomAccount() {}

  /**
   * Gets all the ROBLOX accounts from the database
   * @returns {Promise<RobloxAccount[]>}
   */
  async getAllAccounts() {}
}

export default DBConnector;
