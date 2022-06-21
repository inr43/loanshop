import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanusersComponent } from './loanusers.component';

describe('LoanusersComponent', () => {
  let component: LoanusersComponent;
  let fixture: ComponentFixture<LoanusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanusersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
