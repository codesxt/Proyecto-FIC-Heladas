import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FrostService } from '../shared/services/frost.service';

@Component({
  templateUrl: 'stations-list.component.html'
})
export class StationsListComponent implements OnInit {
  stations: any[] = [];
  constructor(
    private frostService: FrostService
  ) { }

  ngOnInit(){
    this.frostService.getStations()
    .subscribe(
      data => {
        this.stations = data.data;
      },
      error => {
        console.log(error);
      }
    )
  }

}
