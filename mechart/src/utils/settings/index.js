const gbs = {
  host: process.env.GBS_HOST,
  lockr_prefix: 'MALICLOUD_PAAS_',
  secret_key: '^#rwd6Ffz$X5alRN',
  domain: process.env.GBS_DOMAIN,
  api_host: process.env.API_ROOT, //  // 'http://api.malicloud.net:8080',
  secret: {
    key_str: '^#rwd6Ffz$X5alRN',
    iv_str: '^#rwd6Ffz$X5alRN'
  }
};
const cbs = {};

if (process.env.NODE_ENV !== 'production') {
  gbs.lockr_prefix += 'DEV_';
}
gbs.domain = process.env.GBS_DOMAIN; // '.malicloud.net';
gbs.api_host = process.env.API_ROOT;
const enums = {
  USER: {
    LOGIN_NAME: 'LOGIN_NAME',
    USER_NAME: 'USER_NAME',
    ROLE_ID: 'ROLE_ID',
    MENU_LIST: 'MENU_LIST',
    AUTH_TOKEN: 'AUTH_TOKEN',
    REFRESH_TOKEN: 'REFRESH_TOKEN',
    REMEMBER_ME: 'REMEMBER_ME',
    REDIRECT_URI: 'REDIRECT_URI',
    SHOW_PADDING_TASK_POINT: 'SHOW_PADDING_TASK_POINT',
    SHOW_NOTICE_POINT: 'SHOW_NOTICE_POINT',
    USER_PERMISSIONS: 'USER_PERMISSIONS',
    COMPANY_STATUS: 'COMPANY_STATUS'
  },
  BROWSER: {
    BROWSER_WIDTH: 'BROWSER_WIDTH',
    BROWSER_HEIGHT: 'BROWSER_HEIGHT',
    LEFT_MENU_WIDTH: 'LEFT_MENU_WIDTH',
    RIGHT_CONTENT_WIDTH: 'RIGHT_CONTENT_WIDTH',
    MAIN_CONTENT_HEIGHT: 'MAIN_CONTENT_HEIGHT',
    MENU_FLAG: 'MENU_FLAG'
  },
  ADDRESS: {
    DISTRICT: 'ADDRESS_DISTRICT',
    DISTRICT2: 'ADDRESS_DISTRICT2'
  },
  KAPTCHA_CODE: 'KAPTCHA_CODE',
  // 角色类型
  ROLE_TYPE: {
    ADMIN: 1, // 超级管理员
    YUN_CANG: 2, // 云仓角色
    OWNER: 3, // 货主企业
    CAPITAL_OWNER: 4 // 资金型货主
  },
  // 约定回购状态
  BUY_BACK_STATUS: {
    SELL_FOR_AUDIT: 1, // 出售待审核
    SELL_FOR_CONFIRM: 2, // 出售待确认
    SELL_AUDIT_NOT_PASS: 3, // 出售审核不通过
    SELL_DEALT: 4, // 出售已成交
    SELL_CONFIRM_NOT_PASS: 5, // 出售确认不通过
    BACK_FOR_AUDIT: 6, // 回购待审核
    BACK_FOR_CONFIRM: 7, // 回购待确认
    BACK_AUDIT_NOT_PASS: 8, // 回购审核不通过
    BACK_DEALT: 9, // 回购已成交
    BACK_CONFIRM_NOT_PASS: 10 // 回购确认不通过
  },
  // IBS 求购状态
  IBS_DEMAND_STATUS: {
    IN_DEMAND: 1, // 求购中
    IN_SHIELDING: 2, // 已屏蔽
    CLOSED: 3 // 已关闭
  },
  // IBS 话题删除原因 1.广告 2.恶意灌水 3.违规内容 4.文不对题 5.重复评论 6.自定义 9.用户删除
  IBS_COMMENT_DEL_REASON: {
    GG: 1,
    EYGS: 2,
    WGNR: 3,
    WBDT: 4,
    CFPL: 5,
    ZDY: 6,
    YHSC: 9
  },
  // IBS 话题来源  1：微信端，2：PC端
  IBS_TOPIC_SOURCE: {
    WECHAT: 1,
    PC: 2
  },
  // IBS 话题批量标签处理   1.批量置顶 2.取消置顶 3.设置精品  4.取消精品
  // 1 batch top setting, 2 cancel top setting, 3 Set up boutique, 4 Cancel the boutique
  IBS_TOPIC_TAGTYPE: {
    BATCH_TOP_SET: 1,
    CANCEL_TOP_SET: 2,
    SET_UP_BOUTIQUE: 3,
    CANCEL_THE_BOUTIQUE: 4
  },
  // IBS 批量话题管理操作 1.批量关闭 2.批量启用 3.批量删除 4.批量还原
  // TopicManageDto    1 batch shutdown 2 batch start 3 batch deletion 4 batch restore
  IBS_TOPIC_MANAGEDTO: {
    BATCH_SHUTDOWN: 1,
    BATCH_START: 2,
    BEACH_DELETION: 3,
    BEACH_RESTORE: 4
  }
};
export {
  gbs,
  cbs,
  enums
};
