import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

 
@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.css'],
  standalone: true,
   imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule 
  ],
})
export class ConsultationListComponent implements OnInit {
  consultations: any[] = [];
  filteredConsultations: any[] = [];
  searchTerm: string = '';
 currentClientId?: number;

  constructor(private apiService: ApiService, private authService: AuthService) {}

 ngOnInit(): void {
  this.authService.currentClient$.subscribe(client => {
    if (client) {
      this.currentClientId = client.id;
      this.loadConsultations();
    }
  });
}

loadConsultations() {
  this.apiService.getConsultations().subscribe({
    next: (data) => {
      console.log('All consultations from API:', data);
      this.consultations = data;
      this.filteredConsultations = [...data];
    },
    error: (err) => console.error('Erreur chargement consultations', err)
  });
}


  onSearch() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredConsultations = this.consultations;
      return;
    }
    this.filteredConsultations = this.consultations.filter(c => {
      const clientMatch = c.clientId?.toString().includes(term);
      const descMatch = c.description?.toLowerCase().includes(term);
      const produitsMatch = c.produitsDemandes?.some((p: any) => p.nom.toLowerCase().includes(term));
      return clientMatch || descMatch || produitsMatch;
    });
  }
}

