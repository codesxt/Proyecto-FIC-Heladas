import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-hobostations',
  templateUrl: './public-hobostations.component.html'
})
export class PublicHobostationsComponent implements OnInit {
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private router               : Router
  ) {  }

  ngOnInit() {
    this.router.navigate(['/hobostations/data']);
  }
}
