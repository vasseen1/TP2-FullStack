import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Events, EventsService } from '../Services/events-service';
import { Router } from '@angular/router';
import { NotificationsService } from '../Services/notifications-service';
import { NotificationComponent } from '../notifications/notifications';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent],
  templateUrl: './event-form.html',
  styleUrls: ['./event-form.css'],
})
export class EventForm{

  event: Events = {
    id: undefined as any,
    label: '',
    startDate: null as any,
    endDate: null as any,
    artists: [],
  };
  isSubmitting = false;

  constructor(
    private router: Router,
    private eventService: EventsService,
    private notificationService: NotificationsService
  ) {}

  createEvent(): void {

    const pattern = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 -]*$/;
    const today = new Date();

    today.setHours(0,0,0,0);

    if ((this.event.label).length < 3) {
      this.notificationService.show('Le label doit contenir au minimum 3 lettres', 'error');
      return;
    }

    if (!pattern.test(this.event.label)) {
      this.notificationService.show('Le label n\'est pas valide', 'error');
      return;
    }



    if (!this.event.startDate || !this.event.endDate) {
      this.notificationService.show('Les dates doivent être rentrées', 'error');
      return;
    }

    if (new Date(this.event.startDate) < today) {
      this.notificationService.show('La date de début doit être égale ou après la date du jour', 'error');
      return;
    }

    if (new Date(this.event.startDate) > new Date(this.event.endDate)) {
      this.notificationService.show('La date de début doit être avant ou égale à celle de fin', 'error');
      return;
    }

    this.isSubmitting = true;

    this.eventService.createEvent(this.event).subscribe({
      next: (createdEvent) => {
        this.notificationService.show('Évènement créé avec succès', 'success');
        this.router.navigate([`/events/${createdEvent.id}`]);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'évènement : ', err);
        this.notificationService.show('Une erreur est survenue lors de la création', 'error');
        this.isSubmitting = false;      
      }
    });
  }
}
