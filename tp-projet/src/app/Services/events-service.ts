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
  
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<Events[]> {
    return this.http.get< {content: Events[]}>(`${this.baseUrl}/events`)
    .pipe(map(response => response.content));
  }

  getEventById(eventId: string): Observable<Events> {
    return this.http.get<Events>(`${this.baseUrl}/events/${eventId}`);
  }

  createEvent(event: Events): Observable<Events> {
    return this.http.post<Events>(`${this.baseUrl}/events`,event);
  }

  updateEvent(eventId: string, evenement: Events): Observable<Events>{
    return this.http.put<Events>(`${this.baseUrl}/events/${eventId}`,evenement);
  }

  deleteEvent(eventId: string) {
    return this.http.delete(`${this.baseUrl}/events/${eventId}`);
  }

  addArtistToEvent(eventId: string, artistId: string) {
    return this.http.post(`${this.baseUrl}/events/${eventId}/artists/${artistId}`,{});
  }

  removeArtistFromEvent(eventId: string, artistId: string) {
    return this.http.delete(`${this.baseUrl}/events/${eventId}/artists/${artistId}`);
  }



}
