import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Produit } from '../models/Produits.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private apiUrl = 'http://localhost:8080/api/produits';

  constructor(private http: HttpClient) {}

  getProduits(page: number, size: number): Observable<{ content: Produit[]; totalPages: number; number: number }> {
    return this.http.get<{ content: Produit[]; totalPages: number; number: number }>(
      `${this.apiUrl}?page=${page}&size=${size}`
    );
  }
 


  addProduit(produit: Partial<Produit>): Observable<Produit> {
    return this.http.post<Produit>(`${this.apiUrl}/nouveau`, produit);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchProduits(query: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/search?query=${query}`);
  }
}
