import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeDepenseListComponent } from './type-depense-list-component';

describe('TypeDepenseListComponent', () => {
  let component: TypeDepenseListComponent;
  let fixture: ComponentFixture<TypeDepenseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeDepenseListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeDepenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
