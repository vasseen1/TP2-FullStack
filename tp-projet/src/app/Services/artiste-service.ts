import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs';
import { Events } from './events-service';


export interface Artiste {
  id: string;
  label: string;
}


@Injectable({
  providedIn: 'root',
})
export class ArtisteService {
  // Déclaration de l'URL du back
  private baseUrl = 'http://localhost:8080';
  
  constructor(private http: HttpClient) {}
  
  // Récupère la liste des Artistes.
  getAllArtists(): Observable<Artiste[]> {
    return this.http.get< {content: Artiste[]}>(`${this.baseUrl}/artists`)
    .pipe(map(response => response.content));
  }
  
  // Récupère un artiste à partir de son identifiant
  getArtistById(artistId: string): Observable<Artiste> {
    return this.http.get<Artiste>(`${this.baseUrl}/artists/${artistId}`)
  }

  // Récupère les évènements associé à un artiste à partir de son identifiant.
  getEvents(artistId: string): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.baseUrl}/artists/${artistId}/events`)
  }

  // Ajout d'un artiste dans la base de données.
  createArtist(artist: Artiste): Observable<Artiste> {
    return this.http.post<Artiste>(`${this.baseUrl}/artists`, artist);
  }

  // Met à jour un artiste.
  updateArtist(artistId: string, artist: Artiste): Observable<Artiste> {
    return this.http.put<Artiste>(`${this.baseUrl}/artists/${artistId}`, artist);
  }

  // Supprime un artiste.
  deleteArtist(artistId: string): Observable<Artiste> {
    return this.http.delete<Artiste>(`${this.baseUrl}/artists/${artistId}`)
  }

  // Associe un évènement à un artiste.
  addEventToArtiste(artistId: string, eventId: string) {
    return this.http.post(`${this.baseUrl}/events/${eventId}/artists/${artistId}`,{});
  }

  // Dissocie un évènement d'un artiste.
  removeEventFromArtiste(artistId: string, eventId: string) {
    return this.http.delete(`${this.baseUrl}/events/${eventId}/artists/${artistId}`);
  }
}
