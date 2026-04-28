import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovisionnementListComponent } from './approvisionnement-list-component';

describe('ApprovisionnementListComponent', () => {
  let component: ApprovisionnementListComponent;
  let fixture: ComponentFixture<ApprovisionnementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovisionnementListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovisionnementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
