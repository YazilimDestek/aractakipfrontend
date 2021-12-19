import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TireFormComponent } from './tire-form.component';

describe('TireFormComponent', () => {
  let component: TireFormComponent;
  let fixture: ComponentFixture<TireFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TireFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TireFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
