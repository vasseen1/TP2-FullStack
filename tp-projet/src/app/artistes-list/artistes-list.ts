import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Artiste, ArtisteService } from '../Services/artiste-service';

@Component({
  selector: 'app-artistes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artistes-list.html',
  styleUrl: './artistes-list.css',
})
export class ArtistesList implements OnInit {
  artists: Artiste[] = [];
  paginatedArtists: Artiste[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 4;
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
