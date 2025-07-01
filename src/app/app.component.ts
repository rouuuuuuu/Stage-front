import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service'; // Adjust the path if needed

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

  constructor(private authService: AuthService, private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onSearch() {
    console.log('Searching for:', this.searchTerm);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    return !!this.authService.getCurrentClient();
  }

  get isAdmin(): boolean {
    return this.authService.getCurrentClient()?.role === 'ADMIN';
  }

  get isClient(): boolean {
    return this.authService.getCurrentClient()?.role === 'CLIENT';
  }
}
