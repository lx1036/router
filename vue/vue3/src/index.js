
export class Vue3 {
  constructor(options) {
    this.$options = options;

    return this.initDataProxy();
  }

  /**
   * @see https://stackoverflow.com/questions/37714787/can-i-extend-proxy-with-an-es2015-class
   */
  initDataProxy() {
    const data = this.$options.data();

    return new Proxy(this, {
      set(target, key, value, receiver) {
        data[key] = value;
      },
      get(target, key, receiver) {
        return data[key];
      }
    });
  }
}
