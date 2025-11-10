import { Routes } from '@angular/router';
import { Accueil } from './accueil/accueil';
import { EventsList } from './events-list/events-list';
import { ArtistesList } from './artistes-list/artistes-list';
import { EventDetail } from './event-detail/event-detail';
import { ArtistsDetail } from './artists-detail/artists-detail';

export const routes: Routes = [
    {path: '', component: Accueil},
    {path:'events', component: EventsList},
    {path:'artistes', component: ArtistesList},
    {path:'events/:id', component: EventDetail},
    {path:'artists/:id', component: ArtistsDetail}
];
