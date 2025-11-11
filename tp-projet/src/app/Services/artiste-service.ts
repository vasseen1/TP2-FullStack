import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs';


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

  createArtist(artist: Artiste): Observable<Artiste> {
    return this.http.post<Artiste>(`${this.baseUrl}/artists`, artist);
  }
}
