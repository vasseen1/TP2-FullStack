import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Artiste, ArtisteService } from '../Services/artiste-service';
import { NotificationComponent } from '../notifications/notifications';
import { Events } from '../Services/events-service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artistes-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationComponent, FormsModule],
  templateUrl: './artistes-list.html',
  styleUrl: './artistes-list.css',
})
export class ArtistesList implements OnInit {
  artists: Artiste[] = [];
  paginatedArtists: Artiste[] = [];
  eventCache: { [id: string]: Observable<Events[]> } = {};

  searchTerm: string = '';
  filteredArtists: Artiste[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private artistService: ArtisteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.artistService.getAllArtists().subscribe((artists) => {
      this.artists = artists;
      this.filteredArtists = [...artists];

      this.totalPages = Math.ceil(this.artists.length / this.itemsPerPage);
      this.updatePaginatedArtists();
    });
  }

  navigateToAddArtist(): void {
    this.router.navigate(['/artistes/add']);
  }

  filterArtists(): void {
    const term = this.searchTerm.trim().toLowerCase();
    
    this.filteredArtists = term
      ? this.artists.filter(a => a.label.toLowerCase().includes(term))
      : [...this.artists];

    // Réinitialiser la pagination
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredArtists.length / this.itemsPerPage);
    this.updatePaginatedArtists();
  }


  updatePaginatedArtists(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedArtists = this.filteredArtists.slice(startIndex, endIndex);
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
