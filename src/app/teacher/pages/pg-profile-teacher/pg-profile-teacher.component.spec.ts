import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgProfileTeacherComponent } from './pg-profile-teacher.component';

describe('PgProfileInstitutionComponent', () => {
  let component: PgProfileTeacherComponent;
  let fixture: ComponentFixture<PgProfileTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgProfileTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgProfileTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
