export interface Facture {
  id: number;
  date: string; // or Date if you parse it
  montantTotal: number;
  delaiLivraison: number;
  prixproduit: number;
}

export interface Fournisseur {
  id: number;
  nom: string;
  adresse: string;
  email: string;
  notation: number;
  num?: number;
  fax?: number;

  prix?: number;
  delai?: number;
  devise?: string;

  factures?: Facture[]; // ADD THIS to match backend data
}
