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

  constructor(
    private artistService: ArtisteService
  ) {}

  ngOnInit(): void {
    this.artistService.getAllArtists().subscribe( artists => {
      this.artists = artists;
    })
  }

}
