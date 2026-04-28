import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutVendeurCompoment } from './main-layout-vendeur-compoment';

describe('MainLayoutVendeurCompoment', () => {
  let component: MainLayoutVendeurCompoment;
  let fixture: ComponentFixture<MainLayoutVendeurCompoment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutVendeurCompoment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutVendeurCompoment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
