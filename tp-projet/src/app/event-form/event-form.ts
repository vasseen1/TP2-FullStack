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
export class EventForm{

  event: Events = {
    id: undefined as any,
    label: '',
    startDate: null as any,
    endDate: null as any,
    artists: [],
  };

  constructor(
    private router: Router,
    private eventService: EventsService
  ) {}

  createEvent(): void {

    if((this.event.label).length < 3 ) {
      alert("Le label doit contenir au minimum 3 lettres")
      return;
    }

    if ((this.event.startDate) == null || (this.event.endDate) == null) {
      alert("Les dates doivent être rentrées");
      return;
    }

    if(new Date(this.event.startDate) > new Date(this.event.endDate)) {
      alert("Erreur dans les dates : La date de début doit être avant ou égale à celle de fin");
      return;
    }

    this.eventService.createEvent(this.event).subscribe({
      next: (createdEvent) => {
        alert('Evenement crée avec succés !');
        this.router.navigate([`/events/${createdEvent.id}`]);
      },
      error : (err) => console.error('Erreur lors de la création de l\'évènement : ', err)
    });
  }
}
