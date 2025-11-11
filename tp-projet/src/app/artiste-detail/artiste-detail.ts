import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Artiste, ArtisteService } from '../Services/artiste-service';

@Component({
  selector: 'app-artiste-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artiste-detail.html',
  styleUrl: './artiste-detail.css',
})
export class ArtistsDetail implements OnInit{

  artiste?: Artiste;

  constructor(
    private artistService: ArtisteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    this.artistService.getArtistById(id).subscribe({
      next: (artiste: Artiste) => {
        this.artiste = artiste;
      },
      error : (err) => {
        console.error('Erreur lors de la récupération de l\'Artiste : ', err);
      }
    })
  }

  supprimerArtist():void {

      if (!this.artiste) {
        console.error("Aucun Artiste chargé !");
        return;
      }

      if (confirm('Es-tu sûr?')) {
        this.artistService.deleteArtist(this.artiste.id).subscribe(() => {
          alert('Artiste supprimé avec succès');
          this.router.navigate(['/']);
        })
      }
    }

}
