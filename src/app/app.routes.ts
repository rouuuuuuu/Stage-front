import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component'; // Import your login standalone component
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { UploadComponent } from './components/upload/upload.component';
import { ConsultationFormComponent } from './components/consultation-form/consultation-form.component';
import { ConsultationListComponent } from './components/consultation-list/consultation-list.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // <== LOGIN as the main route now

  { path: 'fournisseurs', component: FournisseurListComponent },
  { path: 'produits', component: ProduitListComponent },
  { path: 'upload', component: UploadComponent },

  { path: 'consultation', component: ConsultationFormComponent },
  { path: 'consultations', component: ConsultationListComponent },
];
