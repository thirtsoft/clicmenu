import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGerant } from './dashboard-gerant';

describe('DashboardGerant', () => {
  let component: DashboardGerant;
  let fixture: ComponentFixture<DashboardGerant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardGerant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardGerant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
