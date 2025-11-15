import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Artiste, ArtisteService } from '../Services/artiste-service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../notifications/notifications';
import { NotificationsService } from '../Services/notifications-service';
import { Events } from '../Services/events-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-artiste-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './artiste-detail.html',
  styleUrl: './artiste-detail.css',
})
export class ArtistsDetail implements OnInit{

  artiste?: Artiste;
  editedArtiste?: Artiste;
  events?: Observable<Events[]>;

  isDeleted = false;


  constructor(
    private artistService: ArtisteService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    this.artistService.getArtistById(id).subscribe({
      next: (artiste: Artiste) => {
        this.artiste = artiste;
        this.editedArtiste = { ...artiste };
        this.events = this.artistService.getEvents(this.artiste.id);
      },
      error : (err) => {
        console.error('Erreur lors de la récupération de l\'Artiste : ', err);
        this.notificationService.show('Impossible de charger l\'Artiste.', 'error');
      }
    })
  }

  saveArtist() {
    if (!this.editedArtiste) {
      this.notificationService.show("Aucun artiste chargé !", 'error');
      return;
    }

    const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 -]*$/;


    if ((this.editedArtiste.label).length < 3) {
      this.notificationService.show('Le label doit contenir au minimum 3 lettres', 'error');
      return;
    }

    if (!pattern.test(this.editedArtiste.label)) {
      this.notificationService.show('Le label n\'est pas valide', 'error');
      return;
    }

    this.artistService.updateArtist(this.editedArtiste.id, this.editedArtiste).subscribe({
      next: (updatedArtist) => {
        this.artiste = { ...updatedArtist };
        this.editedArtiste = { ...updatedArtist };
        this.notificationService.show("Artiste mis à jour",'success')
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour : ", err);
        this.notificationService.show("Erreur lors de la mise à jour", 'error');
      },
    });
  }

  supprimerArtist():void {

    if (!this.artiste) {
      this.notificationService.show("Aucun Artiste chargé !", 'error');
      return;
    }

    const confirmation = confirm(`Es-tu sûr de vouloir supprimer "${this.artiste.label}" ?`);
    if (!confirmation) {
      this.notificationService.show("Suppression annulée", 'error');
      return;
    }

    this.isDeleted = true;
    this.artistService.deleteArtist(this.artiste.id).subscribe( {
      next: () => {
        this.notificationService.show('Artiste supprimé avec succès', 'success');
        this.router.navigate(['/artistes']);
        this.isDeleted = false;
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        this.notificationService.show('Une erreur est survenue lors de la suppression', 'error');
        this.isDeleted = false;
      }
    })
  }

}
