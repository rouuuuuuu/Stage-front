import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true, // you're using this, so we gotta be explicit
  imports: [FormsModule,CommonModule], // <-- include FormsModule here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { username: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // Save token
        this.router.navigate(['/fournisseurs']); // Redirect to protected route
      },
      error: () => {
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
