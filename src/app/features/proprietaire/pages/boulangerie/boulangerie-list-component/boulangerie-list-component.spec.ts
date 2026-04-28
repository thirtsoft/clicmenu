import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoulangerieListComponent } from './boulangerie-list-component';

describe('BoulangerieListComponent', () => {
  let component: BoulangerieListComponent;
  let fixture: ComponentFixture<BoulangerieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoulangerieListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoulangerieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
