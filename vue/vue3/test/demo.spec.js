import {Vue3} from "../src";


describe('stage1', () => {
  it('basic', () => {
    const vm = new Vue3({
      data() {
        return {a: 0};
      },
      render(h) {
        return h('button', {class: 'btn', on: {'click': this.handleClick}}, this.a);
      },
      methods: {
        handleClick() {
          this.a++;
        }
      }
    }).$mount(document.body);
    
    const button = document.body.querySelector('.btn');
    expect(button.tagName).toEqual('BUTTON');
    button.click();
    expect(vm.$el.textContent).toEqual('1');
    expect(document.body.querySelector('.btn').textContent).toEqual('1');
  
    document.body.removeChild(vm.$el);
  });
});
