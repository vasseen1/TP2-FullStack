import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Events, EventsService } from '../Services/events-service';
import { NotificationComponent } from '../notifications/notifications';
import { NotificationsService } from '../Services/notifications-service';
import { Artiste, ArtisteService } from '../Services/artiste-service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css'],
})
export class EventDetail implements OnInit {
  evenement?: Events;
  editedEvent?: Events;
  isDeleted = false;
  allArtists: Artiste[] = [];
  selectedArtistId: string | null = null;


  constructor(
    private eventService: EventsService,
    private artistService: ArtisteService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationsService
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    this.eventService.getEventById(id).subscribe({
      next: (evenement: Events) => {
        this.evenement = evenement;
        this.editedEvent = { ...evenement }; // Copie indépendante pour l’édition
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'évènement :', err);
        this.notificationService.show('Impossible de charger l\'évènement.', 'error');
      },
    });

    this.artistService.getAllArtists().subscribe({
      next: (artists) => (this.allArtists = artists),
      error: () => this.notificationService.show("Impossible de charger les artistes","error"),
    });
  }

  saveEvent() {
    if (!this.editedEvent) {
      this.notificationService.show("Aucun évènement chargé !", 'error');
      return;
    }

    const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 -]*$/;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if ((this.editedEvent.label || '').length < 3) {
      this.notificationService.show('Le label doit contenir au minimum 3 lettres', 'error');
      return;
    }

    if (!pattern.test(this.editedEvent.label)) {
      this.notificationService.show('Le label n\'est pas valide', 'error');
      return;
    }

    if (!this.editedEvent.startDate || !this.editedEvent.endDate) {
      this.notificationService.show('Les dates doivent être rentrées', 'error');
      return;
    }

    if (new Date(this.editedEvent.startDate) < today) {
      this.notificationService.show('La date de début doit être égale ou après la date du jour', 'error');
      return;
    }

    if (new Date(this.editedEvent.startDate) > new Date(this.editedEvent.endDate)) {
      this.notificationService.show('La date de début doit être avant la date de fin', 'error');
      return;
    }

    this.eventService.updateEvent(this.editedEvent.id, this.editedEvent).subscribe({
      next: (updatedEvent) => {
        this.evenement = { ...updatedEvent }; // Mise à jour de la partie gauche
        this.editedEvent = { ...updatedEvent }; // Synchronisation de la copie d’édition
        this.notificationService.show('Évènement mis à jour avec succès', 'success');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
        this.notificationService.show('Erreur lors de la mise à jour', 'error');
      },
    });
  }

  supprimerEvent(): void {
    if (!this.evenement) {
      this.notificationService.show("Aucun évènement chargé !", 'error');
      return;
    }

    const confirmation = confirm(`Supprimer "${this.evenement.label}" ?`);
    if (!confirmation) {
      this.notificationService.show('Suppression annulée', 'error');
      return;
    }

    this.isDeleted = true;
    this.eventService.deleteEvent(this.evenement.id).subscribe({
      next: () => {
        this.notificationService.show('Évènement supprimé avec succès', 'success');
        this.router.navigate(['/events']);
        this.isDeleted = false;
      },
      error: (err) => {
        console.error(err);
        this.notificationService.show('Erreur lors de la suppression', 'error');
        this.isDeleted = false;
      },
    });
  }

  addArtist() {
    if (!this.evenement || !this.selectedArtistId) {
      console.error("Evènement ou Artiste selectionné inconnu");
      return;
    }

    const alreadyExists = this.evenement.artists.some(
      artist => artist.id === this.selectedArtistId
    );

    if (alreadyExists) {
      this.notificationService.show("Cet artiste est déjà associé à l'évènement", "error");
      return;
    }

    this.eventService.addArtistToEvent(this.evenement.id, this.selectedArtistId).subscribe({
      next: () => {
        const addedArtist = this.allArtists.find(a => a.id === this.selectedArtistId);
        if (addedArtist) {
          this.evenement!.artists.push(addedArtist);
        }
        this.notificationService.show("Artiste ajouté avec succès", "success");
        this.selectedArtistId = "";
      },
      error: () => {
        this.notificationService.show("Erreur lors de l'ajout", "error");
      }
    });
  }

  removeArtist(artistId: string) {
    if (!this.evenement) {
      console.error("Aucun evenement n'est trouvé")
      return;
    } 

    this.eventService.removeArtistFromEvent(this.evenement.id, artistId).subscribe({
      next: () => {
        this.evenement!.artists = this.evenement!.artists.filter(a => a.id !== artistId);
        this.notificationService.show("Artiste retiré avec succès", "success");
      },
      error: () => {
        this.notificationService.show("Erreur lors du retrait", "error");
      }
    });
  }


}
