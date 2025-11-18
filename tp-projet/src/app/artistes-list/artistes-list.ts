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
  // On déclare un tableau d'artistes, un tableau d'artistes conforme à la pagination, et les evenements.
  artists: Artiste[] = [];
  paginatedArtists: Artiste[] = [];
  eventCache: { [id: string]: Observable<Events[]> } = {};

  // On déclare les variables pour la barre de recherche.
  searchTerm: string = '';
  filteredArtists: Artiste[] = [];

  // On déclare les variables pour la pagination.
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(
    private artistService: ArtisteService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // On récupère l'ensemble des artistes, qu'on sauvegarde dans 2 variables.
    this.artistService.getAllArtists().subscribe((artists) => {
      this.artists = artists;
      this.filteredArtists = [...artists];

      // On divise selon la pagination
      this.totalPages = Math.ceil(this.artists.length / this.itemsPerPage);
      this.updatePaginatedArtists();
    });
  }

  // Redirection du bouton "ajouter un artiste"
  navigateToAddArtist(): void {
    this.router.navigate(['/artistes/add']);
  }

  // On récupère le term entrée dans la barre de recherche et on affiche dynamiquement les artistes qui matche avec le term.
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


  // On met à jour les artistes à afficher.
  updatePaginatedArtists(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedArtists = this.filteredArtists.slice(startIndex, endIndex);
  }

  // On récupère les évènements liés aux artistes.
  getEventsForArtist(id: string) {
    if (!this.eventCache[id]) {
      this.eventCache[id] = this.artistService.getEvents(id);
    }
    return this.eventCache[id];
  }

  // On affiche les N prochains artistes quand on change de page.
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedArtists();
    }
  }

  // On ré-affiche les N artistes précédents. 
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedArtists();
    }
  }
}
