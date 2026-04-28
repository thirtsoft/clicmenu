import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteAgentLocalListComponent } from './compte-agent-local-list-component';

describe('CompteAgentLocalListComponent', () => {
  let component: CompteAgentLocalListComponent;
  let fixture: ComponentFixture<CompteAgentLocalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteAgentLocalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteAgentLocalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
