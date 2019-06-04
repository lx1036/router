/**
 * ./node_modules/.bin/karma start  vue/vue3/karma.conf.js
 */
export class Vue3 {
  constructor(options) {
    this.$options = options;

    const proxy = this.initDataProxy();
    this.initWatch();

    return proxy;
  }

  /**
   * @see https://stackoverflow.com/questions/37714787/can-i-extend-proxy-with-an-es2015-class
   */
  initDataProxy() {
    const data = this.$options.data();

    return new Proxy(this, {
      set: (target, key, current, receiver) => {
        const prev = data[key];
        data[key] = current;

        if (prev !== current) {
          this.notify(key, prev, current);
        }

        return true;
      },
      get: (target, key, receiver) => {
        if (key in this) {
          return this[key];
        }

        return data[key];
      }
    });
  }

  initWatch() {
    this.dataNotifyChain = {};
  }

  notify(key, prev, current) {
    (this.dataNotifyChain[key] || []).forEach((cb) => cb(prev, current));
  }

  $watch(key, cb) {
    (this.dataNotifyChain[key]|| []).push(cb);
  }
}
