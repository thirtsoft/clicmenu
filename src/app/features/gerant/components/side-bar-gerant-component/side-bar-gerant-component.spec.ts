import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarGerantComponent } from './side-bar-gerant-component';

describe('SideBarGerantComponent', () => {
  let component: SideBarGerantComponent;
  let fixture: ComponentFixture<SideBarGerantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarGerantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarGerantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
