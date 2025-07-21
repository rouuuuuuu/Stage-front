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
  minMontantTotal: null,
  maxMontantTotal: null,
  minNotation: null,
  categorie: null,
  nomProduit: null,
  maxDelai: null,
  devise: ''
};

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
              montantTotal: facture?.prixproduit, // 👈 renamed from prix
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
      const montant = (f as any).montantTotal ?? 0; // 👈 changed from f.prix
      const delai = f.delai ?? 0;
      const notation = f.notation ?? 0;
      const score = montant + delai - notation;

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
      MontantTotal: (f as any).montantTotal ?? 'N/A', // 👈 changed from Prix
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
      ['ID', 'Nom', 'Adresse', 'Email', 'Note', 'Montant Total', 'Délai', 'Devise'], // 👈 header changed
      ...this.fournisseurs.map(f => [
        f.id,
        f.nom,
        f.adresse,
        f.email,
        f.notation ?? 'N/A',
        (f as any).montantTotal ?? 'N/A', // 👈 changed from prix
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
            paddingLeft: () => 0,
            paddingRight: () => 0,
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
