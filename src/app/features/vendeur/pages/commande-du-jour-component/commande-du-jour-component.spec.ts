import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeDuJourComponent } from './commande-du-jour-component';

describe('CommandeDuJourComponent', () => {
  let component: CommandeDuJourComponent;
  let fixture: ComponentFixture<CommandeDuJourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeDuJourComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeDuJourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
