import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  //  Upload de fichiers 
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

  //  Autocomplétion de produits
  searchProduits(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/produits/search?query=${query}`);
  }

  // Envoi de consultation client
postConsultation(dto: any) {
  return this.http.post('http://localhost:8080/api/consultations', dto);
}


  // Ajouter un nouveau produit
  addNouveauProduit(produit: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/produits/nouveau`, produit);
  }

  // Liste des consultations enregistrées
 getConsultations(clientId?: number): Observable<any[]> {
  let url = '/api/consultations';
  if (clientId) {
    url += `?clientId=${clientId}`;
  }
  return this.http.get<any[]>(url);
}

login(email: string) {
  // Assuming your backend endpoint is /api/login and expects an email param or in body
  return this.http.post<any>('http://localhost:8080/api/login', { email });
}
// Statistiques fournisseur par produits
getFournisseurStatsByProduits(produitsIds: number[]): Observable<any[]> {
  const params = produitsIds.map(id => `ids=${id}`).join('&');
  return this.http.get<any[]>(`${this.baseUrl}/factures/stats?${params}`);
}


  getFournisseurs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/fournisseurs`);
  }


// Récupération de toutes les factures
getAllFactures(): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/factures`);
}


}
