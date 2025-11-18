import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Artiste, ArtisteService } from '../Services/artiste-service';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../notifications/notifications';
import { NotificationsService } from '../Services/notifications-service';
import { Events, EventsService } from '../Services/events-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-artiste-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './artiste-detail.html',
  styleUrl: './artiste-detail.css',
})
export class ArtistsDetail implements OnInit{

  // Déclaration des variables
  artiste?: Artiste;
  editedArtiste?: Artiste;
  events?: Observable<Events[]>;
  selectedEventId: string | null = null;
  allEvents: Events[] = [];

  isDeleted = false;


  constructor(
    private artistService: ArtisteService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private eventService: EventsService
  ) {}

  ngOnInit(): void {
    // Récupérer l'id.
    const id = String(this.route.snapshot.paramMap.get('id'));
    // Récupérer l'artiste.
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
    });
    this.eventService.getAllEvents().subscribe((events) => {
      this.allEvents = events;
    });
  }

  saveArtist() {
    // Verifier si l'artiste existe
    if (!this.editedArtiste) {
      this.notificationService.show("Aucun artiste chargé !", 'error');
      return;
    }

    // Déclaration d'un pattern afin de valider l'entrée de l'artiste
    const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 -]*$/;


    // Si la taille du nouveau nom est inférieure à 3 caractères
    if ((this.editedArtiste.label).length < 3) {
      this.notificationService.show('Le label doit contenir au minimum 3 lettres', 'error');
      return;
    }

    // Si le nouveau nom ne matche pas avec le pattern
    if (!pattern.test(this.editedArtiste.label)) {
      this.notificationService.show('Le label n\'est pas valide', 'error');
      return;
    }

    // Mise à jour de l'artiste
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

    // Vérifier si l'artiste existe
    if (!this.artiste) {
      this.notificationService.show("Aucun Artiste chargé !", 'error');
      return;
    }

    // afficher un message de confirmation pour la suppression
    const confirmation = confirm(`Es-tu sûr de vouloir supprimer "${this.artiste.label}" ?`);

    // Si on annule
    if (!confirmation) {
      this.notificationService.show("Suppression annulée", 'error');
      return;
    }

    // On supprime l'artiste
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
  
  addEvent() {
    // Si l'artiste n'est pas trouvé, on informe.
    if (!this.artiste) {
      this.notificationService.show("Aucun artiste trouvé", "error");
      return;
    }

    this.events?.subscribe(eventList => {

      const alreadyExists = eventList.some(ev => ev.id === this.selectedEventId);
      // Si l'évènement est déjà présent, on informe l'utilisateur
      if (alreadyExists) {
        this.notificationService.show("Cet évènement est déjà associé à l'artiste", "error");
        return;
      }

      // On vérifie si l'évènement est bien selectionné.
      if (!this.selectedEventId) {
        this.notificationService.show("Veuillez sélectionner un évènement", "error");
        return;
      }

      // Sinon, on peut ajouter !
      this.artistService.addEventToArtiste(this.artiste!.id, this.selectedEventId).subscribe({
        next: () => {
          this.events = this.artistService.getEvents(this.artiste!.id);
          this.notificationService.show("Évènement ajouté avec succès", "success");
          this.selectedEventId = null;
        },
        error: () => {
          this.notificationService.show("Erreur lors de l'ajout de l'évènement", "error");
        }
      });

    });
  }



  removeArtist(eventId: string) {

    // Si l'artiste n'est pas trouvé, on informe
    if (!this.artiste) {
      console.error("Aucun artiste trouvé");
      return;
    }

    this.artistService.removeEventFromArtiste(this.artiste.id, eventId).subscribe({
      next: () => {
        // Si l'artiste n'est pas trouvé, on informe
        if (!this.artiste) {
          console.error("Aucun artiste trouvé");
          return;
        }
        // On met à jour la liste des évènements et on informe que l'évènement est dissocié de l'artiste.
        this.events = this.artistService.getEvents(this.artiste.id);
        this.notificationService.show("Evenement retiré avec succès", "success");
      },
      error: () => {
        this.notificationService.show("Erreur lors du retrait", "error");
      }
    });
  }

}
