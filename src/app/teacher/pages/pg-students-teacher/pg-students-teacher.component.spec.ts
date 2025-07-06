import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgStudentsTeacherComponent } from './pg-students-teacher.component';

describe('PgStudentsInstitutionComponent', () => {
  let component: PgStudentsTeacherComponent;
  let fixture: ComponentFixture<PgStudentsTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgStudentsTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgStudentsTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
