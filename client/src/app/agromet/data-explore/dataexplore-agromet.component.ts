import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HoboStationsService } from '../../shared/services/hobostations.service';
import { AgrometService } from '../../shared/services/agromet.service';

// Dependencies of the datepicker
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { es } from 'ngx-bootstrap/locale';
defineLocale('es', es);

import * as moment from 'moment';
moment.locale('es-cl');

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-admin-agromet-dataexplore',
  templateUrl: './dataexplore-agromet.component.html'
})
export class AgrometDataExploreComponent implements OnInit {
  station  : any = null;
  stationId: string = null;

  stations : any = [];
  meta     : any = [];
  stationForm: FormGroup;

  total    : number = 1;
  page     : number = 1;
  pageSize : number = 10;
  stationData : any = [];

  plotCategories : Array<any> = [
    {
      displayName : 'Temperatura Promedio',
      name        : 'airTemperatureAvg'
    },
    {
      displayName : 'Temperatura Mínima',
      name        : 'temperatureMin'
    },
    {
      displayName : 'Temperatura Máxima',
      name        : 'temperatureMax'
    },
    {
      displayName : 'Precipitaciones',
      name        : 'hourlyRainfall'
    },
    {
      displayName : 'Presión Atmosférica',
      name        : 'atmosphericPressure'
    },
    {
      displayName : 'Humedad Relativa',
      name        : 'relativeHumidityAvg'
    },
    {
      displayName : 'Radiación Solar',
      name        : 'solarRadiationMax'
    },
    {
      displayName : 'Dirección del Viento',
      name        : 'windDirection'
    },
    {
      displayName : 'Velocidad del Viento',
      name        : 'windSpeedMax'
    },
    {
      displayName : 'Grados Día',
      name        : 'degreeDay'
    },
    {
      displayName : 'Horas de frío',
      name        : 'coldHours'
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
    private route                : ActivatedRoute,
    private stationsService      : HoboStationsService,
    private agrometService       : AgrometService,
    private formBuilder          : FormBuilder
  ) {  }

  ngOnInit() {
    this.stationForm = this.formBuilder.group({
      category : ['', Validators.required]
    })
    this.stationForm.patchValue({
      category : this.plotCategories[0].name
    })
    this.route.params.subscribe(params => {
      this.agrometService.getAgrometStation(params.id)
  		.subscribe(
  			data => {
          this.stationId = params.id
  				this.station = data.attributes
          this.loadStationData();
  			},
  			error => {
  				console.log(error)
  			}
  		)
    })
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
    console.log('Loading data.')
    let from = moment(this.dateValue).format('YYYY-MM-DD')
    let to = moment(this.dateValue2).format('YYYY-MM-DD')
    this.agrometService.getMeasurements(this.stationId, from, to)
    .subscribe(
      data => {
        this.stationData = data
        this.plotData(
          this.stationForm.get('category').value
        )
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
      'T° Promedio',
      'T° Mínima',
      'T° Máxima',
      'Precipitaciones / hr.',
      'Presión Atmosférica',
      'Humedad Relativa',
      'Radiación Solar',
      'Dirección del Viento',
      'Velocidad del Viento',
      'Grados Día',
      'Horas de frío'
    ]
    let station = this.station.name;
    let title = 'Datos Exportados ' + station + " - " + moment(this.dateValue).format('YYYY-MM-DD') + " - " + moment(this.dateValue2).format('YYYY-MM-DD');;
    this.stationData.forEach((item) => {
      data.push({
        date           : moment(item.date).format('YYYY-MM-DD HH:mm:ss'),
        temperature    : item.airTemperatureAvg,
        temperatureMin : item.temperatureMin,
        temperatureMax : item.temperatureMax,
        hourlyRainfall : item.hourlyRainfall,
        atmosphericPressure : item.atmosphericPressure,
        relativeHumidityAvg : item.relativeHumidityAvg,
        solarRadiationMax : item.solarRadiationMax,
        windDirection : item.windDirection,
        windSpeed : item.windSpeedMax,
        degreeDay : item.degreeDay,
        coldHours : item.coldHours
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

  deleteData () {
    let conf = confirm('¿Estás seguro de querer borrar los datos seleccionados?')
    if (conf) {
      let from = moment(this.dateValue).format('YYYY-MM-DD')
      let to = moment(this.dateValue2).format('YYYY-MM-DD')
      this.agrometService.deleteMeasurements(this.stationId, from, to)
      .subscribe(
        data => {
          this.notificationsService.success(
            'Datos Eliminados',
            'Los datos de la estación se eliminaron.\n'
          )
          this.loadStationData()
        },
        error => {
          this.notificationsService.error(
            'Error',
            'Los datos de la estación no se pudieron eliminar.\n'
          )
          console.log(error);
        }
      )
    }    
  }
}
