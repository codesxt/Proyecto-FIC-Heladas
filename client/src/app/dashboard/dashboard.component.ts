import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SystemService } from '../shared/services/system.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { StationsService } from '../shared/services/stations.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  stations   : any[];
  statistics : any;
  user       : any;
  constructor(
    private systemService : SystemService,
    private authenticationService : AuthenticationService,
    private stationsService : StationsService
  ) { }

  ngOnInit(){
    this.user = this.authenticationService.getCurrentUser();
    if(this.user.role == 'administrator'){
      this.systemService.getStatistics()
      .subscribe(
        data => {
          this.statistics = data;
        }
      )
    }
  }

}
