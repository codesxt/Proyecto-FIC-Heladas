import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-hobostations',
  templateUrl: './admin-hobostations.component.html'
})
export class AdminHoboStationsComponent implements OnInit {
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private router               : Router
  ) {  }

  ngOnInit() {
    this.router.navigate(['/admin-hobostations/list']);
  }
}
