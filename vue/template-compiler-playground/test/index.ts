// ../../../node_modules/.bin/webpack-dev-server ./index.ts --config ./webpack.config.js

import {compile, CompiledResult} from 'vue-template-compiler';


let template = `<div class="app"><p class="title" v-if="visible">Title</p></div>`;
let compiledResult: CompiledResult<string> = compile(template);

console.log(compiledResult.ast, compiledResult.render, compiledResult.staticRenderFns);
