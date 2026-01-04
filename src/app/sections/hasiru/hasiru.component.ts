import { Component } from '@angular/core';
import { RevealDirective } from '../../shared/directives';

@Component({
  selector: 'app-hasiru',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './hasiru.component.html',
  styleUrls: ['./hasiru.component.scss']
})
export class HasiruComponent {}
