
import KarmaConf from '../karma.conf';
import {Vue3} from "../src/index";

describe('Karma Test', function() {
  it('babel-loader test', function() {
    expect(typeof KarmaConf).toEqual('function');
  });
});

describe('Proxy test', function () {
  it('vm._data.a=vm.a', function () {
    let vm = new Vue3({
      data() {
        return {a: 2};
      }
    });

    expect(vm.a).toEqual(2);
  });
});
