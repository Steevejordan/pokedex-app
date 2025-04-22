import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-pokedex',
  imports: [CommonModule, RouterModule],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent implements OnInit {
  pokemons: any[] = [];
  errorMessage: string = '';
  capturedIds: number[] = [];

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('trainerToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.pokemonService.getDiscoveredSpecies(token).subscribe({
      next: (res) => {
        const allSpecies = res.data || [];
        this.pokemons = allSpecies.filter((p: any) => p.name !== '???');
      },
      error: () => {
        this.errorMessage = 'Impossible de récupérer les espèces de Pokémon.';
      }
    });
  }

  capturePokemon(pokemonId: number): void {
    this.pokemonService.capturePokemon(pokemonId).subscribe({
      next: () => {
        this.capturedIds.push(pokemonId);
        setTimeout(() => {
          this.capturedIds = this.capturedIds.filter(id => id !== pokemonId);
          this.ngOnInit();
        }, 3000);
      },
      error: () => {
        alert('Erreur lors de la capture du Pokémon.');
      }
    });
  }

  autoCapturePokemons(): void {
    const token = localStorage.getItem('trainerToken');
    if (!token) {
      console.error('Jeton introuvable. Reconnectez-vous.');
      return;
    }

    this.pokemonService.getDiscoveredSpecies(token).subscribe({
      next: (res) => {
        const discovered = res.data || [];
        const realPokemons = discovered.filter((p: any) => p.name !== '???');

        if (realPokemons.length === 0) {
          console.log('Aucun Pokémon découvert à capturer.');
          return;
        }

        let index = 0;

        const tryCapture = () => {
          if (index >= realPokemons.length) return;

          const current = realPokemons[index];
          this.pokemonService.capturePokemon(current.id).subscribe({
            next: () => {
              console.log(`Capture réussie pour ${current.name} (ID ${current.id})`);
            },
            error: (err) => {
              console.warn(`Échec de la capture pour ${current.name}`, err);
            },
            complete: () => {
              index++;
              setTimeout(tryCapture, 500);
            }
          });
        };

        tryCapture();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des espèces', err);
      }
    });
  }
}
