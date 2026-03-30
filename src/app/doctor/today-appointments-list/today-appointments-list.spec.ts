import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayAppointmentsList } from './today-appointments-list';

describe('TodayAppointmentsList', () => {
  let component: TodayAppointmentsList;
  let fixture: ComponentFixture<TodayAppointmentsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayAppointmentsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayAppointmentsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
