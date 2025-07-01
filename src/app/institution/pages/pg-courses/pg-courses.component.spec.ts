import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgCoursesComponent } from './pg-courses.component';

describe('PgCoursesComponent', () => {
  let component: PgCoursesComponent;
  let fixture: ComponentFixture<PgCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
