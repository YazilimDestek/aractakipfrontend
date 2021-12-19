import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationInformationFormComponent } from './examination-information-form.component';

describe('ExaminationInformationFormComponent', () => {
  let component: ExaminationInformationFormComponent;
  let fixture: ComponentFixture<ExaminationInformationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExaminationInformationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

  });
});
