import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Artiste, ArtisteService } from '../Services/artiste-service';
import { Router } from '@angular/router';
import { NotificationComponent } from '../notifications/notifications';
import { NotificationsService } from '../Services/notifications-service';

@Component({
  selector: 'app-artiste-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './artiste-form.html',
  styleUrl: './artiste-form.css',
})
export class ArtisteForm {

  artiste: Artiste = {
    id: undefined as any,
    label: '',
  };

  isSubmitting = false;

  constructor(
    private router: Router,
    private artistService: ArtisteService,
    private notificationService: NotificationsService
  ) {}

  createArtist(): void {

    const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 -]*$/;


    if((this.artiste.label).length < 3 ) {
      this.notificationService.show('Le label doit contenir au minimum 3 caractères', 'error');
      return;
    }

    if (!pattern.test(this.artiste.label)) {
      this.notificationService.show('Le label n\'est pas valide', 'error');
      return;
    }

    this.isSubmitting = true;
    
    this.artistService.createArtist(this.artiste).subscribe({
      next: (createdArtist) => {
        this.notificationService.show('Artiste crée avec succés', 'success');
        this.router.navigate([`/artistes/${createdArtist.id}`]);
        this.isSubmitting = false; 
       
      },
      error : (err) => {
        console.error('Erreur lors de la création de l\'artiste : ', err);
        this.notificationService.show('Une erreur est survenue lors de la création', 'error');
        this.isSubmitting = false; 
      }

    });
  }

}
