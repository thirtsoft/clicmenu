import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitList } from './produit-list';

describe('ProduitList', () => {
  let component: ProduitList;
  let fixture: ComponentFixture<ProduitList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
