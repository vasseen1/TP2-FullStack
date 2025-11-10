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
}
