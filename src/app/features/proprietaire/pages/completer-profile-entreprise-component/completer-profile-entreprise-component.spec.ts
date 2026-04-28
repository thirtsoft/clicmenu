import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleterProfileEntrepriseComponent } from './completer-profile-entreprise-component';

describe('CompleterProfileEntrepriseComponent', () => {
  let component: CompleterProfileEntrepriseComponent;
  let fixture: ComponentFixture<CompleterProfileEntrepriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleterProfileEntrepriseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleterProfileEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
