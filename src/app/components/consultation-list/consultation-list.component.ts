import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
})
export class ConsultationListComponent implements OnInit {
  consultations: any[] = [];
  filteredConsultations: any[] = [];
  searchTerm: string = '';

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations() {
  this.apiService.getConsultations().subscribe({
    next: (data: any) => {
      console.log('All consultations from API:', data);

      if (data && Array.isArray(data.content)) {
        this.consultations = data.content;
        this.filteredConsultations = [...data.content];
      } else {
        console.error("Unexpected response format:", data);
        this.consultations = [];
        this.filteredConsultations = [];
      }
    },
    error: (err) => {
      console.error('Erreur chargement consultations', err);
      if (err.status === 403 && isPlatformBrowser(this.platformId)) {
        alert("Accès refusé : vérifie les autorisations backend !");
      }
    }
  });
}


  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredConsultations = this.consultations;
      return;
    }

    this.filteredConsultations = this.consultations.filter(c => {
      const clientName = c.client?.nom?.toLowerCase() || '';
      const descMatch = c.description?.toLowerCase().includes(term);
      const produitsMatch = c.produitsDemandes?.some((p: any) =>
        p.nom?.toLowerCase().includes(term)
      );
      return clientName.includes(term) || descMatch || produitsMatch;
    });
  }
}
