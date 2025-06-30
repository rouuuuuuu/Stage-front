import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Fournisseur } from '../../models/Fournisseurs.model';
import { FournisseurService } from '../../services/fournisseur.service';

@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.css']
})
export class FournisseurListComponent implements OnInit {
  @Input() searchTerm: string = '';

  fournisseurs: Fournisseur[] = [];
  editingFournisseur: Fournisseur | null = null;
  editingFournisseurCopy: Fournisseur = {} as Fournisseur;

  isLoading = true;
  errorMessage = '';

  // Paging variables
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.isLoading = true;
    this.fournisseurService.getFournisseursPaged(this.currentPage, this.pageSize).subscribe({
      next: (pageData) => {
        this.fournisseurs = pageData.content;
        this.totalPages = pageData.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des fournisseurs';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // You can keep your frontend filtering if you want, but better move to backend filtering later
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
        // After deletion, reload current page to sync data
        this.loadFournisseurs();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        this.errorMessage = 'Échec de la suppression du fournisseur.';
      }
    });
  }

  openModal(fournisseur: Fournisseur) {
    this.editingFournisseur = fournisseur;
    this.editingFournisseurCopy = { ...fournisseur };
  }

  saveChanges() {
    if (!this.editingFournisseur) return;

    const idToUpdate = this.editingFournisseur.id;
    const updated = { ...this.editingFournisseurCopy, id: idToUpdate };

    this.fournisseurService.updateFournisseur(idToUpdate, updated).subscribe({
      next: (data) => {
        // Update local list on success
        const index = this.fournisseurs.findIndex(f => f.id === idToUpdate);
        if (index !== -1) this.fournisseurs[index] = data;

        this.editingFournisseur = null;
        this.editingFournisseurCopy = {} as Fournisseur;
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert("Échec de l'enregistrement.");
      }
    });
  }

  closeModal() {
    this.editingFournisseur = null;
  }

  // Paging controls
  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadFournisseurs();
    }
  }

  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadFournisseurs();
    }
  }
}
