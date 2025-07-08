export interface Produit {
  id: number;
  nom: string;
  categorie: string;
  prixUnitaire: number;
   fournisseurId?: number;
  fournisseurNom?: string;
 }

