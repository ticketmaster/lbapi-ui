import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  constructor() {}
  public queueing$ = new BehaviorSubject<boolean>(false);
  public data$ = new BehaviorSubject<string>(null);
}
