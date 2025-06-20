import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgStudentCertificatesComponent } from './pg-student-certificates.component';

describe('PgStudentCertificatesComponent', () => {
  let component: PgStudentCertificatesComponent;
  let fixture: ComponentFixture<PgStudentCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgStudentCertificatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgStudentCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
