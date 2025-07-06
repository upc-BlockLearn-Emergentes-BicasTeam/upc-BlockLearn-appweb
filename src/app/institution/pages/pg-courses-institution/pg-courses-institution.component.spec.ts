import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgCoursesInstitutionComponent } from './pg-courses-institution.component';

describe('PgCoursesInstitutionComponent', () => {
  let component: PgCoursesInstitutionComponent;
  let fixture: ComponentFixture<PgCoursesInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgCoursesInstitutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgCoursesInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
