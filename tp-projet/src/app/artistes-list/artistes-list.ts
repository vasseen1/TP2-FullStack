import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Artiste, ArtisteService } from '../Services/artiste-service';
import { NotificationComponent } from '../notifications/notifications';
import { Events } from '../Services/events-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-artistes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationComponent],
  templateUrl: './artistes-list.html',
  styleUrl: './artistes-list.css',
})
export class ArtistesList implements OnInit {
  artists: Artiste[] = [];
  paginatedArtists: Artiste[] = [];
  eventCache: { [id: string]: Observable<Events[]> } = {};


  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private artistService: ArtisteService) {}

  ngOnInit(): void {
    this.artistService.getAllArtists().subscribe((artists) => {
      this.artists = artists;

      this.totalPages = Math.ceil(this.artists.length / this.itemsPerPage);
      this.updatePaginatedArtists();
    });
  }

  updatePaginatedArtists(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedArtists = this.artists.slice(startIndex, endIndex);
  }

  getEventsForArtist(id: string) {
    if (!this.eventCache[id]) {
      this.eventCache[id] = this.artistService.getEvents(id);
    }
    return this.eventCache[id];
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedArtists();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedArtists();
    }
  }
}
