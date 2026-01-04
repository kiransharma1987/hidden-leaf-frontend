import { Component } from '@angular/core';
import { RevealDirective } from '../../shared/directives';

@Component({
  selector: 'app-usiru',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './usiru.component.html',
  styleUrls: ['./usiru.component.scss']
})
export class UsiruComponent {}
