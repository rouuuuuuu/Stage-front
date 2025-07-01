import { Routes } from '@angular/router';

import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { UploadComponent } from './components/upload/upload.component';
import { ConsultationFormComponent } from './components/consultation-form/consultation-form.component';
import { ConsultationListComponent } from './components/consultation-list/consultation-list.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './components/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'fournisseurs', component: FournisseurListComponent, canActivate: [AuthGuard] },
  { path: 'produits', component: ProduitListComponent, canActivate: [AuthGuard] },
  { path: 'upload', component: UploadComponent, canActivate: [AuthGuard] },

  { path: 'consultation', component: ConsultationFormComponent, canActivate: [AuthGuard] },
  { path: 'consultations', component: ConsultationListComponent, canActivate: [AuthGuard] },
];
