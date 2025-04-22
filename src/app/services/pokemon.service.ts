import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://api.pokedexercice.ch';

  constructor(private http: HttpClient) {}

  // Récupère toutes les espèces connues par l'utilisateur
  getDiscoveredSpecies(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/species`, { headers });
  }

  // Récupère les détails d'un Pokémon par ID
  getSpeciesDetail(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/species/${id}`, { headers });
  }

  // Permet de capturer un Pokémon via son ID
  capturePokemon(pokemonId: number): Observable<any> {
    const token = localStorage.getItem('trainerToken');
    if (!token) {
      console.error('Jeton d’entraîneur introuvable. Reconnexion requise.');
      return new Observable((observer) => {
        observer.error('Token manquant. Merci de vous reconnecter.');
      });
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/pokemons/${pokemonId}/capture`, {}, { headers });
  }
}
