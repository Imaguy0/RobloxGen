import rl from 'readline-sync';
import fs from 'fs';
import fetch from 'node-fetch'
import ProxyAgent from 'proxy-agent'

const proxiesFile = 'proxies.txt';
const proxyRegex = new RegExp('^(?:(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(?:https?://)?(?![\d.]+:)\w+(?:\.\w+)*:\d+\S+|\w+:\w+@(?![\d.]+:)\w+(?:\.\w+)*:\d+)$');
const scrape_urls = [
  {
    name: 'TheSpeedX Proxy List',
    url: 'https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt'
  }
];

class ProxySystem {
  /**
   * @type {string[]}
   */
  proxies;
  /**
   * @type {number}
   */
  index = 0;

  /**
   * Loads the proxies from a proxies.txt or prompts the user
   * to download it from a list of APIs otherwise.
   * @returns {Promise<boolean>} If the proxies were loaded succesfully
   */
  async loadProxies() {
    if (fs.existsSync(proxiesFile)) {
      const proxiesText = fs.readFileSync(proxiesFile, 'utf-8');
      this.proxies = proxiesText.split(/\n|\r\n/g);
    } else {
      console.log('[❌] No proxies file found');
      console.log('[❓] Would you like to fetch new proxies? (y/n)');

      if (!rl.prompt().startsWith('y')) {
        console.log('[❌] Terminated by user');
        return false;
      }

      // Show the available proxy APIs
      console.log('Choose a proxy API:');
      for (let i = 0; i < scrape_urls.length; i++) {
        console.log(`[${i}] ${scrape_urls[i].name}`);
      }

      const proxyChoice = Number.parseInt(rl.prompt());
      if (Number.isNaN(proxyChoice)) {
        console.log('[❌] Input is not a number');
        return false;
      }

      if (proxyChoice < 0 || proxyChoice >= scrape_urls.length) {
        console.log('[❌] Invalid choice');
        return false;
      }

      const selectedUrl = scrape_urls[proxyChoice].url;

      console.log(`[➖] Fetching proxies from ${selectedUrl}`);

      const res = await fetch(selectedUrl);

      if (!res.ok) {
        console.log('[❌] Failed to fetch proxies');
        return false;
      }

      const proxiesStr = await res.text();

      this.proxies = proxiesStr.split(/\n|\r\n/);
    }

    if (this.proxies.length === 0) {
      console.log('[❌] No valid proxies available');
      return false;
    }

    this.removeInvalidProxies();

    console.log(`[✅] ${this.proxies.length} proxies loaded`);

    return true;
  }

  /**
   * Removes invalid proxies from the list
   */
  removeInvalidProxies() {
    this.proxies = this.proxies.filter(proxy => {
      return proxyRegex.test(proxy) || true;
    });
  }

  /**
   * Get the currently selected proxy
   * @returns {string} The currently selected proxy
   */
  getProxy() {
    return this.proxies[this.index];
  }

  /**
   * Creates a proxy agent from the selected proxy
   * @returns {ProxyAgent.ProxyAgent} The selected proxy agent
   */
  getProxyAgent() {
    console.log('[➖] Current proxy: ' + this.getProxy());
    return ProxyAgent(this.getProxy());
  }

  /**
   * Moves the cursor right (or to the start) of the proxies array
   */
  rotateProxy() {
    this.index++;
    console.log('[➖] Proxy rotated');
    if (this.index >= this.proxies.length) {
      console.log('[➖] Rotating back to first proxy');
      this.index = 0;
    }
  }
}

export default new ProxySystem();
