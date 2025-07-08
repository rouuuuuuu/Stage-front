import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Produit } from '../../models/Produits.model';
import { ProduitService } from '../../services/produit.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produit-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.css']
})
export class ProduitListComponent implements OnInit {
  @Input() searchTerm: string = '';

  produits: Produit[] = [];
  allProduits: Produit[] = [];
  isLoading = false;
  errorMessage = '';

  currentPage = 0;
  pageSize = 10;
  totalPages = 1;

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(page: number = 0): void {
    this.isLoading = true;
    this.produitService.getProduits(page, this.pageSize).subscribe({
      next: (data) => {
        this.produits = data.content;
        this.allProduits = data.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  get filteredProduits(): Produit[] {
    if (!this.searchTerm.trim()) return this.produits;
    const term = this.searchTerm.toLowerCase();
    return this.produits.filter(p =>
  p.nom.toLowerCase().includes(term) ||
  p.categorie.toLowerCase().includes(term) ||
  (p.fournisseurNom?.toLowerCase().includes(term) ?? false)
);

    
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.loadProduits(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.loadProduits(this.currentPage - 1);
    }
  }
}
