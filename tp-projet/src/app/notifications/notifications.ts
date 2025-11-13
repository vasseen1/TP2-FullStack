import { Component, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../Services/notifications-service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.css']
})
@Injectable({ providedIn: 'root'})
export class NotificationComponent {
  constructor(public notificationService: NotificationsService) {}
}
