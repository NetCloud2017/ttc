import { gbs } from '../settings';
import Lockr from 'lockr';
import {validateTips} from 'utils/tips';
Lockr.prefix = gbs.lockr_prefix;

class PcLockr {
  constructor () {
    this.pcPrefix = gbs.lockr_prefix;
    this.secretKey = gbs.secret_key;
  }

  set (key, value, fn) {
    PcLockr.checkKey(key);
    Lockr.set(key, value);
    fn && fn();
  }

  get (key) {
    PcLockr.checkKey(key);
    return Lockr.get(key);
  }

  delete (key, fn) {
    PcLockr.checkKey(key);
    Lockr.rm(this.pcPrefix + key);
    fn && fn();
  }

  add (key, value, fn) {
    PcLockr.checkKey(key);
    Lockr.sadd(key, value);
    fn && fn();
  }

  getList (key) {
    PcLockr.checkKey(key);
    return Lockr.smembers(key);
  }

  contains (key, value, fn) {
    PcLockr.checkKey(key);
    return Lockr.sismember(key, value);
  }

  remove (key, value, fn) {
    PcLockr.checkKey(key);
    Lockr.srem(key, value);
    fn && fn();
  }

  removeAll (key, fn) {
    PcLockr.checkKey(key);
    let smembers = Lockr.smembers(key);
    for (let index in smembers) {
      Lockr.srem(key, smembers[index]);
    }
    fn && fn();
  }

  clear (fn) {
    Lockr.flush();
    fn && fn();
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

export default new PcLockr();
