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
  notificationMessage = '';
  notificationType: 'success' | 'error' | '' = '';


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
        this.showNotification('Impossible de charger l\'Artiste.', 'error');
      }
    })
  }

  supprimerArtist():void {

    if (!this.artiste) {
      this.showNotification("Aucun Artiste chargé !", 'error');
      return;
    }

    const confirmation = confirm(`Es-tu sûr de vouloir supprimer "${this.artiste.label}" ?`);
    if (!confirmation) {
      this.showNotification("Suppression annulée", 'error');
      return;
    }

    this.artistService.deleteArtist(this.artiste.id).subscribe( {
      next: () => {
        this.showNotification('Artiste supprimé avec succès', 'success');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression :', err);
        this.showNotification('Une erreur est survenue lors de la suppression', 'error');
      }
    })
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;

    setTimeout(() => {
      this.notificationMessage = '';
      this.notificationType = '';
    }, 3000);
  }

}
