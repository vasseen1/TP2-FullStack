import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventsService, Events } from '../Services/events-service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css'],
})
export class EventDetail implements OnInit {

  evenement?: Events;
  notificationMessage = '';
  notificationType: 'success' | 'error' | '' = '';

  constructor(
    private eventService: EventsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    this.eventService.getEventById(id).subscribe({
      next: (evenement: Events) => {
        this.evenement = evenement;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'évènement :', err);
        this.showNotification('Impossible de charger l\'évènement.', 'error');
      }
    });
  }

  supprimerEvent(): void {
    if (!this.evenement) {
      this.showNotification("Aucun évènement chargé !", 'error');
      return;
    }

    const confirmation = confirm(`Es-tu sûr de vouloir supprimer "${this.evenement.label}" ?`);
    if (!confirmation) {
      this.showNotification("Suppression annulée", 'error');
      return;
    }

    this.eventService.deleteEvent(this.evenement.id).subscribe({
      next: () => {
        this.showNotification('Évènement supprimé avec succès', 'success');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        this.showNotification('Une erreur est survenue lors de la suppression', 'error');
      }
    });
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;

    setTimeout(() => {
      this.notificationMessage = '';
      this.notificationType = '';
    }, 3000);
  }
}
