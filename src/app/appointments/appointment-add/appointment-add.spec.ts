import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAdd } from './appointment-add';

describe('AppointmentAdd', () => {
  let component: AppointmentAdd;
  let fixture: ComponentFixture<AppointmentAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
