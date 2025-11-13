import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Events, EventsService } from '../Services/events-service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css'],
})
export class EventDetail implements OnInit {
  evenement?: Events;
  editedEvent?: Events;
  notificationMessage = '';
  notificationType: 'success' | 'error' | '' = '';
  isDeleted = false;

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
        this.editedEvent = { ...evenement }; 
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'évènement :', err);
        this.showNotification('Impossible de charger l\'évènement.', 'error');
      },
    });
  }

  saveEvent() {

    const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 -]*$/;
    const today = new Date();
    today.setHours(0,0,0,0);

    if (!this.editedEvent) return;

    if ((this.editedEvent.label || '').length < 3) {
      this.showNotification('Le label doit contenir au minimum 3 lettres', 'error');
      return;
    }

    if (!pattern.test(this.editedEvent.label)) {
      this.showNotification('Le label n\'est pas valide', 'error');
      return;
    }

    if (!this.editedEvent.startDate || !this.editedEvent.endDate) {
      this.showNotification('Les dates doivent être rentrées', 'error');
      return;
    }

    if (new Date(this.editedEvent.startDate) < today) {
      this.showNotification('La date de début doit être égale ou après la date du jour', 'error');
      return;
    }

    if (new Date(this.editedEvent.startDate) > new Date(this.editedEvent.endDate)) {
      this.showNotification('La date de début doit être avant la date de fin', 'error');
      return;
    }

    this.eventService.updateEvent(this.editedEvent.id, this.editedEvent).subscribe({
      next: (updatedEvent) => {
        this.evenement = { ...updatedEvent };
        this.editedEvent = { ...updatedEvent };
        this.showNotification('Évènement mis à jour avec succès', 'success');
      },
      error: () => {
        this.showNotification('Erreur lors de la mise à jour', 'error');
      },
    });
  }

  supprimerEvent(): void {
    if (!this.evenement) return;

    const confirmation = confirm(`Supprimer "${this.evenement.label}" ?`);
    if (!confirmation) {
      this.showNotification('Suppression annulée', 'error');
      return;
    }

    this.isDeleted = true;
    this.eventService.deleteEvent(this.evenement.id).subscribe({
      next: () => {
        this.showNotification('Évènement supprimé avec succès', 'success');
        setTimeout(() => {
          this.router.navigate(['/events']);
          this.isDeleted = false;
        }, 2000);
      },
      error: (err) => {
        console.error(err);
        this.showNotification('Erreur lors de la suppression', 'error');
        this.isDeleted = false;
      },
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
