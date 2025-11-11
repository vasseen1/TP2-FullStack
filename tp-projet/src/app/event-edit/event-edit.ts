import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Events, EventsService } from '../Services/events-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-edit.html',
  styleUrl: './event-edit.css',
})
export class EventEdit implements OnInit {
  event?: Events;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    this.eventService.getEventById(id).subscribe(evenement => {
      this.event = evenement;
    });
  }

  updateEvent():void {
    if (!this.event) return;

    if ((this.event.startDate) == null || (this.event.endDate) == null) {
      alert("Les dates doivent être rentrées");
      return;
    }

    if(new Date(this.event.startDate) > new Date(this.event.endDate)) {
      alert("Erreur dans les dates : La date de début doit être avant ou égale à celle de fin");
      return;
    }

    if((this.event.label).length < 3 ) {
      alert("Le label doit contenir au minimum 3 lettres")
      return;
    }

    this.eventService.updateEvent(this.event.id, this.event).subscribe({
      next: () => {
        alert('Evenement mis à jour avec succès');
        this.router.navigate([`/events/${this.event?.id}`]);
      },
      error: (err) => console.error('Erreur lors de la mise à jour de l\'évènement : ', err),
    });
  }

}
