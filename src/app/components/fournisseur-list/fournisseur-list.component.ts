import { Component, OnInit, Input } from '@angular/core';  // Input included
import { CommonModule, NgIf } from '@angular/common';
import { Fournisseur } from '../../models/Fournisseurs.model';
import { FournisseurService } from '../../services/fournisseur.service';
import { FormsModule } from '@angular/forms'; // <-- ADD THIS

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.css']
})
export class FournisseurListComponent implements OnInit {
  @Input() searchTerm: string = '';  // Search term input from parent

  isLoading = true;
  errorMessage = '';
  fournisseurs: Fournisseur[] = [];
  editingFournisseur: Fournisseur | null = null;
  editingFournisseurCopy: Fournisseur = {} as Fournisseur;


  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.isLoading = true;
    this.fournisseurService.getFournisseur().subscribe({
      next: (data) => {
        this.fournisseurs = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des fournisseurs';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Filter fournisseurs based on searchTerm (case-insensitive)
  get filteredFournisseurs(): Fournisseur[] {
    if (!this.searchTerm.trim()) return this.fournisseurs;
    const term = this.searchTerm.toLowerCase();
    return this.fournisseurs.filter(f =>
      f.nom.toLowerCase().includes(term) ||
      f.adresse.toLowerCase().includes(term) ||
      f.email.toLowerCase().includes(term)
    );
  }

  deleteFournisseur(id: number): void {
    if (!confirm('Tu veux vraiment supprimer ce fournisseur ?')) return;
    this.fournisseurService.deleteFournisseur(id).subscribe({
      next: () => {
        this.fournisseurs = this.fournisseurs.filter(f => f.id !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        this.errorMessage = 'Échec de la suppression du fournisseur.';
      }
    });
  }






saveChanges() {
  if(this.editingFournisseurCopy) {
    this.onSave(this.editingFournisseurCopy);
  }
}

  openModal(fournisseur: Fournisseur) {
  this.editingFournisseur = fournisseur;
  this.editingFournisseurCopy = { ...fournisseur }; // Clone it properly for editing
}

onSave(updated: Fournisseur) {
  if (!updated || !this.editingFournisseur) return;

  this.fournisseurService.updateFournisseur(updated.id, updated).subscribe({
    next: (data) => {
      const index = this.fournisseurs.findIndex(f => f.id === data.id);
      if (index !== -1) {
        this.fournisseurs[index] = data; // Replace in list
      }
      this.editingFournisseur = null;
      this.editingFournisseurCopy = {} as Fournisseur;
    },
    error: (err) => {
      console.error('Erreur lors de la mise à jour', err);
    }
  });
}


  closeModal() {
    this.editingFournisseur = null; // cancel edit
  }
}
