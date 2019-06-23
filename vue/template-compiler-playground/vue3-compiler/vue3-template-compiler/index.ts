







//
// export function createCompilerCreator(base: Function): Function {
//
// }





/*
 * Template compilation options / results
 */
import {ASTElement, CompilerOptions} from "./types";




export const createCompiler = createCompilerCreator((template: string, options: CompilerOptions): CompiledResult => {
  const ast = parse(template.trim(), options);
  optimize(ast, options);
  const code = generate(ast, options);
  
  return {code, render: code.render, staticRenderFns: code.staticRenderFns};
});









