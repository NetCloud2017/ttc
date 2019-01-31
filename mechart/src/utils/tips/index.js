const validateTips = {
  NOT_EMPTY: '内容不能为空',
  NUM_WORDS: '只能由数字字母或者下划线组成',
  ROLE_EXIST: '角色编码已存在',
  LESS_20: '长度不能大于20',
  LESS_25: '长度不能大于25',
  LESS_2: '长度不能大于2个字符',
  LESS_30: '长度不能大于30',
  LESS_50: '长度不能大于50',
  LESS_6_14: '长度必须在6-14位之间',
  WORD_LESS_150: '长度不能大于150',
  WORD_LESS_100: '长度不能大于100',
  WORD_3_5: '长度在 3 到 5 个字符',
  ONLY_CHINESE: '请输入汉字',
  NUM_TOFIXED_2: '请输入数字值,小数点保留2位!',
  RIGHT_PHONE: '请输入正确的手机号格式',
  RIGHT_CONTACT_PHONE: '请输入正确的联系人电话',
  RIGHT_FORMAT: '请输入正确的格式',
  EMAIL_EXIST: '该邮箱已存在',
  EMAIL_FORMAT: '请正确填写邮箱',
  USER_EXIST: '登录名称已存在',
  MOBILE_EXIST: '手机号已存在',
  USERNAME_EXIST: '用户名已存在',
  RULE_EXIST: '权限编码已存在',
  RULE_ADD_EXIST: '权限地址已存在',
  NO_KEY: '没有找到key',
  KEY_NO_OBJECT: 'key不能是一个对象',
  IS_SURE_EXIST: '你确定退出登录么?',
  LACK_COMMAND: '菜单选项缺少command属性',
  ONLY_INT_NUM: '只能输入整数',
  NOT_OPEN: '本功能暂未开放',
  IMG_FORMAT: '上传图片格式有误',
  IMG_SIZE: '文件格式不正确或者文件过大',
  UPLOAD_SUCCESS: '上传成功',
  UPLOAD_FAIL: '上传失败',
  UPLOAD_ERROR: '上传出现异常',
  UPLOAD_EXC_TIME: '上传超时',
  PHONE_LENGTH: '手机格式错误',
  UPLOAD_IMG_NUM: '图片数量过多',
  GROUP_EXIST: '组织名称已存在',
  GROUP_CODE_EXIST: '编码已存在',
  BIND_MENU: '请选择需要绑定的菜单',
  FORMAT_ERROR: '格式错误',
  EXIST: '已存在',
  NOLY_CHINESE: '只能为汉字',
  CONFIRM_PWD: '请确认密码',
  PWD_RE: '两次输入密码不一致',
  PWD_RE_S: '新密码与原始密码不能相同',
  LOGIN_TIMEOUT: '登录超时',
  NOT_ALLOWED: '您无访问权限',
  API_ERROR: '接口请求失败或超时！请刷新重试',
  LISCENCE: '请输入正确的营业执照号',
  FIXPHONE: '请输入正确的固定电话',
  IDCARD: '请输入正确的身份证号',
  ORGANIZATION_IS_EMPTY: '组织名称不能为空',

  FILL_BASE_INFO: '请补全必填信息',

  // 货物相关提示语
  FILL_GOODS_DATA: '请补全货物信息',
  FILL_GOODS_NAME: '请填写货物名称',
  FILL_GOODS_COUNT: '请填写货物数量',
  FILL_GOODS_WEIGHT: '请填写货物重量',
  // 产品相关提示语
  FILL_PRODUCT_DATA: '请补全产品信息',

  // 仓库相关提示语
  SELECT_STORAGE: '请选择仓库',
  FILL_STORAGE_INFO: '请补全入库仓库信息',
  FILL_STORAGE_CONTACT: '请填写仓库联系人',
  FILL_STORAGE_CONTACT_PHONE: '请填写仓库联系人电话',
  FILL_RIGHT_STORAGE_CONTACT_PHONE: '请填写正确的仓库联系人电话',

  // 货主相关
  OWNER_NOT_EMPTY: '货主企业不能为空，请补全',

  // 资产管理
  EXECUTE_DATE_IS_EMPTY: '执行日期不能为空',
  EXECUTE_SUCCESSFULLY: '执行成功',
  ENTRUST_SUCCESSFULLY: '委托成功',
  REDEM_DATE_IS_EMPTY: '赎单日期不能为空',
  REDEM_CONTENT_IS_EMPTY: '赎单内容不能为空',
  REDEM_ENTRY_SUCCESSFULLY: '赎单录入成功',
  REDEM_PERFORM_DATE_IS_EMPTY: '赎单日期不可早于该项目的执行日期',

  // 轮播图
  HOME_LIKE_TITLE: '请输入标题',
  HOME_LIKE_SORT: '请选择序号'
};

const resMessage = {
};

export {
  validateTips,
  resMessage
};
