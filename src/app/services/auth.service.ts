import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Change as needed

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
  return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
    tap(response => {
      if (response.token) {
        localStorage.setItem('token', response.token);  // save token for later
      }
    })
  );
}
}