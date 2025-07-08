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

  // Pagination
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  // Filters: expanded and typed
  filters: {
    minPrix: number | null;
    maxPrix: number | null;
    minNotation: number | null;
    categorie: string | null;
    nomProduit: string | null;
    maxDelai: number | null;
    devise: string;
  } = {
    minPrix: null,
    maxPrix: null,
    minNotation: null,
    categorie: null,
    nomProduit: null,
    maxDelai: null,
    devise: ''
  };

  // Track best match fournisseur's ID
  meilleurFournisseurId: number | null = null;

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
  this.isLoading = true;
  this.errorMessage = '';

  this.fournisseurService
    .getFournisseursPagedFiltered(this.currentPage, this.pageSize, this.filters)
    .subscribe({
      next: (pageData) => {
        this.fournisseurs = pageData.content.map(f => {
          const facture = f.factures && f.factures.length > 0 ? f.factures[0] : undefined;
          return {
            ...f,
            prix: facture?.prixproduit,
            delai: facture?.delaiLivraison,
            devise: facture ? 'TND' : undefined, // or replace with your logic for devise
          };
        });
        this.totalPages = pageData.totalPages;
        this.meilleurFournisseurId = this.getBestMatchId(this.fournisseurs);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des fournisseurs';
        this.isLoading = false;
        console.error('Load error:', err);
      }
    });
}

  applyFilters(): void {
    this.currentPage = 0; // Reset page when filters change
    this.loadFournisseurs();
  }

  getBestMatchId(fournisseurs: Fournisseur[]): number | null {
    if (fournisseurs.length === 0) return null;

    // Simple scoring: prix + delai - notation, lower better
    let bestScore = Infinity;
    let bestId: number | null = null;

    for (const f of fournisseurs) {
      const prix = f.prix ?? 0;
      const delai = f.delai ?? 0;
      const notation = f.notation ?? 0;
      const score = prix + delai - notation;

      if (score < bestScore) {
        bestScore = score;
        bestId = f.id;
      }
    }

    return bestId;
  }

  deleteFournisseur(id: number): void {
    if (!confirm('Tu veux vraiment supprimer ce fournisseur ?')) return;

    this.fournisseurService.deleteFournisseur(id).subscribe({
      next: () => this.loadFournisseurs(),
     error: (err) => {
  if (err.status === 500) {
    alert("Ce fournisseur ne peut pas être supprimé car certains produits sont utilisés dans des consultations.");
  } else {
    alert("Erreur inconnue. Essaie encore.");
  }
}

    });
  }

  openModal(fournisseur: Fournisseur): void {
    this.editingFournisseur = fournisseur;
    this.editingFournisseurCopy = { ...fournisseur };
  }

  saveChanges(): void {
    if (!this.editingFournisseur) return;

    const idToUpdate = this.editingFournisseur.id;
    const updated: Fournisseur = { ...this.editingFournisseurCopy, id: idToUpdate };

    this.fournisseurService.updateFournisseur(idToUpdate, updated).subscribe({
      next: (updatedFournisseur) => {
        const idx = this.fournisseurs.findIndex(f => f.id === idToUpdate);
        if (idx !== -1) this.fournisseurs[idx] = updatedFournisseur;
        this.editingFournisseur = null;
        this.editingFournisseurCopy = {} as Fournisseur;
      },
      error: (err) => {
        console.error('Échec de la mise à jour:', err);
        alert("Échec de l'enregistrement.");
      }
    });
  }

  closeModal(): void {
    this.editingFournisseur = null;
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadFournisseurs();
    }
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadFournisseurs();
    }
  }
}
