import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgStudentProfileComponent } from './pg-student-profile.component';

describe('PgStudentProfileComponent', () => {
  let component: PgStudentProfileComponent;
  let fixture: ComponentFixture<PgStudentProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgStudentProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgStudentProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
