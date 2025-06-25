import { Component ,OnInit } from '@angular/core';
import {Fournisseur}from '../../models/Fournisseurs.model'
import {FournisseurService}from '../../services/fournisseur.service'
import { ValidationModalComponent } from '../validation-modale/validation-modale.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, ValidationModalComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css'
})
export class DataTableComponent implements OnInit {
  isLoading = true;
  errorMessage='';
  fournisseurs : Fournisseur[]=[
    
    { id: 1, nom: 'Fournisseur A', adresse: 'Paris', email: 'a@test.com', notation: 4.5 },
    { id: 2, nom: 'Fournisseur B', adresse: 'Lyon', email: 'b@test.com', notation: 3.2 }
  ];
      produits: any[] = [
    { id: 1, nom: 'Produit 1', categorie: 'Catégorie A', prixUnitaire: 19.99, fournisseur: 'Fournisseur A' },
    { id: 2, nom: 'Produit 2', categorie: 'Catégorie B', prixUnitaire: 29.99, fournisseur: 'Fournisseur B' }
  ];

    
    constructor(private fournisseurService: FournisseurService){ }
    ngOnInit(): void {
        this.loadFournisseur();
    }
    loadFournisseur():void {
      this.isLoading = true;
      this.fournisseurService.getFournisseur().subscribe({
        next : (data)=>{
          this.fournisseurs=data;
          this.isLoading =false;
        },
        error : (err)=>{
          this.errorMessage='Erreur lors de chargement des fournisseurs';
          this.isLoading =false;
          console.error(err);
        }
      });
    }

}
//ngbootstrap yaamel fy erreur