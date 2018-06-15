
// yarn ts-node tmp/test.ts -> { __esModule: true, AComponent: [Function: AComponent], a: 'a' }
// import * as SystemJS from 'systemjs';
//
// SystemJS.import('./tmp/modules.js').then((m) => {
//   console.log(m);
// });

import {AComponent, a } from './modules';

console.log(AComponent, a);
