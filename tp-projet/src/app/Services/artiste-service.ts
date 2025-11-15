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
  
  private baseUrl = 'http://localhost:8080';
  
  constructor(private http: HttpClient) {}
  
  getAllArtists(): Observable<Artiste[]> {
    return this.http.get< {content: Artiste[]}>(`${this.baseUrl}/artists`)
    .pipe(map(response => response.content));
  }

  getArtistById(artistId: string): Observable<Artiste> {
    return this.http.get<Artiste>(`${this.baseUrl}/artists/${artistId}`)
  }

  getEvents(artistId: string): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.baseUrl}/artists/${artistId}/events`)
  }

  createArtist(artist: Artiste): Observable<Artiste> {
    return this.http.post<Artiste>(`${this.baseUrl}/artists`, artist);
  }

  updateArtist(artistId: string, artist: Artiste): Observable<Artiste> {
    return this.http.put<Artiste>(`${this.baseUrl}/artists/${artistId}`, artist);
  }

  deleteArtist(artistId: string): Observable<Artiste> {
    return this.http.delete<Artiste>(`${this.baseUrl}/artists/${artistId}`)
  }
}
