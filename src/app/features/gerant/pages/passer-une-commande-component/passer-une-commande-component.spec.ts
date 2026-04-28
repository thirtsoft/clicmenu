import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasserUneCommandeComponent } from './passer-une-commande-component';

describe('PasserUneCommandeComponent', () => {
  let component: PasserUneCommandeComponent;
  let fixture: ComponentFixture<PasserUneCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasserUneCommandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasserUneCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
