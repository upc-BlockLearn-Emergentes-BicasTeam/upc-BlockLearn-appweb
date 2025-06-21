import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgStudentBlockchainComponent } from './pg-student-blockchain.component';

describe('PgStudentBlockchainComponent', () => {
  let component: PgStudentBlockchainComponent;
  let fixture: ComponentFixture<PgStudentBlockchainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgStudentBlockchainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgStudentBlockchainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
