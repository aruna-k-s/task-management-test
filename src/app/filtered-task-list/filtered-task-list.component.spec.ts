import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredTaskListComponent } from './filtered-task-list.component';

describe('FilteredTaskListComponent', () => {
  let component: FilteredTaskListComponent;
  let fixture: ComponentFixture<FilteredTaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteredTaskListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
