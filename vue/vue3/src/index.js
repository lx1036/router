/**
 * ./node_modules/.bin/karma start  vue/vue3/karma.conf.js --single-run
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

    return new Proxy(this, {
      set: (target, key, current, receiver) => {
        if (key in data) {
          const prev = data[key];
          data[key] = current;
          
          if (prev !== current) {
            this.notify(key, prev, current);
          }
        } else {
          this[key] = current;
        }

        return true;
      },
      get: (target, key, receiver) => {
        const methods = this.$options.methods || {};

        if (key in data) { // 收集模板中用了 data 的属性到依赖集合中
          if (!this.collected) {
            this.$watch(key, this.update.bind(this)); // 依赖收集
            this.collected = true;
          }
          
          return data[key];
        }

        if (key in methods) {
          return methods[key].bind(this.proxy);
        }

        return this[key];
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

    if (parent) {
      parent.removeChild(this.$el); // 删除旧 view
    }

    const vnode = this.$options.render.call(this.proxy, this.createVNode);
    this.$el = this.patch(null, vnode);
    
    if (parent) {
      parent.appendChild(this.$el); // 添加新 view
    }
  }

  patch(oldVnode, newVnode) {
    return this.createDOMElement(newVnode);
  }
}
