import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardProprietaire } from './dashboard-proprietaire';

describe('DashboardProprietaire', () => {
  let component: DashboardProprietaire;
  let fixture: ComponentFixture<DashboardProprietaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardProprietaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardProprietaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
