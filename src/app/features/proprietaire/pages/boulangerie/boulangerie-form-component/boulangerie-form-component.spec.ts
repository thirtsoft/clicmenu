import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoulangerieFormComponent } from './boulangerie-form-component';

describe('BoulangerieFormComponent', () => {
  let component: BoulangerieFormComponent;
  let fixture: ComponentFixture<BoulangerieFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoulangerieFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoulangerieFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
