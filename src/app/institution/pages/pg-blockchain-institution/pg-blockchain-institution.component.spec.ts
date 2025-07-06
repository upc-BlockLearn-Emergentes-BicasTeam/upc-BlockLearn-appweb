import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgBlockchainInstitutionComponent } from './pg-blockchain-institution.component';

describe('PgBlockchainInstitutionComponent', () => {
  let component: PgBlockchainInstitutionComponent;
  let fixture: ComponentFixture<PgBlockchainInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgBlockchainInstitutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgBlockchainInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
