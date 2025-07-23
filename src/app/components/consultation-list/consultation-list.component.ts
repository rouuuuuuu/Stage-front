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

  currentPage: number = 0;
  pageSize: number = 5;
  totalConsultations: number = 0; // We'll get this from the backend if available

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadConsultations(this.currentPage);
  }

  loadConsultations(page: number, searchTerm: string = '') {
  this.apiService.getConsultations(page, this.pageSize, searchTerm).subscribe({
    next: (data: any) => {
      if (data && Array.isArray(data.content)) {
        this.consultations = data.content;
        this.filteredConsultations = [...data.content]; // maybe no need if you just display consultations directly
        this.totalConsultations = data.totalElements ?? data.content.length;
        this.currentPage = page;
      } else {
          console.error('Unexpected response format:', data);
          this.consultations = [];
          this.filteredConsultations = [];
          this.totalConsultations = 0;
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

  nextPage() {
    if ((this.currentPage + 1) * this.pageSize < this.totalConsultations) {
      this.loadConsultations(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.loadConsultations(this.currentPage - 1);
    }
  }
}
