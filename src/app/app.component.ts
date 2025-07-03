import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FOURNISSEURS';
  menuOpen = false;
  searchTerm = '';

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onSearch() {
    console.log('Searching for:', this.searchTerm);
  }

  // Removed logout() and authService references since no login anymore

  // Remove these getters since no auth
  // get isLoggedIn(): boolean {
  //   return false; // or true if you want to always treat as logged in
  // }
  //
  // get isAdmin(): boolean {
  //   return false;
  // }
  //
  // get isClient(): boolean {
  //   return false;
  // }
}
