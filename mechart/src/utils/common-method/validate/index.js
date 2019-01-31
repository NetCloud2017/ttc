import Vue from 'vue';
import {validateTips} from 'utils/tips';
// 校验角色名
export let checkRoleName = (rule, value, callback) => {
  if (value !== '') {
    let reg = /^[\u4e00-\u9faf]+$/;
    let val = reg.test(value);
    if (val !== true) {
      callback(new Error(validateTips.ONLY_CHINESE));
    } else {
      callback();
    }
  } else {
    callback(new Error(validateTips.NOT_EMPTY));
  }
};
// 校验登录名
let checkLoginName = (rule, value, callback) => {
  if (value !== '' && value !== undefined && value !== null) {
    let reg = /^[A-Za-z0-9_]{6,16}$/;
    let val = reg.test(value);
    if (val !== true) {
      callback(new Error(validateTips.RIGHT_FORMAT));
    } else {
      Vue.prototype.$http({
        method: 'POST',
        url: `/uac/user/checkLoginName`,
        data: {
          loginName: value
        }
      }).then((res) => {
        if (res.result === false) {
          callback(new Error(validateTips.USER_EXIST));
        } else {
          callback();
        }
      });
    }
  } else {
    callback(new Error(validateTips.NOT_EMPTY));
  }
};
// 校验email
let checkEmail = (rule, value, callback) => {
  if (value !== '' && value !== undefined && value !== null) {
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    let val = reg.test(value);
    if (val !== true) {
      callback(new Error(validateTips.RIGHT_FORMAT));
    } else {
      Vue.prototype.$http({
        method: 'POST',
        url: '/uac/user/checkEmail',
        data: {
          email: value
        }
      }).then((res) => {
        if (res.result === false) {
          callback(new Error(validateTips.EMAIL_EXIST));
        } else {
          callback();
        }
      });
    }
  } else {
    callback(new Error(validateTips.NOT_EMPTY));
  }
};
// 校验手机号
let checkMobileNo = (rule, value, callback) => {
  if (value !== '' && value !== undefined && value !== null) {
    let reg = /^1\d{10}$/;
    let val = reg.test(value);
    if (val !== true) {
      callback(new Error(validateTips.RIGHT_PHONE));
    } else {
      // this.$http({
      //   method: 'POST',
      //   url: '/uac/user/checkUserPhone',
      //   data: {
      //     userId: this.formData.id,
      //     mobileNo: this.formData.mobileNo
      //   }
      // }).then((res) => {
      //   if (res.result === false) {
      //     callback(new Error('手机号已存在'));
      //   } else {
      //     callback();
      //   }
      // });
      callback();
    }
  } else {
    callback(new Error(validateTips.NOT_EMPTY));
  }
};

// 号码非必填时  去除非空校验
let checkMobileNoFalse = (rule, value, callback) => {
  if (value !== '' && value !== undefined && value !== null) {
    let reg = /^1\d{10}$/;
    let val = reg.test(value);
    if (val !== true) {
      callback(new Error(validateTips.RIGHT_PHONE));
    } else {
      // this.$http({
      //   method: 'POST',
      //   url: '/uac/user/checkUserPhone',
      //   data: {
      //     userId: this.formData.id,
      //     mobileNo: this.formData.mobileNo
      //   }
      // }).then((res) => {
      //   if (res.result === false) {
      //     callback(new Error('手机号已存在'));
      //   } else {
      //     callback();
      //   }
      // });
      callback();
    }
  } else {
    callback();
  }
};

// 校验联系人号码是否符合规则要求
let checkContactNumber = (rule, value, callback) => {
  // console.log(JSON.stringify(rule));
  let message;
  if (rule && rule.message) {
    message = rule.message;
  }
  if (stringIsNullOrEmpty(value)) {
    if (typeof callback === 'function') {
      callback(message || validateTips.FILL_BASE_INFO);
    }
    return false;
  }
  let reg = /^[0-9]*[1-9][0-9]*$/;
  let val = reg.test(value);
  if (val && (value.length === 11 || value.length === 12)) {
    if (typeof callback === 'function') {
      callback();
    }
    return true;
  } else {
    if (typeof callback === 'function') {
      callback(message || validateTips.RIGHT_CONTACT_PHONE);
    }
    return false;
  }
};
// 校验数字
let checkNum = (rule, value, callback) => {
  if (!value) {
    return callback(new Error(validateTips.NOT_EMPTY));
  }
  let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
  if (!reg.test(value)) {
    callback(new Error(validateTips.NUM_TOFIXED_2));
  } else {
    callback();
  }
};

// 校验整数
let verifyInteger = (val, prop) => {
  console.log(JSON.stringify(val));
  let value = val[prop] + '';
  value = value.replace(/[^\d]/g, '');  // 清除“数字”以外的字符
  if (value !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    val[prop] = parseInt(value);
  } else {
    val[prop] = '';
  }
};

// 校验小数
let verifyDecimal = (val, prop) => {
  let value = val[prop] + '';
  value = value.replace(/[^\d.]/g, '');  // 清除“数字”和“.”以外的字符
  value = value.replace(/\.{2,}/g, '.'); // 只保留第一个. 清除多余的
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  value = value.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
  val[prop] = value;
  if (value.indexOf('.') < 0 && value !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    val[prop] = parseFloat(value);
  }
  if (value.startsWith('.')) { // 如果是以小数点开始则在小数点前自动补0
    val[prop] = '0' + val[prop];
  }
};

// 将数字字符串转换成数字
let convertToNumber = (val) => {
  let reg = /^[0-9]+.?[0-9]*$/; // 判断字符串是否为数字
  let isNumber = reg.test(val);
  return isNumber ? Number(val) : null;
};

export let checkLiscence = (rule, value, callback) => {
  if (value !== '') {
    let reg = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/;
    let val = reg.test(value);
    if (val !== true) {
      callback(new Error(validateTips.LISCENCE));
    } else {
      callback();
    }
  } else {
    callback(new Error(validateTips.NOT_EMPTY));
  }
};

export let checkBuyDay = (rule, value, callback) => {
  let reg = /^[0-9]*$/;
  if (!reg.test(value)) {
    callback(new Error('请输入数字'));
  }
  if (value === '') {
    callback(new Error('请输入回购期限'));
  } else if (Number(value) < 15) {
    callback(new Error('回购期限不能小于15'));
  } else if (Number(value) > 90) {
    callback(new Error('回购期限不能大于90'));
  } else {
    callback();
  }
};
/**
 * 判断字符串是否undefine或者为‘’
 * @param value
 * @returns {boolean}
 */
let stringIsNullOrEmpty = (value) => {
  return (!value || value === '');
};

/**
 * 判断数组是否undefine或者长度为0
 * @param value
 * @returns {boolean}
 */
let arrayIsNullOrEmpty = (value) => {
  return (!value || value.length === 0);
};
// 校验数组不能为空
let checkArray = (rule, value, callback) => {
  let message;
  if (rule && rule.message) {
    message = rule.message;
  }
  if (arrayIsNullOrEmpty(value)) {
    callback(new Error(message || '数组不能为空'));
  } else {
    callback();
  }
};
export default{
  checkRoleName,
  checkLoginName,
  checkEmail,
  checkMobileNo,
  checkMobileNoFalse,
  checkContactNumber,
  checkNum,
  stringIsNullOrEmpty,
  arrayIsNullOrEmpty,
  verifyInteger,
  verifyDecimal,
  convertToNumber,
  checkLiscence,
  checkBuyDay,
  checkArray
};
