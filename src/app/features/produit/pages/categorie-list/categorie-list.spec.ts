import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieList } from './categorie-list';

describe('CategorieList', () => {
  let component: CategorieList;
  let fixture: ComponentFixture<CategorieList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorieList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
