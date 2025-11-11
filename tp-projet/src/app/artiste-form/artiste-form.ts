import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Artiste, ArtisteService } from '../Services/artiste-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artiste-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artiste-form.html',
  styleUrl: './artiste-form.css',
})
export class ArtisteForm {

  artiste: Artiste = {
    id: undefined as any,
    label: '',
  };

  constructor(
    private router: Router,
    private artistService: ArtisteService
  ) {}

  createArtist(): void {

    if((this.artiste.label).length < 3 ) {
      alert("Le label doit contenir au minimum 3 lettres")
      return;
    }
    
    this.artistService.createArtist(this.artiste).subscribe({
      next: (createdArtist) => {
        alert('Artiste crée avec succés !');
        this.router.navigate([`/artistes/${createdArtist.id}`]);
      },
      error : (err) => console.error('Erreur lors de la création de l\'artiste : ', err)
    });
  }
  
  

}
