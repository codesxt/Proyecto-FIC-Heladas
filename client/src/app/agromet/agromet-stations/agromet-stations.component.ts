import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { NotificationsService } from 'angular2-notifications';
import { AgrometService } from '../../shared/services/agromet.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import * as zpad from 'zpad';
import * as moment from 'moment';

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
  toDate : any = null;
  agrometData : any = null;

  lineChartData: Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
  ];
  lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  lineChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  lineChartLegend = true;
  lineChartType = 'line';
  categories : any = [
    {value: 'airTemperatureAvg',      name: 'Temperatura Promedio del Aire (°C)'},
    {value: 'hourlyRainfall',         name: 'Precipitación Horaria (mm)'},
    {value: 'relativeHumidityAvg',    name: 'Humedad Relativa Promedio (%)'},
    {value: 'atmosphericPressure',    name: 'Presión Atmosférica (mbar)'},
    {value: 'solarRadiationMax',      name: 'Radiación Solar Máxima (W/m²)'},
    {value: 'windSpeedMax',           name: 'Velocidad Máxima del Viento (m/s)'},
    {value: 'temperatureMin',         name: 'Temperatura Mínima Horaria (°C)'},
    {value: 'temperatureMax',         name: 'Temperatura Máxima Horaria (°C)'},
    {value: 'windDirection',          name: 'Dirección del Viento (°)'},
    {value: 'degreeDay',              name: 'Grados Día (base 10)'},
    {value: 'coldHours',              name: 'Horas de Frío (base 7)'}
  ]
  selectedCategory = this.categories[0].value;
  constructor(
    private notificationsService  : NotificationsService,
    private authenticationService : AuthenticationService,
    private agrometService        : AgrometService,
    @Inject('moment') private moment
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
      let toDate = undefined;
      if(this.toDate){
        toDate = this.toDate.year + '-' + zpad(this.toDate.month) + '-' + zpad(this.toDate.day);


        let toMoment   = moment(toDate);
        let fromMoment = moment(fromDate);
        let monthDiff  = toMoment.diff(fromMoment, 'month');
        if(monthDiff>=3){
          alert('Agromet no permite realizar consultas en intervalos mayores a 3 meses.')
          this.agrometData = null;
          return;
        }
      }
      this.agrometService.getHistoryV2(this.selectedStation, fromDate, toDate)
      .subscribe(
        response => {
          console.log(response);
          this.agrometData = response;

          this.updateChart();
        },
        error    => {
          this.agrometData = null;
          this.notificationsService.error('Error', 'Error al obtener los datos');
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

  updateChart(){
    let data  = this.agrometData.data.map(item => item[this.selectedCategory]);
    let dates = this.agrometData.data.map(item => moment(item.date).format('YYYY-MM-DD HH:mm'));
    let category = this.categories.filter((item) => {
      return item.value == this.selectedCategory;
    })[0].name;
    this.lineChartData[0] = {
      data  : data,
      label : category
    }
    this.lineChartLabels = dates;
  }

  onCategoryChanged(){
    this.updateChart();
  }
}
