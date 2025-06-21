import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockchainStudentComponent } from './blockchain-student.component';

describe('BlockchainStudentComponent', () => {
  let component: BlockchainStudentComponent;
  let fixture: ComponentFixture<BlockchainStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockchainStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockchainStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
