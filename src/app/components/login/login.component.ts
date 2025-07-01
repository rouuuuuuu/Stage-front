import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLogin = true;
  nom = '';
  email = '';
  password = '';
  role = 'CLIENT';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = '';
  }

  submit() {
    this.error = '';

    if (this.isLogin) {
      this.authService.login(this.email.trim(), this.password).subscribe({
        next: client => {
          this.authService.setCurrentClient(client);
          const target = client.role === 'ADMIN' ? '/produits' : '/consultation';
          this.router.navigate([target]);
        },
        error: err => {
          if (err.status === 401) {
            this.error = 'Email ou mot de passe incorrect.';
          } else {
            this.error = 'Erreur de connexion : ' + (err.error?.message || 'Erreur inconnue.');
          }
        }
      });
    } else {
      const newClient = {
        nom: this.nom.trim(),
        email: this.email.trim(),
        password: this.password,
        role: this.role
      };
      this.authService.register(newClient).subscribe({
        next: client => {
          this.authService.setCurrentClient(client);
          const target = client.role === 'ADMIN' ? '/produits' : '/consultation';
          this.router.navigate([target]);
        },
        error: err => {
          if (err.status === 409) {
            this.error = 'Email déjà utilisé.';
          } else {
            this.error = 'Erreur d\'inscription : ' + (err.error?.message || 'Erreur inconnue.');
          }
        }
      });
    }
  }
}
