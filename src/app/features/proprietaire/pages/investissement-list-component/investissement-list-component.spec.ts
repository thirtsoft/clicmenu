import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestissementListComponent } from './investissement-list-component';

describe('InvestissementListComponent', () => {
  let component: InvestissementListComponent;
  let fixture: ComponentFixture<InvestissementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestissementListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestissementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
