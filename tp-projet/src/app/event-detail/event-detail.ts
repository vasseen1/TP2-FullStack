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
export class EventDetail implements OnInit{

  evenement?: Events;

  constructor(
    private eventService: EventsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    // Récupère l'évènement
    this.eventService.getEventById(id).subscribe({
      next: (evenement: Events) => {
        this.evenement = evenement;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'évènement :', err);
      }
    });
  }

  supprimerEvent():void {

      if (!this.evenement) {
        console.error("Aucun Evenement chargé !");
        return;
      }

      if (confirm('Es-tu sûr?')) {
        this.eventService.deleteEvent(this.evenement.id).subscribe(() => {
          alert('Event supprimé avec succès');
          this.router.navigate(['/']);
        })
      }
    }
}
