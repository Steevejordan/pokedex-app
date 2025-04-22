// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PokedexComponent } from './pages/pokedex/pokedex.component';
import { PokemonDetailComponent } from './pages/pokemon-detail/pokemon-detail.component';
import { UploadPokemonComponent } from './pages/upload-pokemon/upload-pokemon.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'pokedex', component: PokedexComponent },
  { path: 'identifier', component: UploadPokemonComponent },
  { path: 'pokemon/:id', component: PokemonDetailComponent } // ← Nouvelle route
];
