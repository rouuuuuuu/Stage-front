import { Routes } from '@angular/router';



import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { UploadComponent } from './components/upload/upload.component';

export const routes: Routes = [
  { path: '', redirectTo: 'fournisseurs', pathMatch: 'full' },
  { path: 'fournisseurs', component: FournisseurListComponent },
  { path: 'produits', component: ProduitListComponent },
  { path: 'upload', component: UploadComponent },
  { path: '**', redirectTo: 'fournisseurs' }
  
];
