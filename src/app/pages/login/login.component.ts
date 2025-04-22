import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  trainerToken: string ='';

  constructor(private router: Router) {}

  onLogin() {
    if (this.trainerToken && this.trainerToken.trim() !== '') {
      localStorage.setItem('trainerToken', this.trainerToken.trim());
      this.router.navigate(['/pokedex']);
    }else{
      alert("veuillez entrer un jeton valide pour continuer.");
    }
  }

}
