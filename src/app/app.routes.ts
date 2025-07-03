import { Routes } from '@angular/router';

import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { UploadComponent } from './components/upload/upload.component';
import { ConsultationFormComponent } from './components/consultation-form/consultation-form.component';
import { ConsultationListComponent } from './components/consultation-list/consultation-list.component';

// No more login or auth guard imports

export const routes: Routes = [
  { path: '', redirectTo: '/fournisseurs', pathMatch: 'full' },

  { path: 'fournisseurs', component: FournisseurListComponent },
  { path: 'produits', component: ProduitListComponent },
  { path: 'upload', component: UploadComponent },

  { path: 'consultation', component: ConsultationFormComponent },
  { path: 'consultations', component: ConsultationListComponent },
];
