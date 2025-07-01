import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { AuthService } from '../../services/auth.service'; // Don't forget this

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  templateUrl: './consultation-form.component.html',
  styleUrls: ['./consultation-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddProductModalComponent
  ]
})
export class ConsultationFormComponent implements OnInit {
  consultationForm!: FormGroup;
  produitsSuggestions: any[] = [];
  produitsSelectionnes: any[] = [];
  successMessage = '';

  modalOuvert = false;

  @Output() close = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService // Inject AuthService here
  ) {}

  ngOnInit(): void {
    this.consultationForm = this.fb.group({
      description: ['', Validators.required],
      produitRecherche: ['']
    });

    this.consultationForm.get('produitRecherche')?.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(query => this.apiService.searchProduits(query))
      )
      .subscribe(data => {
        this.produitsSuggestions = data;
      });
  }

  ajouterProduit(produit: any) {
    this.produitsSelectionnes.push(produit);
    this.consultationForm.get('produitRecherche')?.reset();
  }

  ouvrirModal() {
    this.modalOuvert = true;
  }

  fermerModal() {
    this.close.emit();
    this.modalOuvert = false;
  }

  supprimerProduit(produit: any) {
    this.produitsSelectionnes = this.produitsSelectionnes.filter(p => p !== produit);
  }

  gererProduitAjoute(produit: any) {
    this.produitsSelectionnes.push(produit);
    this.modalOuvert = false;
  }

  envoyerConsultation() {
    if (this.consultationForm.invalid) {
      this.successMessage = 'Veuillez écrire une description.';
      setTimeout(() => this.successMessage = '', 3000);
      return;
    }
    if (this.produitsSelectionnes.length === 0) {
      this.successMessage = 'Veuillez sélectionner au moins un produit.';
      setTimeout(() => this.successMessage = '', 3000);
      return;
    }

    const currentClient = this.authService.getCurrentClient();
    if (!currentClient) {
      this.successMessage = 'Utilisateur non connecté.';
      return;
    }

    const dto = {
      clientId: currentClient.id,    // <== DYNAMIC client ID, baby
      description: this.consultationForm.value.description,
      produitsIds: this.produitsSelectionnes.map(p => p.id)
    };

    console.log('DTO envoyé au backend:', dto);

    this.apiService.postConsultation(dto).subscribe({
      next: res => {
        console.log('Consultation envoyée avec succès !', res);
        this.successMessage = 'Consultation envoyée avec succès !';
        this.consultationForm.reset();
        this.produitsSelectionnes = [];

        setTimeout(() => this.successMessage = '', 3000);
      },
      error: err => {
        console.error('Erreur lors de l’envoi de la consultation', err);
      }
    });
  }
}
