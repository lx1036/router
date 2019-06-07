import {Vue3} from "../src";


describe('mvvm', function () {
  it('basic usage', function () {
    const vm = new Vue3({
      data() {
        return {a: 0};
      },
      render(h) {
        return h('div', null, this.a);
      }
    }).$mount();

    vm.a++;
    expect(vm.$el.textContent).toEqual('1');
    vm.a = 999;
    expect(vm.$el.textContent).toEqual('999');
  });
  
  it('deep object', () => {
    const vm = new Vue3({
      data() {
        return {a: {b: 0}};
      },
      render(h) {
        return h('div', null, this.a.b);
      }
    }).$mount();
    
    expect(vm.a.b).toEqual(0);
    vm.a.b++;
    expect(vm.a.b).toEqual(1);
    expect(vm.$el.textContent).toEqual('1');
    vm.a.b = 999;
    expect(vm.$el.textContent).toEqual('999');
  });
  
  it('add or delete object property', () => {
    const vm = new Vue3({
      data() {
        return {a: {}};
      },
      render(h) {
        return h('div', null, this.a.b);
      }
    }).$mount();
    
    expect(vm.$el.textContent).toEqual('undefined');
    
    vm.a.b = 0;
    expect(vm.a.b).toEqual(0);
    expect(vm.$el.textContent).toEqual('0');
  
    delete vm.a.b;
    expect(vm.a.b).toEqual(undefined);
    expect(vm.$el.textContent).toEqual('undefined');
  });
});
