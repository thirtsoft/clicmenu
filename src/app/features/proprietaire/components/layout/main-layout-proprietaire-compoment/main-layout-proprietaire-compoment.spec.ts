import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutProprietaireCompoment } from './main-layout-proprietaire-compoment';

describe('MainLayoutProprietaireCompoment', () => {
  let component: MainLayoutProprietaireCompoment;
  let fixture: ComponentFixture<MainLayoutProprietaireCompoment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutProprietaireCompoment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutProprietaireCompoment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
