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
  notificationMessage = '';
  notificationType: 'success' | 'error' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    this.eventService.getEventById(id).subscribe({
      next: (evenement: Events) => {
        this.event = evenement;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'évènement :', err);
        this.showNotification('Impossible de charger l\'évènement.', 'error');
      }
    });
  }

  updateEvent():void {
    if (!this.event) {
      this.showNotification("Aucun évènement chargé !", 'error');
      return;
    } 

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


    this.eventService.updateEvent(this.event.id, this.event).subscribe({
      next: () => {
        this.showNotification('Evenement mis à jour avec succès', 'success');
        // Redirection après 2 secondes
        setTimeout(() => {
          this.router.navigate([`/events/${this.event?.id}`]);     
        }, 2000); 
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de l\'évènement : ', err);
        this.showNotification('Une erreur est survenue lors de la mise à jour', 'error');
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
