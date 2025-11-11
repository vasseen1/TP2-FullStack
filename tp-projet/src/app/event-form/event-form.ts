import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Events, EventsService } from '../Services/events-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.css'],
})
export class EventForm {

  event: Events = {
    id: undefined as any,
    label: '',
    startDate: null as any,
    endDate: null as any,
    artists: [],
  };

  notificationMessage = '';
  notificationType: 'success' | 'error' | '' = '';

  constructor(
    private router: Router,
    private eventService: EventsService
  ) {}

  createEvent(): void {
    if ((this.event.label).length < 3) {
      this.showNotification('Le label doit contenir au minimum 3 lettres', 'error');
      return;
    }

    if (!this.event.startDate || !this.event.endDate) {
      this.showNotification('Les dates doivent être rentrées', 'error');
      return;
    }

    if (new Date(this.event.startDate) > new Date(this.event.endDate)) {
      this.showNotification('Erreur dans les dates : La date de début doit être avant ou égale à celle de fin', 'error');
      return;
    }

    this.eventService.createEvent(this.event).subscribe({
      next: (createdEvent) => {
        this.showNotification('Évènement créé avec succès', 'success');

        // Redirection après 2 secondes
        setTimeout(() => {
          this.router.navigate([`/events/${createdEvent.id}`]);        
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'évènement : ', err);
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
