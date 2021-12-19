import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceResultFormComponent } from './maintenance-result-form.component';

describe('MaintenanceResultFormComponent', () => {
  let component: MaintenanceResultFormComponent;
  let fixture: ComponentFixture<MaintenanceResultFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceResultFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceResultFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
