import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ProduitService } from '../../services/produit.service';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product-modal',
  standalone: true,
  templateUrl: './add-product-modal.component.html',
  imports: [
      CommonModule,
      ReactiveFormsModule,
    ]
  
})
export class AddProductModalComponent {
  @Output() produitAjoute = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private produitService: ProduitService) {
  this.form = this.fb.group({
    nom: ['', Validators.required],
    categorie: ['', Validators.required],
    prixUnitaire: ['', Validators.required]  // match DTO field
  });
}

ajouterProduit() {
  if (this.form.valid) {
    const produitData = this.form.value;
    this.produitService.addProduit(produitData).subscribe(p => {
      this.produitAjoute.emit(p);
      this.form.reset();
    });
  }
  }
}
