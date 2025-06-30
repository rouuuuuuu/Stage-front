import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FournisseurListComponent } from './components/fournisseur-list/fournisseur-list.component';
import { ProduitListComponent } from './components/produit-list/produit-list.component';
import { UploadComponent } from './components/upload/upload.component';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    NgIf,
    FournisseurListComponent,
    ProduitListComponent,
    UploadComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FOURNISSEURS';
  selectedSection: 'fournisseurs' | 'produits' | 'upload' | null = null;
  menuOpen = false;
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  showSection(section: 'fournisseurs' | 'produits' | 'upload') {
    this.selectedSection = section;
    this.searchTerm = ''; // reset search on section change
    this.closeMenu(); // close dropdown menu
  }

  onSearch() {
    console.log('Searching for:', this.searchTerm);
    // add real filtering later
  }
}