import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarInstitutionComponent } from './sidebar-institution.component';

describe('SidebarInstitutionComponent', () => {
  let component: SidebarInstitutionComponent;
  let fixture: ComponentFixture<SidebarInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarInstitutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
