import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteAgentListComponent } from './compte-agent-list-component';

describe('CompteAgentListComponent', () => {
  let component: CompteAgentListComponent;
  let fixture: ComponentFixture<CompteAgentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteAgentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteAgentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
