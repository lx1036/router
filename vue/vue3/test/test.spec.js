
import KarmaConf from '../karma.conf';
import {Vue3} from "../src/index";

describe('Karma Test', function() {
  it('babel-loader test', function() {
    expect(typeof KarmaConf).toEqual('function');
  });
});


