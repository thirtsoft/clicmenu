import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnregistrerUnRetourComponent } from './enregistrer-un-retour-component';

describe('EnregistrerUnRetourComponent', () => {
  let component: EnregistrerUnRetourComponent;
  let fixture: ComponentFixture<EnregistrerUnRetourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnregistrerUnRetourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnregistrerUnRetourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
