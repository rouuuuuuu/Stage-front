import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Fournisseur } from '../../models/Fournisseurs.model';
import { FournisseurService } from '../../services/fournisseur.service';
import { ValidationModalComponent } from '../validation-modale/validation-modale.component';
import { ProduitService } from '../../services/produit.service';
import { Produit } from '../../models/Produits.model';


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
  produits: any[] = [];

  // THIS is your modal controller
  editingFournisseur: Fournisseur | null = null;

constructor(
    private fournisseurService: FournisseurService,
    private produitService: ProduitService
  ) {}
  ngOnInit(): void {
    this.loadFournisseur();
    this.loadProduits();
  }

  loadFournisseur(): void {
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
   loadProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
      },
      error: (err) => {
        console.error('Erreur chargement produits', err);
      }
    });
  }
deleteFournisseur(id: number): void {
  if (!confirm('Tu veux vraiment supprimer ce fournisseur ?')) {
    return; // Chicken out if no
  }

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

  // Open modal with clone to avoid premature mutation
  openModal(fournisseur: Fournisseur) {
    this.editingFournisseur = { ...fournisseur };
  }

  // Handle modal save event
  onSave(updatedFournisseur: Fournisseur) {
    this.fournisseurService.updateFournisseur(updatedFournisseur.id, updatedFournisseur).subscribe({
      next: (data) => {
        const index = this.fournisseurs.findIndex(f => f.id === data.id);
        if (index !== -1) this.fournisseurs[index] = data;
        this.editingFournisseur = null;  // Close modal
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour', err);
      }
    });
  }

  // Optional: to close modal without saving
  closeModal() {
    this.editingFournisseur = null;
  }
}
