import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgStudentsInstitutionComponent } from './pg-students-institution.component';

describe('PgStudentsInstitutionComponent', () => {
  let component: PgStudentsInstitutionComponent;
  let fixture: ComponentFixture<PgStudentsInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgStudentsInstitutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgStudentsInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
