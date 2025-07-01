import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const client = this.authService.getCurrentClient();
    const url = state.url;

    console.log('AuthGuard:', { role: client?.role, url });

    if (!client) {
      this.router.navigate(['/login']);
      return false;
    }

    const role = client.role;

    if (role === 'ADMIN') {
      // Admin can go anywhere except back to /login
      if (url === '/login') {
        this.router.navigate(['/produits']);
        return false;
      }
      return true;
    }

    if (role === 'CLIENT') {
      // Client ONLY allowed to /consultation (not /consultations)
      if (url === '/consultation') {
        return true;
      }

      // Block everything else, redirect to allowed route
      this.router.navigate(['/consultation']);
      return false;
    }

    // Unknown role? Back to login with you
    this.router.navigate(['/login']);
    return false;
  }
}
