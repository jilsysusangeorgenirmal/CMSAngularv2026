import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentEdit } from './appointment-edit';

describe('AppointmentEdit', () => {
  let component: AppointmentEdit;
  let fixture: ComponentFixture<AppointmentEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
