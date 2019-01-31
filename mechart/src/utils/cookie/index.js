import { gbs } from '../settings';
import Cookies from 'js-cookie';
import {validateTips} from 'utils/tips';

class PcCookie {
  constructor () {
    this.pcPrefix = gbs.lockr_prefix;
    this.secretKey = gbs.secret_key;
    this.domain = gbs.domain;
    this.expireTime = 30;
  }

  setDomain(domain) {
    console.log('setDomain: ' + domain + ' this.domain: ' + this.domain);
    this.domain = domain;
    console.log('after------> setDomain: ' + domain + ' this.domain: ' + this.domain);
  }

  set (cookieParam) {
    let {key, value, expires, path, success} = cookieParam;
    PcCookie.checkKey(key);
    key = this.pcPrefix + key;
    Cookies.set(key, value, {expires: expires || this.expireTime, path: path || '/', domain: this.domain});
    success && success();
  }

  get (key) {
    PcCookie.checkKey(key);
    return Cookies.get(this.pcPrefix + key);
  }

  delete (cookieParam) {
    let {key, path, success} = cookieParam;
    PcCookie.checkKey(key);
    Cookies.remove(this.pcPrefix + key, {path: path || '/', domain: this.domain});
    success && success();
  }

  geteAll () {
    Cookies.get();
  }

  static checkKey (key) {
    if (!key) {
      throw new Error(validateTips.NO_KEY);
    }
    if (typeof key === 'object') {
      throw new Error(validateTips.KEY_NO_OBJECT);
    }
  }
}

export default new PcCookie();
