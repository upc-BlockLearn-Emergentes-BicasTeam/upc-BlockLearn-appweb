import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgStudentCoursesComponent } from './pg-student-courses.component';

describe('PgStudentCoursesComponent', () => {
  let component: PgStudentCoursesComponent;
  let fixture: ComponentFixture<PgStudentCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgStudentCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgStudentCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
