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

  artiste?: Artiste;
  notificationMessage = '';
  notificationType: 'success' | 'error' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private artisteService: ArtisteService
  ) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));


    this.artisteService.getArtistById(id).subscribe({
      next: (artiste: Artiste) => {
        this.artiste = artiste;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'artiste :', err);
        this.showNotification('Impossible de charger l\'artiste.', 'error');
      }
    });
  }

  updateArtist():void {
    if (!this.artiste) {
      this.showNotification("Aucun artiste chargé !", 'error');
      return;
    } 

    if((this.artiste.label).length < 3 ) {
      this.showNotification('Le label doit contenir au minimum 3 lettres', 'error');
      return;
    }

    this.artisteService.updateArtist(this.artiste.id, this.artiste).subscribe({
      next: () => {
        this.showNotification('Artiste mis à jour avec succès', 'success');
        // Redirection après 2 secondes
        setTimeout(() => {
          this.router.navigate([`/artistes/${this.artiste?.id}`]);        
        }, 2000); 
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de l\'artiste : ', err);
        this.showNotification('Une erreur est survenue lors de la mise à jour', 'error');
      }
    });
  }


  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;

    // On efface la notification après 3 secondes
    setTimeout(() => {
      this.notificationMessage = '';
      this.notificationType = '';
    }, 3000);
  }

}
