import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Fournisseur } from '../../models/Fournisseurs.model';
import { FournisseurService } from '../../services/fournisseur.service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;


@Component({
  selector: 'app-fournisseur-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.css']
})
export class FournisseurListComponent implements OnInit {
  @Input() searchTerm: string = '';

  fournisseurs: Fournisseur[] = [];
  editingFournisseur: Fournisseur | null = null;
  editingFournisseurCopy: Fournisseur = {} as Fournisseur;

  isLoading = true;
  errorMessage = '';

  // Pagination
  currentPage = 0;
  pageSize = 5;
  totalPages = 0;

  // Filters
  filters = {
    minPrix: null as number | null,
    maxPrix: null as number | null,
    minNotation: null as number | null,
    categorie: null as string | null,
    nomProduit: null as string | null,
    maxDelai: null as number | null,
    devise: ''
  };

  // Sorting
  currentSort: string = '';

  meilleurFournisseurId: number | null = null;

  constructor(private fournisseurService: FournisseurService) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.fournisseurService
      .getFournisseursPagedFiltered(
        this.currentPage,
        this.pageSize,
        this.filters,
        this.currentSort
      )
      .subscribe({
        next: (pageData) => {
          this.fournisseurs = pageData.content.map(f => {
            const facture = f.factures && f.factures.length > 0 ? f.factures[0] : undefined;
            return {
              ...f,
              prix: facture?.prixproduit,
              delai: facture?.delaiLivraison,
              devise: facture ? 'TND' : undefined,
            };
          });
          this.totalPages = pageData.totalPages;
          this.meilleurFournisseurId = this.getBestMatchId(this.fournisseurs);
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des fournisseurs';
          this.isLoading = false;
          console.error('Load error:', err);
        }
      });
  }

onSortChange(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  this.currentSort = selectElement.value;
  this.loadFournisseurs();
}


  applyFilters(): void {
    this.currentPage = 0;
    this.loadFournisseurs();
  }

  getBestMatchId(fournisseurs: Fournisseur[]): number | null {
    if (fournisseurs.length === 0) return null;

    let bestScore = Infinity;
    let bestId: number | null = null;

    for (const f of fournisseurs) {
      const prix = f.prix ?? 0;
      const delai = f.delai ?? 0;
      const notation = f.notation ?? 0;
      const score = prix + delai - notation;

      if (score < bestScore) {
        bestScore = score;
        bestId = f.id;
      }
    }

    return bestId;
  }
exportExcel(): void {
  const worksheet = XLSX.utils.json_to_sheet(this.fournisseurs.map(f => ({
    ID: f.id,
    Nom: f.nom,
    Adresse: f.adresse,
    Email: f.email,
    Note: f.notation,
    Prix: f.prix ?? 'N/A',
    Délai: f.delai ?? 'N/A',
    Devise: f.devise ?? 'N/A'
  })));

  const workbook = { Sheets: { 'Fournisseurs': worksheet }, SheetNames: ['Fournisseurs'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, 'fournisseurs.xlsx');
}
exportToPdf(): void {
  const body = [
    ['ID', 'Nom', 'Adresse', 'Email', 'Note', 'Prix', 'Délai', 'Devise'], // header row
    ...this.fournisseurs.map(f => [
      f.id,
      f.nom,
      f.adresse,
      f.email,
      f.notation ?? 'N/A',
      f.prix ?? 'N/A',
      f.delai ?? 'N/A',
      f.devise ?? 'N/A',
    ]),
  ];

  const docDefinition = {
    content: [
      { text: 'Liste des Fournisseurs', style: 'header' },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', '*', '*', 'auto', 'auto', 'auto', 'auto'],
          body: body,
        },
        layout: {
          fillColor: (rowIndex: number) => {
            return rowIndex === 0 ? '#4CAF50' : rowIndex % 2 === 0 ? '#f3f3f3' : null;
          },
          hLineColor: () => '#ddd',
          vLineColor: () => '#ddd',
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
      },
    ],
    styles: {
      header: { fontSize: 22, bold: true, margin: [0, 0, 0, 20], color: '#4CAF50' },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  (pdfMake as any).createPdf(docDefinition).download('fournisseurs.pdf');
}


  deleteFournisseur(id: number): void {
    if (!confirm('Tu veux vraiment supprimer ce fournisseur ?')) return;

    this.fournisseurService.deleteFournisseur(id).subscribe({
      next: () => this.loadFournisseurs(),
      error: (err) => {
        if (err.status === 500) {
          alert("Ce fournisseur ne peut pas être supprimé car certains produits sont utilisés dans des consultations.");
        } else {
          alert("Erreur inconnue. Essaie encore.");
        }
      }
    });
  }

  openModal(fournisseur: Fournisseur): void {
    this.editingFournisseur = fournisseur;
    this.editingFournisseurCopy = { ...fournisseur };
  }

  saveChanges(): void {
    if (!this.editingFournisseur) return;

    const idToUpdate = this.editingFournisseur.id;
    const updated: Fournisseur = { ...this.editingFournisseurCopy, id: idToUpdate };

    this.fournisseurService.updateFournisseur(idToUpdate, updated).subscribe({
      next: (updatedFournisseur) => {
        const idx = this.fournisseurs.findIndex(f => f.id === idToUpdate);
        if (idx !== -1) this.fournisseurs[idx] = updatedFournisseur;
        this.editingFournisseur = null;
        this.editingFournisseurCopy = {} as Fournisseur;
      },
      error: (err) => {
        console.error('Échec de la mise à jour:', err);
        alert("Échec de l'enregistrement.");
      }
    });
  }

  closeModal(): void {
    this.editingFournisseur = null;
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadFournisseurs();
    }
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadFournisseurs();
    }
  }
}
