import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeFournisseurListComponent } from './commande-fournisseur-list-component';

describe('CommandeFournisseurListComponent', () => {
  let component: CommandeFournisseurListComponent;
  let fixture: ComponentFixture<CommandeFournisseurListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeFournisseurListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeFournisseurListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
