import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExaminationFormComponent } from './examination-form.component';

describe('ExaminationFormComponent', () => {
  let component: ExaminationFormComponent;
  let fixture: ComponentFixture<ExaminationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExaminationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExaminationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
