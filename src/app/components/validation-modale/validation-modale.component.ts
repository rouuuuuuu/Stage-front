import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Fournisseur } from '../../models/Fournisseurs.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './validation-modale.component.html',
  styleUrls: ['./validation-modale.component.css']
})
export class ValidationModalComponent implements OnInit {
  @Input() fournisseur!: Fournisseur;
  @Output() save = new EventEmitter<Fournisseur>();
@Output() close = new EventEmitter<void>();

  validationForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.validationForm = this.fb.group({
      nom: [this.fournisseur.nom, Validators.required],
      adresse: [this.fournisseur.adresse, Validators.required],
      email: [this.fournisseur.email, [Validators.required, Validators.email]],
      notation: [this.fournisseur.notation, [Validators.min(0), Validators.max(5)]]
    });
  }

  onSubmit(): void {
  if (this.validationForm.valid) {
    const updatedFournisseur: Fournisseur = {
      ...this.fournisseur,
      ...this.validationForm.value
    };
    this.save.emit(updatedFournisseur); // Send the beast back up to the parent
    this.closeModal();                  // Then close the damn modal
  }
}
closeModal(): void {
  this.close.emit();
}
}
