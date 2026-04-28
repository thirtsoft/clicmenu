import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryProduitListComponent } from './category-produit-list-component';

describe('CategoryProduitListComponent', () => {
  let component: CategoryProduitListComponent;
  let fixture: ComponentFixture<CategoryProduitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryProduitListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryProduitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
