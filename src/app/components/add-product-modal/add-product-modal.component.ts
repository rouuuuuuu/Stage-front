import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service'; // adapte le chemin selon ta structure
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

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      categorie: ['', Validators.required],
      prix: ['', Validators.required]
    });
  }

  ajouterProduit() {
    if (this.form.valid) {
      this.api.addNouveauProduit(this.form.value).subscribe(p => {
        this.produitAjoute.emit(p); // on le renvoie au parent
        this.form.reset();
      });
    }
  }
}
