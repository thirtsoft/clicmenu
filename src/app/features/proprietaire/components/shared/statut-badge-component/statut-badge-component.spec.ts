import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutBadgeComponent } from './statut-badge-component';

describe('StatutBadgeComponent', () => {
  let component: StatutBadgeComponent;
  let fixture: ComponentFixture<StatutBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatutBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatutBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
