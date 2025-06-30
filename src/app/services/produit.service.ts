import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/Produits.model';

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiURL = 'http://localhost:8080/api/produits';

  constructor(private http: HttpClient) {}

  getProduits(page: number, size: number): Observable<Page<Produit>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Produit>>(this.apiURL, { params });
  }

  getProduitById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiURL}/${id}`);
  }

  updateProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiURL}/${id}`, produit);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  createProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiURL, produit);
  }
}
