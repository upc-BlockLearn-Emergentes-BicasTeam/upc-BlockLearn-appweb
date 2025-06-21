import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgTeachersComponent } from './pg-teachers.component';

describe('PgTeachersComponent', () => {
  let component: PgTeachersComponent;
  let fixture: ComponentFixture<PgTeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgTeachersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
