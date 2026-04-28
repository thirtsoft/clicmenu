import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLayoutGerantCompoment } from './main-layout-gerant-compoment';

describe('MainLayoutGerantCompoment', () => {
  let component: MainLayoutGerantCompoment;
  let fixture: ComponentFixture<MainLayoutGerantCompoment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutGerantCompoment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainLayoutGerantCompoment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
