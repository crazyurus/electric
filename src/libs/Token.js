export default {
  message: {
    alert (text) {
      return new Promise(function (resolve, reject) {
        f7.alert(text, resolve);
      })
    },
    confirm (text) {
      return new Promise(function (resolve, reject) {
        f7.confirm(text, resolve, reject);
      })
    },
    prompt (text, title) {
      return new Promise(function (resolve, reject) {
        f7.prompt(text, title, resolve, reject);
      })
    },
    toast (text) {
      if (typeof token === 'undefined' || typeof token.showNativeToast === 'undefined') f7.alert(text);
      else token.showNativeToast(text, true);
    }
  },
  indicator: {
    show () {
      // if(typeof token == "undefined" || typeof token.showIndicator == "undefined")
      f7.showIndicator();
      // else token.showIndicator();
    },
    hide () {
      // if(typeof token == "undefined" || typeof token.hideIndicator == "undefined")
      f7.hideIndicator();
      // else token.hideIndicator();
    }
  },
  storage: {
    _storage: window.localStorage,
    enable () {
      return this._storage !== undefined;
    },
    set (key, value) {
      if (this._storage) {
        this._storage.setItem(key, value);
      }
    },
    get (key) {
      let val = undefined;
      if (this._storage) {
        val = this._storage.getItem(key);
      }
      return val;
    },
    has (key) {
      return this.get(key) !== null;
    },
    remove (key) {
      if (this._storage) {
        this._storage.removeItem(key);
      }
    },
    clear () {
      this._storage.clear();
    }
  }
};
