import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgBlockchainTeacherComponent } from './pg-blockchain-teacher.component';

describe('PgBlockchainInstitutionComponent', () => {
  let component: PgBlockchainTeacherComponent;
  let fixture: ComponentFixture<PgBlockchainTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgBlockchainTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgBlockchainTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
