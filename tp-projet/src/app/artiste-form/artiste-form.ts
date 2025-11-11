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

  notificationMessage = '';
  notificationType: 'success' | 'error' | '' = '';

  constructor(
    private router: Router,
    private artistService: ArtisteService
  ) {}

  createArtist(): void {

    if((this.artiste.label).length < 3 ) {
      this.showNotification('Le label doit contenir au minimum 3 caractères', 'error');
      return;
    }
    
    this.artistService.createArtist(this.artiste).subscribe({
      next: (createdArtist) => {
        this.showNotification('Artiste crée avec succés !', 'success');
        setTimeout(() => {
           this.router.navigate([`/artistes/${createdArtist.id}`]);
        }, 2000);
       
      },
      error : (err) => {
        console.error('Erreur lors de la création de l\'artiste : ', err);
        this.showNotification('Une erreur est survenue lors de la création', 'error');
      }

    });
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;

    // On efface la notification après 3 secondes
    setTimeout(() => {
      this.notificationMessage = '';
      this.notificationType = '';
    }, 3000);
  }
  
  

}
