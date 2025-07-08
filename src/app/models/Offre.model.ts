import { Fournisseur } from './Fournisseurs.model';

export interface Offre {
  id: number;
  idfour: number;
  dateoffre: Date;
  datevalidite: Date;
  statut: string;

  fournisseur?: Fournisseur;
}
