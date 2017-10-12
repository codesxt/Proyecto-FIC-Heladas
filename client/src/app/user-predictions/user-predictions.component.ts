import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-predictions',
  templateUrl: './user-predictions.component.html'
})
export class UserPredictionsComponent implements OnInit {
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private router               : Router
  ) {  }

  ngOnInit() {
    this.router.navigate(['/user-predictions/map']);
  }
}
