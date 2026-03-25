import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistDashboard } from './receptionist-dashboard';

describe('ReceptionistDashboard', () => {
  let component: ReceptionistDashboard;
  let fixture: ComponentFixture<ReceptionistDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceptionistDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionistDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
