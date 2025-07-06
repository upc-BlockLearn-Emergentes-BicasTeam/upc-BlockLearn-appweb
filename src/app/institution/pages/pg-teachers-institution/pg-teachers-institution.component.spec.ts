import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgTeachersInstitutionComponent } from './pg-teachers-institution.component';

describe('PgTeachersInstitutionComponent', () => {
  let component: PgTeachersInstitutionComponent;
  let fixture: ComponentFixture<PgTeachersInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgTeachersInstitutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgTeachersInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
