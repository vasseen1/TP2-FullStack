import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Artiste, ArtisteService } from '../Services/artiste-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-artiste-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artiste-edit.html',
  styleUrl: './artiste-edit.css',
})
export class ArtisteEdit implements OnInit{

  artiste?: Artiste

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private artisteService: ArtisteService
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));


    this.artisteService.getArtistById(id).subscribe(artiste => {
      this.artiste = artiste;
    });
  }

  updateArtist():void {
    if (!this.artiste) return;

    this.artisteService.updateArtist(this.artiste.id, this.artiste).subscribe({
      next: () => {
        alert('Artiste mis à jour avec succès');
        this.router.navigate([`/artistes/${this.artiste?.id}`]);
      },
      error: (err) => console.error('Erreur lors de la mise à jour de l\'artiste : ', err),
    });
  }

}
