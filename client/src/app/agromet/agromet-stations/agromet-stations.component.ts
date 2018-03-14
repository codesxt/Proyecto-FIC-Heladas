import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { StationsService } from '../../shared/services/stations.service';
import { AgrometService } from '../../shared/services/agromet.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import * as zpad from 'zpad';

@Component({
  selector: 'app-agromet-stations',
  templateUrl: './agromet-stations.component.html'
})
export class AgrometStationsListComponent implements OnInit {
  regions  : any = [];
  cities   : any = [];
  stations : any = [];
  selectedRegion  : number = null;
  selectedCity    : number = null;
  selectedStation : number = null;
  stationsLoaded  : boolean = false;
  date : any = null;
  agrometData : any = null;
  constructor(
    private notificationsService  : NotificationsService,
    private authenticationService : AuthenticationService,
    private stationsService       : StationsService,
    private agrometService        : AgrometService
  ) {  }

  ngOnInit(){
    this.agrometService.getRegions()
    .subscribe(
      response => {
        this.regions = response.regions;
        if(!this.selectedRegion){
          this.selectedRegion = this.regions[0].id;
        }
        this.agrometService.getCities(this.selectedRegion).subscribe(
          (response) => {
            console.log(response);
            this.cities = response.cities;
            if(!this.selectedCity){
              this.selectedCity = this.cities[0].id;
            }
            this.agrometService.getStationsV2(this.selectedRegion, this.selectedCity).subscribe(
              (response) => {
                this.stations = response.stations;
                this.stationsLoaded = true;
                if(this.stations.length>0){
                  if(!this.selectedStation){
                    this.selectedStation = this.stations[0].id;
                    this.onStationUpdate();
                  }
                }else{
                  this.selectedStation = null;
                  this.agrometData = null;
                }
              }
            )
          }
        )
      }
    )
  }

  onRegionUpdate(){
    this.agrometService.getCities(this.selectedRegion)
    .subscribe(
      (response) => {
        this.cities = response.cities;
        this.selectedCity = this.cities[0].id;
        this.agrometService.getStationsV2(this.selectedRegion, this.selectedCity)
        .subscribe(
          (response) => {
            this.stations = response.stations;
            if(this.stations.length>0){
              this.selectedStation = this.stations[0].id;
              this.onStationUpdate();
            }else{
              this.selectedStation = null;
              this.agrometData = null;
            }
          }
        )
      }
    )
  }

  onCityUpdate(){
    this.agrometService.getStationsV2(this.selectedRegion, this.selectedCity)
    .subscribe(
      (response) => {
        this.stations = response.stations;
        if(this.stations.length>0){
          this.selectedStation = this.stations[0].id;
          this.onStationUpdate();
        }else{
          this.selectedStation = null;
          this.agrometData = null;
        }
      }
    )
  }

  onStationUpdate(){
    this.loadData();
  }

  onDateChange(event){
    this.loadData();
  }

  loadData(){
    if(this.selectedStation && this.date){
      let fromDate = this.date.year + '-' + zpad(this.date.month) + '-' + zpad(this.date.day);
      this.agrometService.getHistoryV2(this.selectedStation, fromDate)
      .subscribe(
        response => {
          console.log(response);
          this.agrometData = response;
        }
      )
    }
  }

  downloadData(){
    let data = this.agrometData.data;
    let stationName = this.stations.filter((item) => {
      return item.id = this.selectedStation;
    })[0].name;
    let date = this.date.year + '-' + zpad(this.date.month) + '-' + zpad(this.date.day);
    let labels = this.agrometData.labels;
    let options = {
      headers : labels,
      useBom  : false
    }

    new Angular2Csv(
      data,
      'Datos Agromet - Estación ' + stationName + ' (' + this.selectedStation + ') - ' + date,
      options
    );
  }
}
