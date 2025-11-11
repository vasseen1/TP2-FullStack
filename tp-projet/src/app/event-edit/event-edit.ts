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

    this.eventService.updateEvent(this.event.id, this.event).subscribe({
      next: () => {
        alert('Evenement mis à jour avec succès');
        this.router.navigate([`/events/${this.event?.id}`]);
      },
      error: (err) => console.error('Erreur lors de la mise à jour de l\'évènement : ', err),
    });
  }

}
