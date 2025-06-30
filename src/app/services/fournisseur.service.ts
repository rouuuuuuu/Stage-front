import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Fournisseur } from '../models/Fournisseurs.model';


@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
private apiURL = 'http://localhost:8080/api/fournisseurs'
  constructor(private http :HttpClient) { }
getFournisseur() : Observable<Fournisseur[]>{
  return this.http.get<Fournisseur[]>(this.apiURL);
}
getFournisseurById(id: number): Observable<Fournisseur> {
  return this.http.get<Fournisseur>(`${this.apiURL}/${id}`); // backticks here
}

updateFournisseur(id: number, fournisseur: Fournisseur): Observable<Fournisseur> {
  return this.http.put<Fournisseur>(`${this.apiURL}/${id}`, fournisseur); // backticks here
}

deleteFournisseur(id: number): Observable<void> {
  return this.http.delete<void>(`${this.apiURL}/${id}`); // backticks here
}


}