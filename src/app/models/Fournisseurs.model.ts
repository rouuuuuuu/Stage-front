export interface Facture {
  id: number;
  date: string; // or Date if you're parsing it
  montantTotal: number;
  delaiLivraison: number;
  prixproduit: number; // keep this if you're still using it in the backend logic
}

export interface Fournisseur {
  id: number;
  nom: string;
  adresse: string;
  email: string;
  notation: number;
  num?: number;
  fax?: number;

  montantTotal?: number; // 🔥 Replaces prix
  delai?: number;
  devise?: string;

  montantTotalDernier?: any; 
  factures?: Facture[];
}
