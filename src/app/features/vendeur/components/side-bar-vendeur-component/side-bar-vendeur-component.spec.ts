import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarVendeurComponent } from './side-bar-vendeur-component';

describe('SideBarVendeurComponent', () => {
  let component: SideBarVendeurComponent;
  let fixture: ComponentFixture<SideBarVendeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarVendeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarVendeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
