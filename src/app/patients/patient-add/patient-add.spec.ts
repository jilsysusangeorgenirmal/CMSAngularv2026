import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAdd } from './patient-add';

describe('PatientAdd', () => {
  let component: PatientAdd;
  let fixture: ComponentFixture<PatientAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
