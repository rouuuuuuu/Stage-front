import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/Produits.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getAuthHeaders(): HttpHeaders {
    let token = null;
    if (this.isBrowser) {
      token = localStorage.getItem('token');
    }

    return token ? new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }) : new HttpHeaders({
      'Accept': 'application/json'
    });
  }

  // Upload file with JWT auth header included
  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    let token = null;
    if (this.isBrowser) {
      token = localStorage.getItem('token');
    }

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });

    return this.http.post(`${this.baseUrl}/files/upload`, formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    });
  }

  // Autocomplétion de produits
  searchProduits(query: string): Observable<Produit[]> {
    const safeQuery = query ? query.trim() : '';
    const params = new HttpParams().set('query', safeQuery);

    const headers = this.getAuthHeaders();

    return this.http.get<Produit[]>(`${this.baseUrl}/produits/search`, { params, headers });
  }

  // Envoi de consultation client
  postConsultation(clientId: number, dto: any) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/consultations/client/${clientId}`, dto, { headers });
  }

  // Ajouter un nouveau produit
  addNouveauProduit(produit: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.baseUrl}/produits/nouveau`, produit, { headers });
  }

  // Liste des consultations enregistrées
getConsultations(page: number = 0, size: number = 5, searchTerm: string = ''): Observable<any> {
  let url = `${this.baseUrl}/consultations?page=${page}&size=${size}`;
  if (searchTerm && searchTerm.trim() !== '') {
    url += `&search=${encodeURIComponent(searchTerm.trim())}`;
  }
  const headers = this.getAuthHeaders();
  return this.http.get<any>(url, { headers });
}



  // Login
  login(email: string) {
    return this.http.post<any>(`${this.baseUrl}/login`, { email });
  }

  // Statistiques fournisseur par produits
  getFournisseurStatsByProduits(produitsIds: number[]): Observable<any[]> {
    const params = produitsIds.map(id => `ids=${id}`).join('&');
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/factures/stats?${params}`, { headers });
  }

  getConsultationHistory(page: number = 0, size: number = 50) {
    return this.http.get<any>(`/api/consultations/history?page=${page}&size=${size}`);
  }

  getFournisseurs(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/fournisseurs`, { headers });
  }

  // Récupération de toutes les factures
  getAllFactures(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/factures`, { headers });
  }
}
