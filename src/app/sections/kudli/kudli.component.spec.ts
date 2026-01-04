import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KudliComponent } from './kudli.component';

describe('KudliComponent', () => {
  let component: KudliComponent;
  let fixture: ComponentFixture<KudliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KudliComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KudliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
