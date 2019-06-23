import {baseOptions} from "../platform-web-compiler/options";

describe('parser', () => {
  it('simple element', () => {
    const ast = parse('<h1>hello world</h1>', baseOptions);
    expect(ast.tag).toBe('h1');
    expect(ast.plain).toBe(true);
    expect(ast.children[0].text).toBe('hello world');
  });
});
