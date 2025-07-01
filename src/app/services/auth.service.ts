import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentClientSubject = new BehaviorSubject<any>(null);
  currentClient$ = this.currentClientSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const storedClient = localStorage.getItem('currentClient');
      if (storedClient) {
        this.currentClientSubject.next(JSON.parse(storedClient));
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(client: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, client);
  }

  setCurrentClient(client: any) {
    this.currentClientSubject.next(client);
    if (this.isBrowser) {
      localStorage.setItem('currentClient', JSON.stringify(client));
    }
  }

  getCurrentClient() {
    let client = this.currentClientSubject.value;
    if (!client && this.isBrowser) {
      const stored = localStorage.getItem('currentClient');
      if (stored) {
        client = JSON.parse(stored);
        this.currentClientSubject.next(client);
      }
    }
    return client;
  }

  logout() {
    this.currentClientSubject.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('currentClient');
    }
  }
}
