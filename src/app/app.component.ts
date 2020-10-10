import { Component } from '@angular/core';
import { QueueService } from './services/queue.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './global.css'],
})
export class AppComponent {
  constructor(public queueService: QueueService,public router: Router) {}
  title = 'lbAPI';
  storage = sessionStorage;
}