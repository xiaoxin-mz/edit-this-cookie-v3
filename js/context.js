import { Storage } from './browser/storage.js';
import { Tabs } from './browser/tabs.js';

export const Context = ({ httpClient, exceptionHandler, config }) => {
  let clientId = null;
  let isFreshInstall = false;
  const browser = chrome;
  const { runtime } = browser;
  const manifest = runtime.getManifest();
  const dnr = browser.declarativeNetRequest;
  const { i18n } = browser;
  const storage = Storage({ context: browser });
  const tabs = Tabs({ context: browser });
  const actions = Actions({ context: browser, config, dnr });
  const broker = Broker({ context: browser, exceptionHandler });
  const scriptingService = ScriptingService({
    exceptionHandler,
    context: browser,
  });

  return {
    async setClientId() {
      let storedClientId = await storage.getItem('clientId');
      if (storedClientId) return storedClientId;
      storedClientId = self.crypto.randomUUID();
      await storage.setItem('clientId', storedClientId);
      isFreshInstall = true;
      return storedClientId;
    },
    async init() {},
    get browser() {
      return browser;
    },
    get broker() {
      return broker;
    },
    get manifest() {
      return manifest;
    },
    get dnr() {
      return dnr;
    },
    get i18n() {
      return i18n;
    },
    get storage() {
      return storage;
    },
    get tabs() {
      return tabs;
    },
    get runtime() {
      return runtime;
    },
    get config() {
      return config;
    },
    get isFreshInstall() {
      return isFreshInstall;
    },
    get adsQueue() {
      return adsQueue;
    },
  };
};
