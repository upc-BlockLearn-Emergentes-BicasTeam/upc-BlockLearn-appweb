import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgProfileInstitutionComponent } from './pg-profile-institution.component';

describe('PgProfileInstitutionComponent', () => {
  let component: PgProfileInstitutionComponent;
  let fixture: ComponentFixture<PgProfileInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgProfileInstitutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgProfileInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
