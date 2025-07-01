import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgStudentsComponent } from './pg-students.component';

describe('PgStudentsComponent', () => {
  let component: PgStudentsComponent;
  let fixture: ComponentFixture<PgStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
