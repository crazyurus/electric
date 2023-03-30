export default {
  install(Vue) {
    const checkMethodAvailable = function (methodName) {
      return window.token && window.token[methodName];
    };

    Vue.prototype.$navigator = {
      open(url) {
        if (checkMethodAvailable('loadUrl')) token.loadUrl(url);
        else location.assign(url);
      },
    };

    Vue.prototype.$message = {
      alert(text) {
        return new Promise(function (resolve) {
          f7.alert(text, resolve);
        });
      },
      confirm(text) {
        return new Promise(function (resolve, reject) {
          f7.confirm(text, resolve, reject);
        });
      },
      prompt(text, title) {
        return new Promise(function (resolve, reject) {
          f7.prompt(text, title, resolve, reject);
        });
      },
      toast(text) {
        if (typeof token === 'undefined' || typeof token.showNativeToast === 'undefined') f7.alert(text);
        else token.showNativeToast(text, true);
      }
    };

    Vue.prototype.$indicator = {
      show() {
        f7.showIndicator();
      },
      hide() {
        f7.hideIndicator();
      }
    };

    Vue.prototype.$storage = {
      _storage: window.localStorage,
      enable() {
        return this._storage !== undefined;
      },
      set(key, value) {
        if (this._storage) {
          this._storage.setItem(key, value);
        }
      },
      get(key) {
        let val = undefined;
        if (this._storage) {
          val = this._storage.getItem(key);
        }
        return val;
      },
      has(key) {
        return this.get(key) !== null;
      },
      remove(key) {
        if (this._storage) {
          this._storage.removeItem(key);
        }
      },
      clear() {
        this._storage.clear();
      }
    };

    Vue.prototype.$detect = {
      mobile() {
        return !!navigator.userAgent.match(/(android|iphone)/i);
      },
      iWUT() {
        return typeof token !== 'undefined';
      },
      wechat() {
        return navigator.userAgent.indexOf('MicroMessenger') > -1;
      }
    };
  }
};
