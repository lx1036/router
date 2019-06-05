import {Vue3} from "../src";


describe('mvvm', function () {
  it('basic usage', function () {
    const vm = new Vue3({
      data() {
        return {a: 0};
      },
      render(h) {
        return h('div', null, this.a)
      }
    }).$mount();

    vm.a++;
    expect(vm.$el.textContent).toEqual('1');
    vm.a = 999;
    expect(vm.$el.textContent).toEqual('999');
  });
});
