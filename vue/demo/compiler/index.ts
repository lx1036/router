







//
// export function createCompilerCreator(base: Function): Function {
//
// }





/*
 * Template compilation options / results
 */
import {ASTElement, CompilerOptions} from "./types";


export const createCompilerCreator = (base): Function => (options: CompilerOptions) => {
  const compile = (template: string, options?: CompilerOptions) => {
  
  };
  
  return {compile, compileToFunctions: createCompileToFunctionFn(compile)};
};









const base = (template: string, options?: CompilerOptions) => {
  const ast = parse(template.trim(), options);
  
  if (options.optimize != false) {
    optimize(ast, options);
  }
  
  const code = generate(ast, options);
  
  return {code, render: code.render, staticRenderFns: code.staticRenderFns};
};
export const createCompiler = createCompilerCreator(base);









