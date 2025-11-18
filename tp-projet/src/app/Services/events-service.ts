import { Injectable } from '@angular/core';
import { Artiste } from './artiste-service';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs';


export interface Events {
  id: string;
  label : string;
  startDate: Date;
  endDate: Date;
  artists : Artiste[];
}



@Injectable({
  providedIn: 'root',
})
export class EventsService {
  // Déclaration de l'URL du backend.
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Récupère la liste des évènements
  getAllEvents(): Observable<Events[]> {
    return this.http.get< {content: Events[]}>(`${this.baseUrl}/events`)
    .pipe(map(response => response.content));
  }

  // Récupère un évènement à partir de son identifiant
  getEventById(eventId: string): Observable<Events> {
    return this.http.get<Events>(`${this.baseUrl}/events/${eventId}`);
  }

  // Crée un évènement
  createEvent(event: Events): Observable<Events> {
    return this.http.post<Events>(`${this.baseUrl}/events`,event);
  }

  // met à jour un évènement à partir de son identifiant.
  updateEvent(eventId: string, evenement: Events): Observable<Events>{
    return this.http.put<Events>(`${this.baseUrl}/events/${eventId}`,evenement);
  }

  // Supprime un évènement.
  deleteEvent(eventId: string) {
    return this.http.delete(`${this.baseUrl}/events/${eventId}`);
  }

  // Associe un artiste à un évènement
  addArtistToEvent(eventId: string, artistId: string) {
    return this.http.post(`${this.baseUrl}/events/${eventId}/artists/${artistId}`,{});
  }

  // Dissocie un artiste d'un évènement
  removeArtistFromEvent(eventId: string, artistId: string) {
    return this.http.delete(`${this.baseUrl}/events/${eventId}/artists/${artistId}`);
  }
}
