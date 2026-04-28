import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetourCommandeListComponent } from './retour-commande-list-component';

describe('RetourCommandeListComponent', () => {
  let component: RetourCommandeListComponent;
  let fixture: ComponentFixture<RetourCommandeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetourCommandeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetourCommandeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
