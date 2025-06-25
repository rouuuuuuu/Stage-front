import { Component, inject } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadMessage: string = '';

  constructor(private http: HttpClient){}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
    this.uploadMessage = '';
    this.uploadProgress = 0;
  }

  uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    
    const headers = new HttpHeaders({
      'Accept':'application.json'
    })
    this.http.post('http://localhost:8080/api/files/upload', formData, {
      headers:headers,
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadMessage = 'Fichier uploadé avec succès!';
          this.resetUpload();
        }
      },
      error: (err) => {
        this.uploadMessage = `Erreur: ${err.error?.message || 'Échec de l\'upload'}`;
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