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

  // Déclaration d'une variable Artiste qui récupèrera les infos que nous allons entrer.
  artiste: Artiste = {
    id: undefined as any,
    label: '',
  };

  // Histoire de bloquer le bouton d'envoi en cas de chargement de la page
  isSubmitting = false;

  constructor(
    private router: Router,
    private artistService: ArtisteService,
    private notificationService: NotificationsService
  ) {}

  createArtist(): void {

    // On déclare un pattern auquel devra se confronter le label.
    const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 -]*$/;


    // Si le label contient moins de 3 caractères :
    if((this.artiste.label).length < 3 ) {
      this.notificationService.show('Le label doit contenir au minimum 3 caractères', 'error');
      return;
    }

    // Si le label n'est pas conforme au pattern.
    if (!pattern.test(this.artiste.label)) {
      this.notificationService.show('Le label n\'est pas valide', 'error');
      return;
    }

    // Si toutes les vérifications sont validés, on bloque le bouton.
    this.isSubmitting = true;
    
    this.artistService.createArtist(this.artiste).subscribe({
      next: (createdArtist) => {
        // L'artiste est bien enregistré dans la base, on redirige sur la page de l'artiste crée
        this.notificationService.show('Artiste crée avec succés', 'success');
        this.router.navigate([`/artistes/${createdArtist.id}`]);
        this.isSubmitting = false; 
       
      },
      error : (err) => {
        // Une erreur est survenu, on l'informe dans les logs.
        console.error('Erreur lors de la création de l\'artiste : ', err);
        this.notificationService.show('Une erreur est survenue lors de la création', 'error');
        this.isSubmitting = false; 
      }

    });
  }

}
