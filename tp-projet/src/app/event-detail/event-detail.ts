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
  // Déclaration des variables.
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
        this.editedEvent = { ...evenement };
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'évènement :', err);
        this.notificationService.show('Impossible de charger l\'évènement.', 'error');
      },
    });

    // On récupère les artistes.
    this.artistService.getAllArtists().subscribe({
      next: (artists) => (this.allArtists = artists),
      error: () => this.notificationService.show("Impossible de charger les artistes","error"),
    });
  }


  saveEvent() {
    // Si l'évènement modifié n'est pas trouvé, on informe.
    if (!this.editedEvent || !this.evenement) {
      this.notificationService.show("Aucun évènement chargé !", 'error');
      return;
    }

    // On défini un pattern pour le label et la date du jour.
    const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 -]*$/;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Si le label contient moins de 3 caractères.
    if ((this.editedEvent.label || '').length < 3) {
      this.notificationService.show('Le label doit contenir au minimum 3 lettres', 'error');
      return;
    }

    // Si le pattern ne matche pas avec le label, on refuse.
    if (!pattern.test(this.editedEvent.label)) {
      this.notificationService.show('Le label n\'est pas valide', 'error');
      return;
    }

    // Si l'une des dates n'est pas présente, on refuse.
    if (!this.editedEvent.startDate || !this.editedEvent.endDate) {
      this.notificationService.show('Les dates doivent être rentrées', 'error');
      return;
    }

    if (new Date(this.editedEvent.startDate).getTime() !== new Date(this.evenement.startDate).getTime()) {
      // SI la nouvelle startDate est inférieure à la date du jour, on refuse.
      if (new Date(this.editedEvent.startDate) < today) {
        this.notificationService.show('La date de début doit être égale ou après la date du jour', 'error');
        return;
      }
    }

    // Si la startDate édité est supérieure à la EndDate, on refuse. 
    if (new Date(this.editedEvent.startDate) > new Date(this.editedEvent.endDate)) {
      this.notificationService.show('La date de début doit être avant la date de fin', 'error');
      return;
    }

    // On met à jour l'évènement.
    this.eventService.updateEvent(this.editedEvent.id, this.editedEvent).subscribe({
      next: (updatedEvent) => {
        this.evenement = { ...updatedEvent }; // Mise à jour de la partie gauche
        this.editedEvent = { ...updatedEvent }; // Mise à jour de la copie
        this.notificationService.show('Évènement mis à jour avec succès', 'success');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
        this.notificationService.show('Erreur lors de la mise à jour', 'error');
      },
    });
  }

  // Suppression de l'évènement
  supprimerEvent(): void {
    // Si l'évènement n'est pas trouvé, on informe
    if (!this.evenement) {
      this.notificationService.show("Aucun évènement chargé !", 'error');
      return;
    }

    // On demande validation
    const confirmation = confirm(`Supprimer "${this.evenement.label}" ?`);
    // Si la validation est refusée, on annule
    if (!confirmation) {
      this.notificationService.show('Suppression annulée', 'error');
      return;
    }

    // On rend le bouton indisponible
    this.isDeleted = true;
    this.eventService.deleteEvent(this.evenement.id).subscribe({
      // On supprime l'évènement
      next: () => {
        this.notificationService.show('Évènement supprimé avec succès', 'success');
        // On redirige
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

  // On ajoute un artiste.
  addArtist() {

    // Si l'évènement n'est pas reconnu, on informe.
    if (!this.evenement) {
      console.error("Impossible de charger l'évènement");
      return;
    }

    // Si l'artiste n'est pas choisi, on informe
    if (!this.selectedArtistId) {
      console.error("Artiste selectionné inconnu");
      return;
    }

    // On vérifie si l'artiste est déjà présent dans l'évènement.
    const alreadyExists = this.evenement.artists.some(
      artist => artist.id === this.selectedArtistId
    );

    // Si c'est le cas, on informe
    if (alreadyExists) {
      this.notificationService.show("Cet artiste est déjà associé à l'évènement", "error");
      return;
    }

    // Sinon, on l'ajoute
    this.eventService.addArtistToEvent(this.evenement.id, this.selectedArtistId).subscribe({
      next: () => {
        const addedArtist = this.allArtists.find(a => a.id === this.selectedArtistId);
        // On raffraichi la liste des artistes.
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

  // Retirer un artiste.
  removeArtist(artistId: string) {
    // Si l'évènement n'est pas trouvé, on informe
    if (!this.evenement) {
      console.error("Aucun evenement n'est trouvé")
      return;
    } 

    // On retire l'artiste.
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
