import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-pokemon-detail',
  imports: [CommonModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit {
  pokemon: any = null;
  errorMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const token = localStorage.getItem('trainerToken');

    if (!id || !token) {
      this.errorMessage = 'Jeton manquant ou ID invalide.';
      this.isLoading = false;
      return;
    }

    this.pokemonService.getSpeciesDetail(id, token).subscribe({
      next: (res) => {
        this.pokemon = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement détail Pokémon :', err);
        this.errorMessage = 'Impossible de charger ce Pokémon.';
        this.isLoading = false;
      }
    });
  }
}
