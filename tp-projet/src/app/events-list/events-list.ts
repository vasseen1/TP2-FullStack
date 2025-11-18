import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Events, EventsService } from '../Services/events-service';
import { NotificationComponent } from '../notifications/notifications';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationComponent],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export class EventsList implements OnInit {
  // Déclaration des variables
  events: Events[] = [];
  paginatedEvents: Events[] = [];

  // Déclaration des variables de la pagination.
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;

  constructor(
    private eventsService: EventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // On récupère les évènements.
    this.eventsService.getAllEvents().subscribe((events) => {
      this.events = events;
      this.totalPages = Math.ceil(this.events.length / this.itemsPerPage);
      this.updatePaginatedEvents();
    });
  }

  // On redirige lorsqu'on appuie sur le bouton "Ajouter un évènement"
  navigateToAddEvent(): void {
    this.router.navigate(['/events/add']);
  }

  // On met à jour les évènements présent sur la page
  updatePaginatedEvents(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.events.slice(startIndex, endIndex);
  }

  // On affiche les prochains évènements.
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedEvents();
    }
  }

  // On affiche les précédents évènements.
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedEvents();
    }
  }
}
