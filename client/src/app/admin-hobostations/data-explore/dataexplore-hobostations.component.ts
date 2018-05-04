import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HoboStationsService } from '../../shared/services/hobostations.service';

// Dependencies of the datepicker
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { es } from 'ngx-bootstrap/locale';
defineLocale('es', es);

import * as moment from 'moment';
moment.locale('es-cl');

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-admin-hobostations-dataexplore',
  templateUrl: './dataexplore-hobostations.component.html'
})
export class AdminHoboStationsDataExploreComponent implements OnInit {
  stations : any = [];
  meta     : any = [];
  stationForm: FormGroup;

  total    : number = 1;
  page     : number = 1;
  pageSize : number = 10;
  stationData : any = [];

  plotCategories : Array<any> = [
    {
      displayName : 'Temperatura',
      name        : 'temperature'
    },
    {
      displayName : 'Precipitaciones',
      name        : 'rain'
    },
    {
      displayName : 'Presión Atmosférica',
      name        : 'pressure'
    },
    {
      displayName : 'Humedad Relativa',
      name        : 'rh'
    },
    {
      displayName : 'Punto de Rocío',
      name        : 'dewPoint'
    },
    {
      displayName : 'Radiación Solar',
      name        : 'solarRadiation'
    },
    {
      displayName : 'Dirección del Viento',
      name        : 'windDirection'
    },
    {
      displayName : 'Velocidad del Viento',
      name        : 'windSpeed'
    },
    {
      displayName : 'Velocidad de Ráfaga',
      name        : 'gustSpeed'
    },
    {
      displayName : 'Batería',
      name        : 'battery'
    }
  ]

  // lineChart
  lineChartData: Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
  ];
  lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  lineChartOptions: any = {
    animation: false,
    responsive: true
  };
  lineChartColours: Array<any> = [
    { // grey
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

  // DatePicker Variables
	minDate   : Date = new Date(2013, 1, 1);
	maxDate   : Date = new Date();
	dateValue : Date = new Date();
  dateValue2: Date = new Date();
	bsConfig  : Partial<BsDatepickerConfig>;

  displayTable : boolean = false;
  constructor(
    private notificationsService : NotificationsService,
    private router               : Router,
    private stationsService      : HoboStationsService,
    private formBuilder          : FormBuilder
  ) {  }

  ngOnInit() {
    this.stationForm = this.formBuilder.group({
      station  : ['', Validators.required],
      category : ['', Validators.required]
    })
    this.stationForm.patchValue({
      category : this.plotCategories[0].name
    })
    this.loadStations();
  }

  toggleTable(){
    this.displayTable = !this.displayTable;
  }

  onStationChanged($event){
    this.loadStationData();
  }

  onCategoryChanged($event){
    this.plotData($event.target.value);
  }

  dateChanged(){
    this.loadStationData();
  }

  loadStationData(){
    let date = moment(this.dateValue).format('YYYY-MM-DD');
    let date2 = moment(this.dateValue2).format('YYYY-MM-DD');
    this.stationsService.getStationDataByDate(this.stationForm.get('station').value, date, date2)
    .subscribe(
      data => {
        this.stationData = data;
        this.plotData('temperature');
        this.stationForm.patchValue({
          category : this.plotCategories[0].name
        })
        //console.log(new Date(data[0].date).toLocaleString())
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Los datos de la estación no se pudieron leer.\n'
        )
        console.log(error);
      }
    )
  }

  plotData(category: string){
    let clone = JSON.parse(JSON.stringify(this.lineChartData));
    let dataset = [];
    let labels  = [];
    this.stationData.forEach((item) => {
      dataset.push(item[category])
      labels.push(new Date(item.date).toLocaleString());
    })
    clone[0].data  = dataset;
    clone[0].label = this.plotCategories.filter((item) => {
      return category == item.name
    })[0].displayName;
    this.lineChartData = clone;
    this.lineChartLabels.length = 0;
    labels.forEach((item) => {
      this.lineChartLabels.push(item);
    })
  }

  loadStations(){
    this.stationsService.getStations(this.page-1, 0)
    .subscribe(
      data => {
        this.notificationsService.success(
          'Datos cargados',
          'Los datos de estaciones se leyeron exitosamente.'
        )
        this.stations = data.data;
        this.meta     = data.meta;
        this.total    = this.meta['total-items'];
        if(this.stations.length>0){
          this.stationForm.patchValue({
            station: this.stations[0].name
          })
          this.loadStationData();
        }
      },
      error => {
        this.notificationsService.error(
          'Error',
          'Los datos de estaciones no se pudieron leer.\n'+'Detalles: '+ error.json().message
        )
      }
    );
  }

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  downloadData(){
    let data = [];
    let labels = [
      'Fecha',
      'Presión Atmosférica',
      'Precipitaciones',
      'Temperatura',
      'Humedad Relativa',
      'Punto de Rocío',
      'Radiación Solar',
      'Dirección del Viento',
      'Velocidad del Viento',
      'Velocidad de Ráfaga',
      'Batería'
    ]
    let station = this.stations.filter((item) => {
      return item.name == this.stationForm.get('station').value
    })[0].displayName;
    let title = 'Datos Exportados ' + station + " - " + moment(this.dateValue).format('YYYY-MM-DD') + " - " + moment(this.dateValue2).format('YYYY-MM-DD');;
    this.stationData.forEach((item) => {
      data.push({
        date           : item.date,
        pressure       : item.pressure,
        rain           : item.rain,
        temperature    : item.temperature,
        rh             : item.rh,
        dewPoint       : item.dewPoint,
        solarRadiation : item.solarRadiation,
        windDirection  : item.windDirection,
        windSpeed      : item.windSpeed,
        gustSpeed      : item.gustSpeed,
        battery        : item.battery
      })
    })
    let options = {
      fieldSeparator   : ',',
      quoteStrings     : '"',
      decimalseparator : '.',
      showLabels       : true,
      showTitle        : false,
      headers          : labels,
      useBom           : true
    };
    new Angular2Csv(data, title, options);
  }
}
