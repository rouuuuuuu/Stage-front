import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']  // ✅ Plural, not 'styleUrl'
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadMessage: string = '';

  constructor(private api: ApiService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
    this.uploadMessage = '';
    this.uploadProgress = 0;
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.api.uploadFile(this.selectedFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadMessage = 'Fichier uploadé avec succès! 💖';
          this.resetUpload();
        }
      },
      error: (err) => {
        this.uploadMessage = `Erreur: ${err.error?.message || 'Échec de l\'upload 😓'}`;
        this.resetUpload();
      }
    });
  }

  private resetUpload() {
    this.selectedFile = null;
    this.uploadProgress = 0;
    setTimeout(() => {
      this.uploadMessage = '';
    }, 5000);
  }
}
