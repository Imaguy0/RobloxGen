import htmlParser from 'node-html-parser';
import fetch from 'node-fetch';
import RobloxAccount from './RobloxAccount.js';
import username from 'username-generator';
import UserAgent from 'random-useragent';
import { randomBirthday, randomGender } from './RobloxRandomizer.js';

export default class RobloxUtils {
  /**
   * Generates a valid ROBLOX CSRF token
   * @returns {Promise<string>} - The generated CSRF token
   */
  static async genRegisterCSRF() {
    const res = await fetch('https://roblox.com/');
    const txt = await res.text();
    const root = htmlParser.parse(txt);
    return root.querySelector('#rbx-body > meta').rawAttrs.split('"')[3];
  }
  /**
   * Checks if username it's available
   * @param  {string} username
   * @returns {Promise<boolean>}
   */
  static async checkUsername(username) {
    const url = 'https://auth.roblox.com/v1/usernames/validate';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'User-Agent': UserAgent.getRandom(),
        'x-csrf-token': await this.genRegisterCSRF(),
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        context: 'Signup',
        birthday: '1966-07-08T04:00:00.000Z'
      })
    });

    const json = await res.json();

    return json.code === 0;
  }

  /**
   * Generates a username
   * @returns {string} Username
   */
  static async genUsername() {
    let done = false;
    let usr;
    while (!done) {
      usr = username.generateUsername();
      done = await this.checkUsername(usr);
    }

    return usr;
  }
  /**
   * Generates a password
   * @returns {string} Password
   */
  static genPassword() {
    const letters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!!!!!!!!!@@@@@@@[[][][]][][];;;;;;;';
    const length = 20;
    let endStr = '';
    for (var i = 0; i < length; i++) {
      endStr += letters[Math.floor(Math.random() * (letters.length - 1))];
    }

    return endStr;
  }
  /**
   * Gets the field data of ROBLOX
   * @returns {Promise<string>}
   */
  static async getFieldData() {
    const res = await fetch('https://auth.roblox.com/v2/signup', {
      headers: {
        'user-agent': UserAgent.getRandom(),
        'x-csrf-token': await this.genRegisterCSRF(),
        'content-type': 'application/json'
      },
      body: '{}',
      method: 'POST'
    });

    const json = await res.json();
    const fieldData = json?.failureDetails?.[0]?.fieldData;

    if (!fieldData) {
      console.log('[❌] Failed to get field data!');
      return '';
    }

    return fieldData;
  }
  /**
   * Creates a ROBLOX account
   * @param  {string} captchaToken
   * @param  {string} captchaId
   * @returns {Promise<RobloxAccount>}
   */
  static async createAccount(captchaToken, captchaId) {
    const username = await this.genUsername();
    const password = this.genPassword();
    const url = 'https://auth.roblox.com/v2/signup';

    const payload = {
      agreementIds: [
        '54d8a8f0-d9c8-4cf3-bd26-0cbf8af0bba3',
        '848d8d8f-0e33-4176-bcd9-aa4e22ae7905'
      ],
      birthday: randomBirthday(),
      captchaProvider: 'PROVIDER_ARKOSE_LABS',
      captchaToken: captchaToken,
      context: 'MultiverseSignupForm',
      displayAvatarV2: false,
      displayContextV2: false,
      gender: randomGender(),
      isTosAgreementBoxChecked: true,
      password: password,
      referralDate: null,
      username: username,
      captchaId: captchaId
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'user-agent': UserAgent.getRandom(),
        'x-csrf-token': await this.genRegisterCSRF(),
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    const regex =
      /.ROBLOSECURITY=(_\|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.\|_[A-Za-z0-9]+)/g;
    const cookies = res.headers.get('set-cookie');

    const cookie = regex.exec(cookies)?.[1];

    if (!cookie) {
      console.log(`[❌] Failed to find a cookie in the response!\n${JSON.stringify(json)}`);
      return null;
    }

    const account = new RobloxAccount(username, json.userId, password, cookie);

    return account;
  }
}
