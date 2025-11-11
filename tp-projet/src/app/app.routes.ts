import { Routes } from '@angular/router';
import { Accueil } from './accueil/accueil';
import { EventsList } from './events-list/events-list';
import { ArtistesList } from './artistes-list/artistes-list';
import { EventDetail } from './event-detail/event-detail';
import { ArtistsDetail } from './artiste-detail/artiste-detail';
import { EventForm } from './event-form/event-form';
import { EventEdit } from './event-edit/event-edit';
import { ArtisteForm } from './artiste-form/artiste-form';
import { ArtisteEdit } from './artiste-edit/artiste-edit';

export const routes: Routes = [
    // La page d'accueil : 
    {path: '', component: Accueil},

    // Les routes des évènements : 
    {path: 'events', component: EventsList},
    {path: 'events/add', component: EventForm},
    {path: 'events/:id', component: EventDetail},
    {path: 'events/:id/edit', component: EventEdit},

    // Les routes concernant les artistes :
    {path: 'artistes', component: ArtistesList},
    {path: 'artistes/add', component: ArtisteForm},
    {path: 'artistes/:id', component: ArtistsDetail},
    {path: 'artistes/:id/edit', component: ArtisteEdit}
];
