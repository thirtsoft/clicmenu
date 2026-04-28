import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesVentesComponent } from './mes-ventes-component';

describe('MesVentesComponent', () => {
  let component: MesVentesComponent;
  let fixture: ComponentFixture<MesVentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesVentesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
