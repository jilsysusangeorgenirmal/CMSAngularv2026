import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtechnicianDashboard } from './labtechnician-dashboard';

describe('LabtechnicianDashboard', () => {
  let component: LabtechnicianDashboard;
  let fixture: ComponentFixture<LabtechnicianDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabtechnicianDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabtechnicianDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
