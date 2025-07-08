import { Produit } from './Produits.model';
import { Fournisseur } from './Fournisseurs.model';

export interface Facture {
  id: number;
  date: Date;
  montantTotal: number;
  delaiLivraison: number;
  prixproduit: number;

  // Optional relations
  fournisseur?: Fournisseur;
  produits?: Produit[];
}
