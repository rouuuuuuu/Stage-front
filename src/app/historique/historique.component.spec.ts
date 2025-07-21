import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueConsultationsComponent } from './historique.component';

describe('HistoriqueComponent', () => {
  let component: HistoriqueConsultationsComponent;
  let fixture: ComponentFixture<HistoriqueConsultationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueConsultationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriqueConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
