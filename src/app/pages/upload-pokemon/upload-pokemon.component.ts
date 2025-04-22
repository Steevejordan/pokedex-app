import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-upload-pokemon',
  imports: [CommonModule],
  templateUrl: './upload-pokemon.component.html',
  styleUrls: ['./upload-pokemon.component.scss']
})
export class UploadPokemonComponent {
  selectedFile: File | null = null;
  message: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.message = '';
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      this.message = 'Merci de sélectionner un fichier.';
      return;
    }

    const token = localStorage.getItem('trainerToken');
    if (!token) {
      this.message = 'Jeton manquant. Veuillez vous reconnecter.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.loading = true;
    this.http.post('https://api.pokedexercice.ch/species/identify', formData, { headers }).subscribe({
      next: (res: any) => {
        this.loading = false;
        const data = res.data;
        this.message = `Espèce reconnue : ${data.name} (ID ${data.id})`;
      },
      error: () => {
        this.loading = false;
        this.message = 'Erreur lors de l’identification. Vérifie le nom ou réessaye.';
      }
    });
  }
}
