import {Vue3} from "../src";

describe('component', () => {
  it('render vnode with component', () => {
    const vm = new Vue3({
      data() {
        return {msg1: 'hello', msg2: 'world'};
      },
      render(createElement) {
        return createElement('div', null, [
          createElement('my-component', {props: {msg: this.msg1}}),
          createElement('my-component', {props: {msg: this.msg2}}),
        ]);
      },
      components: {
        'my-component': {
          props: ['msg'],
          render(createElement) {
            return createElement('p', null, this.msg);
          },
        }
      }
    }).$mount();
    
    expect(vm.$el.outerHTML).toEqual('<div><p>hello</p><p>world</p></div>');
  });
  
  it('component mvvm', () => {
    const vm = new Vue3({
      data() {
        return {parentMsg: 'hello'};
      },
      render(createElement) {
        return createElement('my-component', {props: {msg: this.parentMsg}});
      },
      components: {
        'my-component': {
          props: ['msg'],
          render(createElement) {
            return createElement('p', null, this.msg);
          },
        }
      }
    }).$mount();
    
    expect(vm.$el.outerHTML).toEqual('<p>hello</p>');
    vm.parentMsg = 'world';
    expect(vm.$el.outerHTML).toEqual('<p>world</p>');
  });
});
