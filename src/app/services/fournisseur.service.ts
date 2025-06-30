import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur } from '../models/Fournisseurs.model';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;  // current page index (zero-based)
}

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiURL = 'http://localhost:8080/api/fournisseurs';

  constructor(private http: HttpClient) {}

  // New paginated GET
  getFournisseursPaged(page: number, size: number): Observable<PageResponse<Fournisseur>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<Fournisseur>>(this.apiURL, { params });
  }

  getFournisseurById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiURL}/${id}`);
  }

  updateFournisseur(id: number, fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.apiURL}/${id}`, fournisseur);
  }

  deleteFournisseur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
