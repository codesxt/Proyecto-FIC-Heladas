import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  templateUrl: 'landing.component.html'
})
export class LandingComponent implements OnInit {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(){

    if(this.authenticationService.isLoggedIn()){
      this.router.navigate(['/dashboard']);
    }
  }

}
