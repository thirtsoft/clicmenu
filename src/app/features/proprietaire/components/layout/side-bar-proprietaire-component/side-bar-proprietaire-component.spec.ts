import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarProprietaireComponent } from './side-bar-proprietaire-component';

describe('SideBarProprietaireComponent', () => {
  let component: SideBarProprietaireComponent;
  let fixture: ComponentFixture<SideBarProprietaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideBarProprietaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideBarProprietaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
