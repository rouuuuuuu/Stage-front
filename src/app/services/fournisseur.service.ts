import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Fournisseur } from '../models/Fournisseurs.model';


@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
private apiURL = 'http://localhost:8080/api/Fournisseur'
  constructor(private http :HttpClient) { }
getFournisseur() : Observable<Fournisseur[]>{
  return this.http.get<Fournisseur[]>(this.apiURL);
}
getFournisseurById(id: number):Observable <Fournisseur>{
  return this.http.get<Fournisseur>('${this.apiURL}/${id}');

}
createFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.apiURL,fournisseur);
}
updateFournisseur(id: number,fournisseur:Fournisseur): Observable<Fournisseur> {
  return this.http.put<Fournisseur>( '${this.apiURL}/${id}' , fournisseur);
}
deleteFournisseur(id: number): Observable<void>{
  return this.http.delete<void>('${this.apiURL}/${id}');
}
}