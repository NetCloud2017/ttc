import { gbs } from 'utils/';
import {validateTips} from 'utils/tips';
import permission from 'utils/permission/permission';
import axios from 'axios';
let mixin = {
  data() {
    return {};
  },
  methods: {
    getUrlParam(name) {
      let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
      let result = window.location.search.substr(1).match(reg);
      return result ? decodeURIComponent(result[2]) : null;
    },
    loadPage(routerName, param) {
      if (param) {
        this.$router.push({name: routerName, query: param});
      } else {
        this.$router.push({name: routerName});
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    // 校验权限
    hasPermission(bindPermissions) {
      let permissions = [];
      if (typeof bindPermissions === 'string') {
        permissions.push(bindPermissions);
      } else {
        permissions.concat(bindPermissions);
      }
      return permission.checkPermission(permissions);
    },
    goHome() {
      this.loadPage('Index');
    },
    message(msg, type, showClose) {
      this.$message({
        showClose: showClose || false,
        message: msg,
        type: type
      });
    },
    confirmModel(message, url, param, callback) {
      this.ajaxBox({
        url: url,
        data: param || '',
        message: message,
        success: callback
      });
    },
    ajax(param) {
      let {type, url, data, success, isUnMusk, loading, responseType} = param;
      if (!isUnMusk) {
        this.$pcNProgress.start();
      }
      if (loading && !this.$store.getters.getAjaxLoading) {
        this.$store.dispatch('show_ajaxLoading');
      }
      if (loading && !this.$store.getters.getButtonLoading) {
        this.$store.dispatch('show_buttonLoading');
      }
      this.$http({
        method: type || 'POST',
        url: url || '',
        data: data || '',
        responseType: responseType
      }).then((res) => {
        this.$pcNProgress.done();
        if (loading && this.$store.getters.getAjaxLoading) {
          this.$store.dispatch('hide_ajaxLoading');
        }
        if (loading && this.$store.getters.getButtonLoading) {
          this.$store.dispatch('hide_buttonLoading');
        }
        if (success) {
          success(res);
        } else {
          this.goBack();
        }
      }).catch((error) => {
        this.$pcNProgress.done();
        this.$loading = false;
        if (loading && this.$store.getters.getAjaxLoading) {
          this.$store.dispatch('hide_ajaxLoading');
        }
        if (loading && this.$store.getters.getButtonLoading) {
          this.$store.dispatch('hide_buttonLoading');
        }
        console.error(error);
      });
    },
    ajaxBox(param) {
      let {type, data, url, message, success, iconType, confirmButtonText, cancelButtonText, title} = param;
      if (!message) {
        alert(validateTips.NOT_EMPTY);
        return;
      }
      let response;
      this.$pcMessageBox({
        title: title || '消息',
        message: message,
        showCancelButton: true,
        confirmButtonText: confirmButtonText || '确定',
        cancelButtonText: cancelButtonText || '取消',
        type: iconType || 'warning',
        closeOnPressEscape: true,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            // instance.confirmButtonText = '执行中...';
            this.ajax({
              type: type,
              url: url,
              data: data,
              success: (res) => {
                done();
                response = res;
              }
            });
            setTimeout(() => {
              instance.confirmButtonLoading = false;
            }, 400);
          } else {
            done();
          }
        }
      }).then(() => {
        if (success) {
          success(response);
        }
      }).catch((error) => {
        console.error(error);
      });
    },
    logout() {
      this.$http({
        url: '/uac/user/logout',
        method: 'post',
        params: {
          accessToken: this.$store.getters.getAccessToken
        }
      }).then(() => {
        this.$store.dispatch('delete_user_info');
        window.history.go(0);
      });
    },
    // 字段的验证，支持非空、手机、邮箱的判断
    validate(value, type) {
      // 非空验证
      if (type === 'require') {
        return !!value;
      }
      // 手机号验证
      if (type === 'phone') {
        return /^1\d{10}$/.test(value);
      }
      // 邮箱格式验证
      if (type === 'email') {
        return /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value);
      }
      if (type === 'pwd') {
        return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,14}$/.test(value);
      }
    },
    resetFromFn (formName) {
      this.$refs[formName].resetFields();
    },
    getBrowserWidth() {
      return (document.documentElement.clientWidth || document.body.clientWidth) + 'px';
    },
    getBrowserHeight() {
      return (document.documentElement.clientHeight || document.body.clientHeight) + 'px';
    },
    getApiHost() {
      return gbs.api_host;
    },
    errorTip(message) {
      if (!message) { // 如果message为空则过滤掉
        return;
      }
      this.$pcMessage.error({
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: '<strong>' + message + '</strong>',
        duration: 3000
      });
    },
    successTip(message, duration) {
      this.$pcMessage.success({
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: '<strong>' + message + '</strong>',
        duration: !duration ? 3000 : duration
      });
    },
    infoTip(message) {
      this.$pcMessage.info({
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: '<strong>' + message + '</strong>',
        duration: 3000
      });
    },
    // 下载/导出文件Execl
    exportFile(param) {
      let {type, url, data, loading, fileNameStart} = param;
      this.ajax({
        type: type,
        url: url,
        data: data,
        loading: loading,
        responseType: 'blob',
        success: (res) => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 1000);
          // console.log('res: ' + JSON.stringify(res));
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(new Blob([res.data]), {type: 'application/octet-stream'});
          let exposeHeaders = res.headers['access-control-expose-headers']; // 从response头部获取文件名信息
          let fileName;
          // 有的版本chrome或其他的浏览器拿到不response headers。判断是否获取到了文件名信息
          if (exposeHeaders) {
            exposeHeaders = JSON.parse(res.headers['access-control-expose-headers']);
            fileName = exposeHeaders['content-disposition'].split(';')[1].split('=')[1].replace('"', ''); // 获取文件名名
            fileName = decodeURI(fileName); // urldecode 解码
          } else {
            fileName = !fileNameStart ? this.formatTime() + '.xlsx' : fileNameStart + this.formatTime() + '.xlsx';
          }
          link.download = fileName; // fileName;
          link.click();
        }
      });
    },
    // 下载/导出文件PDF
    exportFilePDF(param) {
      let {type, url, data, loading, fileNameStart} = param;
      this.ajax({
        type: type,
        url: url,
        data: data,
        loading: loading,
        responseType: 'blob',
        success: (res) => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 1000);
          // console.log('res: ' + JSON.stringify(res));
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(new Blob([res.data]), {type: 'application/octet-stream'});
          let exposeHeaders = res.headers['access-control-expose-headers']; // 从response头部获取文件名信息
          let fileName;
          // 有的版本chrome或其他的浏览器拿到不response headers。判断是否获取到了文件名信息
          if (exposeHeaders) {
            exposeHeaders = JSON.parse(res.headers['access-control-expose-headers']);
            fileName = exposeHeaders['content-disposition'].split(';')[1].split('=')[1].replace('"', ''); // 获取文件名名
            fileName = decodeURI(fileName); // urldecode 解码
          } else {
            fileName = !fileNameStart ? this.formatTime() + '.pdf' : fileNameStart + this.formatTime() + '.pdf';
          }
          link.download = fileName; // fileName;
          link.click();
        }
      });
    },
    // 下载/导出文件
    exportFileFileType(param) {
      let {type, url, data, loading, fileNam} = param;
      this.ajax({
        type: type,
        url: url,
        data: data,
        loading: loading,
        responseType: 'blob',
        success: (res) => {
          setTimeout(() => {
            this.$pcNProgress.done();
          }, 1000);
          // console.log('res: ' + JSON.stringify(res));
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(new Blob([res.data]), {type: 'application/octet-stream'});
          let exposeHeaders = res.headers['access-control-expose-headers']; // 从response头部获取文件名信息
          let fileName;
          // 有的版本chrome或其他的浏览器拿到不response headers。判断是否获取到了文件名信息
          if (exposeHeaders) {
            exposeHeaders = JSON.parse(res.headers['access-control-expose-headers']);
            fileName = exposeHeaders['content-disposition'].split(';')[1].split('=')[1].replace('"', ''); // 获取文件名名
            fileName = decodeURI(fileName); // urldecode 解码
          } else {
            fileName = fileNam;
          }
          link.download = fileName; // fileName;
          link.click();
        }
      });
    },
    // 下载 文件服务器的pdf
    downpdf(pdfurl, title) {
      var index = pdfurl.lastIndexOf("\/"); // eslint-disable-line
      var url = pdfurl.substring(index + 1, pdfurl.length);
      axios.get('/v1/tfs/' + url, {
        responseType: 'blob',
        params: {}
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        let head = response.headers['content-disposition'];
        let fname = title + '.pdf';
        if (head) {
          try {
            fname = head.split(';')[1].split('=')[1];
          } catch (err) {
            console.log('can not get pdf name');
          }
        };
        link.href = url;
        link.setAttribute('download', fname);
        document.body.appendChild(link);
        link.click();
      });
    },
    // yyyyMMdd格式化日期
    formatDate(date) {
      if (!date) {
        date = new Date();
      }
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      return year.toString() + month.toString() + day.toString(); // 注意一定要调tostring，不然会变成数字相加而不是字符串拼接了
    },
    // yyyyMMddHHmmSS格式化时间
    formatTime (date) {
      if (!date) {
        date = new Date();
      }
      var hours = date.getHours();
      var mins = date.getMinutes();
      var secs = date.getSeconds();
      if (hours < 10) hours = '0' + hours;
      if (mins < 10) mins = '0' + mins;
      if (secs < 10) secs = '0' + secs;
      return this.formatDate(date) + hours.toString() + mins.toString() + secs.toString();
    }
  }
};

export default mixin;
