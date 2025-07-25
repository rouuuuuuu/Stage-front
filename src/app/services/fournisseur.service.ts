import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur } from '../models/Fournisseurs.model';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index (zero-based)
}

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiURL = 'http://localhost:8080/api/fournisseurs';

  constructor(private http: HttpClient) {}

  getFournisseursPagedFiltered(
  currentPage: number,
  pageSize: number,
  filters: {
    minMontantTotal?: number | null;
    maxMontantTotal?: number | null;
    minNotation?: number | null;
    categorie?: string | null;
    nomProduit?: string | null;
    devise?: string | null;
    maxDelai?: number | null;
  },
  currentSort: string
): Observable<PageResponse<Fournisseur>> {
  let params = new HttpParams()
    .set('page', currentPage.toString())
    .set('size', pageSize.toString());

  if (currentSort) {
    params = params.set('sort', currentSort);
  }

  // 💥 Changed names to match the backend
  if (filters.minMontantTotal != null)
    params = params.set('minMontantTotalDernier', filters.minMontantTotal.toString());
  if (filters.maxMontantTotal != null)
    params = params.set('maxMontantTotalDernier', filters.maxMontantTotal.toString());

  if (filters.minNotation != null)
    params = params.set('minNotation', filters.minNotation.toString());
  if (filters.categorie)
    params = params.set('categorie', filters.categorie);
  if (filters.nomProduit)
    params = params.set('nomProduit', filters.nomProduit);
  if (filters.devise)
    params = params.set('devise', filters.devise);
  if (filters.maxDelai != null)
    params = params.set('maxDelai', filters.maxDelai.toString());

  return this.http.get<PageResponse<Fournisseur>>(`${this.apiURL}/filter`, { params });
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

  getAllFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.apiURL);
  }
}
