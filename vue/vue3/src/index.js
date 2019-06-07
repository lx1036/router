/**
 * ./node_modules/.bin/karma start vue/vue3/karma.conf.js --single-run
 * yarn jest -c ./vue/vue3/jest.config.js
 * @see https://github.com/zzz945/write-vue3-from-scratch/blob/master/doc/zh-cn.md
 */
import {VNode} from "./vnode";

export class Vue3 {
  constructor(options) {
    this.$options = options;

    this.proxy = this.initDataProxy();
    this.initWatch();

    return this.proxy;
  }

  /**
   * @see https://stackoverflow.com/questions/37714787/can-i-extend-proxy-with-an-es2015-class
   */
  initDataProxy() {
    const data = this.$options.data ? this.$options.data(): {};
    
    const createDataProxyHandler = (path) => {
      return {
        set: (data, key, value) => {
          const fullPath = path ? path + '.' + key : key;
          
          const prev = data[key];
          data[key] = value;
  
          if (prev !== value) {
            this.notify(fullPath, prev, value);
          }
          
          return true;
        },
        get: (data, key) => {
          const fullPath = path ? path + '.' + key : key;
          
          this.collect(fullPath);
          
          if (!!data[key] && typeof data[key] === 'object') {
            return new Proxy(data[key], createDataProxyHandler(fullPath));
          } else {
            return data[key];
          }
        },
        deleteProperty: (target, key) => {
          if (key in target) {
            const fullPath = path ? path + '.' + key : key;
            const pre = target[key];
            delete target[key];
      
            this.notify(fullPath, pre);
          }
    
          return true;
        }
      };
    };
    
    return new Proxy(this, {
      set: (target, key, value, receiver) => {
        if (key in data) {
          return createDataProxyHandler().set(data, key, value);
        } else {
          this[key] = value;
        }

        return true;
      },
      get: (target, key, receiver) => {
        const methods = this.$options.methods || {};

        if (key in data) { // 收集模板中用了 data 的属性到依赖集合中
          return createDataProxyHandler().get(data, key);
        }

        if (key in methods) {
          return methods[key].bind(this.proxy);
        }

        return this[key];
      },
    });
  }
  
  collect(key) {
    this.collected = this.collected || {};
    
    if (!this.collected[key]) {
      this.$watch(key, this.update.bind(this)); // 依赖收集
      this.collected[key] = true;
    }
  }

  initWatch() {
    this.dataNotifyChain = {};
  }

  notify(key, prev, current) {
    (this.dataNotifyChain[key] || []).forEach((cb) => cb(prev, current));
  }

  $watch(key, cb) {
    this.dataNotifyChain[key] = this.dataNotifyChain[key] || [];
    this.dataNotifyChain[key].push(cb);
  }

  $mount(root) {
    const {mounted, render} = this.$options;

    const vnode = render.call(this.proxy, this.createVNode);
    this.$el = this.createDOMElement(vnode);

    if (root) {
      root.appendChild(this.$el);
    }
    
    mounted && mounted.call(this.proxy);

    return this;
  }

  createVNode(tagName, attributes, children) {
    return new VNode(tagName, attributes, children);
  }

  createDOMElement(vnode) {
    const element = document.createElement(vnode.tagName);
    element.__vue__ = this;

    // Element attributes
    for (let key in vnode.attributes) {
      element.setAttribute(key, vnode.attributes[key]);
    }

    // set DOM event listener
    const events = (vnode.attributes || {}).on || {};
    for (let key in events) {
      element.addEventListener(key, events[key]);
    }
    

    if (!Array.isArray(vnode.children)) {
      element.textContent = vnode.children + '';
    } else {
      vnode.children.forEach((child) => {
        if (typeof child === 'string') {
          element.textContent = child;
        } else {
          element.appendChild(this.createDOMElement(child));
        }
      });
    }

    return element;
  }

  update() {
    const parent = this.$el.parentElement;
    const vnode = this.$options.render.call(this.proxy, this.createVNode);
    const oldElement = this.$el;
    this.$el = this.patch(null, vnode);
    
    if (parent) {
      parent.replaceChild(this.$el, oldElement);
    }
  }

  patch(oldVnode, newVnode) {
    return this.createDOMElement(newVnode);
  }
}
