import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-historique-consultations',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class HistoriqueConsultationsComponent implements OnInit {
  fullHistory: any[] = [];
  filteredHistory: any[] = [];
  searchTerm: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getConsultationHistory().subscribe({
      next: (data) => {
        this.fullHistory = data.content; // paginated response
        this.filteredHistory = [...this.fullHistory];
      },
      error: (err) => console.error('Erreur chargement historique', err)
    });
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredHistory = this.fullHistory.filter(h => {
      const client = h.clientName?.toLowerCase().includes(term);
      const desc = h.description?.toLowerCase().includes(term);
      const produits = h.produitsDemandes?.some((p: string) => p.toLowerCase().includes(term));
      return client || desc || produits;
    });
  }
}
