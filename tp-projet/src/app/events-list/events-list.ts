import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Events, EventsService } from '../Services/events-service'; 



@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})


export class EventsList implements OnInit{

  events: Events[] = [];

  constructor(
    private eventsService: EventsService
  ) {}
  
  ngOnInit(): void {
    this.eventsService.getAllEvents().subscribe( events => {
      this.events = events;
    })
  }

}
