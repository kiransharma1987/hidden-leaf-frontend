import { Component } from '@angular/core';
import { RevealDirective } from '../../shared/directives';

@Component({
  selector: 'app-kudli',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './kudli.component.html',
  styleUrls: ['./kudli.component.scss']
})
export class KudliComponent {}
