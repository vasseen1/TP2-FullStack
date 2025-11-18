import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _message = new BehaviorSubject<{message: string, type: 'success' | 'error'} | null>(null);
  message$ = this._message.asObservable();

  // Affiche la notification pendant 3 secondes
  show(message: string, type: 'success' | 'error') {
    this._message.next({ message, type });
    // effacer après 3 secondes
    setTimeout(() => this._message.next(null), 3000);
  }
}
