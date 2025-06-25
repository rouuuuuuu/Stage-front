import { Fournisseur } from './Fournisseurs.model';

export interface Produit {
  id: number;
  nom: string;
  categorie: string;
  prixUnitaire: number;
  fournisseur: Fournisseur;  }