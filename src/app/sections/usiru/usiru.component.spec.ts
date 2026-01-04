import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsiruComponent } from './usiru.component';

describe('UsiruComponent', () => {
  let component: UsiruComponent;
  let fixture: ComponentFixture<UsiruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsiruComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsiruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
