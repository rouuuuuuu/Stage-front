import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // 🔄 Upload de fichiers (Sprint 1)
  uploadFile(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post(`${this.baseUrl}/files/upload`, formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    });
  }

  // 🔍 Autocomplétion de produits
  searchProduits(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/produits/search?query=${query}`);
  }

  // 📝 Envoi de consultation client
  // api.service.ts
postConsultation(dto: any) {
  return this.http.post('http://localhost:8080/api/consultations', dto);
}


  // ➕ Ajouter un nouveau produit
  addNouveauProduit(produit: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/produits/nouveau`, produit);
  }

  // 📋 Liste des consultations enregistrées
 getConsultations() {
  return this.http.get<any[]>('http://localhost:8080/api/consultations');
}
}
