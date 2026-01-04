import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TungaBhadraComponent } from './tunga-bhadra.component';

describe('TungaBhadraComponent', () => {
  let component: TungaBhadraComponent;
  let fixture: ComponentFixture<TungaBhadraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TungaBhadraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TungaBhadraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
