import { Component } from '@angular/core';

@Component({
  selector: 'karma-root',
  templateUrl: `<p>Hello World {{title}}!</p>`,
})
export class KarmaComponent {
  title = 'angular';
}
