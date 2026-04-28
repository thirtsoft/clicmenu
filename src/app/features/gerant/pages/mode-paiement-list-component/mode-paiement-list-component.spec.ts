import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModePaiementListComponent } from './mode-paiement-list-component';

describe('ModePaiementListComponent', () => {
  let component: ModePaiementListComponent;
  let fixture: ComponentFixture<ModePaiementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModePaiementListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModePaiementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
