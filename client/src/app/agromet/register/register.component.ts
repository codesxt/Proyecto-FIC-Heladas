import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { StationsService } from '../../shared/services/stations.service';
import { AgrometService } from '../../shared/services/agromet.service';
import { Router } from '@angular/router';
import * as zpad from 'zpad';
import * as moment from 'moment';

@Component({
  selector: 'app-agromet-register',
  templateUrl: './register.component.html'
})
export class AgrometRegisterComponent implements OnInit {
  regions  : any = [];
  cities   : any = [];
  stations : any = [];
  selectedRegion  : number = null;
  selectedCity    : number = null;
  selectedStation : number = null;
  stationsLoaded  : boolean = false;
  formEnabled     : boolean = false;

  newRegister : any = {};
  constructor(
    private notificationsService  : NotificationsService,
    private authenticationService : AuthenticationService,
    private stationsService       : StationsService,
    private agrometService        : AgrometService,
    @Inject('moment') private moment,
    private router : Router
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
        }
      }
    )
  }

  onStationUpdate(){
    //this.loadData();
  }

  startRegister(){
    let name = this.stations.filter((item) => {
      return item.id == this.selectedStation;
    })[0].name;
    let region = this.regions.filter((item) => {
      return item.id == this.selectedRegion;
    })[0];
    let city = this.cities.filter((item) => {
      return item.id == this.selectedCity;
    })[0];

    // TODO : Modificar modelo para que la estación sea un sub objeto
    this.newRegister = {
      name   : name,
      station: {
        id   : this.selectedStation,
        name : name
      },
      region : {
        id   : region.id,
        name : region.name
      },
      city   : {
        id   : city.id,
        name : city.name
      },
      settings : {
        autobackup : false
      }
    }
    this.formEnabled = true;
  }

  doRegister(){
    console.log(this.newRegister);
    this.agrometService.createAgrometStation(this.newRegister)
    .subscribe(
      data => {
        this.notificationsService.success('Error', 'Estación registrada exitosamente');
        this.router.navigate(['/agromet']);
      },
      error => {
        this.notificationsService.error('Error', error.json().message);
      }
    )
  }
}