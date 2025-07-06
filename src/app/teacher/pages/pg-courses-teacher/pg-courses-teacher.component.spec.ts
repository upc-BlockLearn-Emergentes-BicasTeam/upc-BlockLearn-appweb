import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgCoursesTeacherComponent } from './pg-courses-teacher.component';

describe('PgCoursesInstitutionComponent', () => {
  let component: PgCoursesTeacherComponent;
  let fixture: ComponentFixture<PgCoursesTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgCoursesTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgCoursesTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
