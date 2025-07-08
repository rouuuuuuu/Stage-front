import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { AddProductModalComponent } from '../add-product-modal/add-product-modal.component';
import { HostListener } from '@angular/core';
import { of } from 'rxjs';

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
@HostListener('document:click', ['$event'])
onClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  
  // Check if the clicked element is NOT inside the autocomplete-wrapper
  if (!target.closest('.autocomplete-wrapper')) {
    this.produitsSuggestions = [];
  }
}

  modalOuvert = false;

  @Output() close = new EventEmitter<void>();

  // If you want to assign a static client ID for now:
  clientId: number = 1; // <=== Replace with actual client ID or remove if not needed

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.consultationForm = this.fb.group({
      description: ['', Validators.required],
      produitRecherche: ['']
    });

    this.consultationForm.get('produitRecherche')?.valueChanges
  .pipe(
    debounceTime(300),
    switchMap(query => {
      if (!query || query.trim() === '') {
        this.produitsSuggestions = [];  // Clear suggestions immediately on empty
        return of([]); // Return empty observable, no API call
      }
      return this.apiService.searchProduits(query);
    })
  )
  .subscribe(data => {
    this.produitsSuggestions = data;
  });

  }
  ajouterProduit(produit: any) {
    this.produitsSelectionnes.push(produit);
    this.consultationForm.get('produitRecherche')?.reset();
  this.produitsSuggestions = [];  // <— Clear suggestions here
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

    // Remove authService dependency
    // Just use this.clientId directly, or find another way to set it
    if (!this.clientId) {
      this.successMessage = 'Client non défini.';
      return;
    }

    const dto = {
      clientId: this.clientId,
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
