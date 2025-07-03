import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fournisseur } from '../../models/Fournisseurs.model';
import { FournisseurService } from '../../services/fournisseur.service';
import { ValidationModalComponent } from '../validation-modale/validation-modale.component';
import { ProduitService } from '../../services/produit.service';
import { Produit } from '../../models/Produits.model';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index (zero-based)
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, ValidationModalComponent],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  fournisseurs: Fournisseur[] = [];
  produits: Produit[] = [];

  editingFournisseur: Fournisseur | null = null;

  constructor(
    private fournisseurService: FournisseurService,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
    this.loadProduits();
  }

  loadFournisseurs(): void {
    this.isLoading = true;
    this.fournisseurService.getFournisseursPaged(0, 10).subscribe({
      next: (data: PageResponse<Fournisseur>) => {
        this.fournisseurs = data.content;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors du chargement des fournisseurs';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadProduits(): void {
    // Adjust page & size here as needed
    this.produitService.getProduits(0, 10).subscribe({
      next: (data: PageResponse<Produit>) => {
        this.produits = data.content;
      },
      error: (err: any) => {
        console.error('Erreur chargement produits', err);
      }
    });
  }

  deleteFournisseur(id: number): void {
    if (!confirm('Tu veux vraiment supprimer ce fournisseur ?')) return;

    this.fournisseurService.deleteFournisseur(id).subscribe({
      next: () => {
        this.fournisseurs = this.fournisseurs.filter(f => f.id !== id);
      },
      error: (err: any) => {
        console.error('Erreur lors de la suppression:', err);
        this.errorMessage = 'Échec de la suppression du fournisseur.';
      }
    });
  }

  openModal(fournisseur: Fournisseur): void {
    this.editingFournisseur = { ...fournisseur }; // clone to avoid direct mutation
  }

  onSave(updatedFournisseur: Fournisseur): void {
    this.fournisseurService.updateFournisseur(updatedFournisseur.id, updatedFournisseur).subscribe({
      next: (data: Fournisseur) => {
        const index = this.fournisseurs.findIndex(f => f.id === data.id);
        if (index !== -1) this.fournisseurs[index] = data;
        this.editingFournisseur = null; // close modal
      },
      error: (err: any) => {
        console.error('Erreur lors de la mise à jour', err);
      }
    });
  }

  closeModal(): void {
    this.editingFournisseur = null;
  }
}
