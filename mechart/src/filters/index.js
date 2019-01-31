exports.formatMoney = (value) => {
  if (value) {
    value = Number(value);
    return '￥ ' + value.toFixed(2);
  }
};
exports.getOrderStatusName = (val) => {
  let statusName = '';
  switch (val) {
    case 0: {
      statusName = '已取消';
      break;
    }
    case 10: {
      statusName = '未付款';
      break;
    }
    case 20: {
      statusName = '已付款';
      break;
    }
    case 40: {
      statusName = '交易成功';
      break;
    }
    case '50': {
      statusName = '交易关闭';
      break;
    }
    case '60': {
      statusName = '已发货';
      break;
    }
  }
  return statusName;
};

exports.getUserStatusName = (state) => {
  let statusName = '';
  switch (state) {
    case 'ENABLE': {
      statusName = '启用';
      break;
    }
    case 'DISABLE': {
      statusName = '禁用';
      break;
    }
  }
  return statusName;
};

exports.getRoleStatusName = (state) => {
  let statusName = '';
  switch (state) {
    case 'ENABLE': {
      statusName = '启用';
      break;
    }
    case 'DISABLE': {
      statusName = '禁用';
      break;
    }
  }
  return statusName;
};
exports.getShippingStatusName = (state) => {
  let statusName = '';
  switch (state) {
    case 1: {
      statusName = '启用';
      break;
    }
    case 2: {
      statusName = '禁用';
      break;
    }
  }
  return statusName;
};
exports.getOrderStatusName = (state) => {
  let statusName = '';
  switch (state) {
    case 0: {
      statusName = '已取消';
      break;
    }
    case 10: {
      statusName = '未付款';
      break;
    }
    case 20: {
      statusName = '已付款';
      break;
    }
    case 40: {
      statusName = '已发货';
      break;
    }
    case 50: {
      statusName = '交易成功';
      break;
    }
    case 60: {
      statusName = '交易关闭';
      break;
    }
  }
  return statusName;
};
exports.getProductStatusName = (state) => {
  let statusName = '';
  switch (state) {
    case 1: {
      statusName = '在售';
      break;
    }
    case 2: {
      statusName = '下架';
      break;
    }
    case 3: {
      statusName = '删除';
      break;
    }
  }
  return statusName;
};

exports.getCompanyTypeName = (state) => {
  let statusName = '';
  switch (state) {
    case 1: {
      statusName = '货主';
      break;
    }
    case 2: {
      statusName = '仓库';
      break;
    }
    case 3: {
      statusName = '资金方';
      break;
    }
  }
  return statusName;
};
