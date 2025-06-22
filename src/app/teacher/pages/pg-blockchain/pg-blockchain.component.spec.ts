import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgBlockchainComponent } from './pg-blockchain.component';

describe('PgBlockchainComponent', () => {
  let component: PgBlockchainComponent;
  let fixture: ComponentFixture<PgBlockchainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgBlockchainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgBlockchainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
