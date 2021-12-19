import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TireHistoryFormComponent } from './tire-history-form.component';

describe('TireHistoryFormComponent', () => {
  let component: TireHistoryFormComponent;
  let fixture: ComponentFixture<TireHistoryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TireHistoryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TireHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
