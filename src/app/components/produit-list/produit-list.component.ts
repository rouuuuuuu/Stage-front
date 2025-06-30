import { Component, OnInit, Input } from '@angular/core';  // <-- Input added
import { CommonModule } from '@angular/common';
import { Produit } from '../../models/Produits.model';
import { ProduitService } from '../../services/produit.service';

@Component({
  selector: 'app-produit-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.css']
})
export class ProduitListComponent implements OnInit {
  @Input() searchTerm: string = '';  // <-- search input from parent

  isLoading = true;
  errorMessage = '';
  produits: Produit[] = [];

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.isLoading = true;
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Filtered produits based on searchTerm
  get filteredProduits(): Produit[] {
    if (!this.searchTerm.trim()) return this.produits;
    const term = this.searchTerm.toLowerCase();
    return this.produits.filter(p =>
      p.nom.toLowerCase().includes(term) 
    );
  }

  // Other methods (edit, delete...) go here as usual

}
