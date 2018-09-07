import { Component, OnInit, NgZone, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { MiniStationsService } from '../../shared/services/ministations.service';
import { NotificationsService } from 'angular2-notifications';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { environment } from '../../../environments/environment';

// Dependencies of the datepicker
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { es } from 'ngx-bootstrap/locale';
defineLocale('es', es);

import * as moment from 'moment';
moment.locale('es-cl');

@Component({
  templateUrl: 'measurements.component.html'
})
export class MeasurementsComponent implements OnInit {
  nodes     : any[] = [];
  stations  : any[] = [];
  selection : any = {
    node    : null,
    station : null
  }
  measurementData : any[] = []

  // Fields related to file upload
  uploadUrl : string = environment.miniStationUpload;
  uploadOptions: UploaderOptions;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  // DatePicker Variables
	minDate   : Date = new Date(2013, 1, 1);
	maxDate   : Date = new Date();
	dateValue : Date = moment().subtract(1, 'days').toDate();
  dateValue2: Date = new Date();
	bsConfig  : Partial<BsDatepickerConfig> = {
    dateInputFormat : 'DD MMM YYYY'
  };

  // Chart Variables
  plotCategories : Array<any> = [
    {
      displayName : 'Temperatura',
      name        : 'temperature'
    },
    {
      displayName : 'Humedad',
      name        : 'humidity'
    },
    {
      displayName : 'Radiación',
      name        : 'radiation'
    }
  ]
  selectedCategory : string = 'temperature';
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
  constructor(
    private router               : Router,
    private route                : ActivatedRoute,
    private notificationsService : NotificationsService,
    private miniStationsService  : MiniStationsService,
    private zone                 : NgZone,
    private localeService        : BsLocaleService
  ) { }

  ngOnInit(){
    this.loadNodesData();

    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;

    this.localeService.use('es');
  }

  loadNodesData(){
    this.miniStationsService.getControllerNodes(0, 0)
    .subscribe(
      response => {
        this.nodes = response.data;
        if(this.nodes.length>0){
          this.selection.node = this.nodes[0]._id;
          this.loadStationsData();
        }else{
          this.selection.node = null;
        }
      },
      error => {
        this.notificationsService.error('Error', 'Ocurrió un error al cargar los nodos.');
      }
    )
  }

  loadStationsData(){
    let node = this.nodes.filter(item => {
      return item._id == this.selection.node
    })[0];
    if(node.stations.length>0){
      this.stations = node.stations;
      this.selection.station = this.stations[0]._id;
      this.loadMeasurements();
    }else{
      this.selection.station = null;
    }
  }

  onNodeChanged($event){
    this.selection.node = $event.target.value;
    this.loadStationsData();
  }

  onStationChanged($event){
    this.selection.station = $event.target.value;
    if(this.selection.station){
      this.loadMeasurements();
    }
  }

  onDateChanged(){
    this.loadMeasurements();
  }

  onCategoryChanged($event){
    this.selectedCategory = $event.target.value;
    this.plotData(this.selectedCategory);
  }

  plotData(category: string){
    let clone = JSON.parse(JSON.stringify(this.lineChartData));
    let dataset = [];
    let labels  = [];
    this.measurementData.forEach((item) => {
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

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.uploadUrl,
        method: 'POST',
        data: {
          station : this.selection.station,
          node    : this.selection.node
        }
      };
      this.uploadInput.emit(event);
    } else if (output.type === 'addedToQueue'  && typeof output.file !== 'undefined') { // add file to array when added
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    } else if (output.type === 'done') {
      console.log(output)
      if([0, 400, 401, 404].includes(output.file.responseStatus)){
        this.notificationsService.error('Error', 'La subida del archivo no se realizó (Error: '+output.file.responseStatus+')');
      }else{
        this.loadMeasurements();
      }
    }
  }

  loadMeasurements(){
    if(this.selection.node && this.selection.station){
      let date = moment(this.dateValue).format('YYYY-MM-DD');
      let date2 = moment(this.dateValue2).format('YYYY-MM-DD');
      this.miniStationsService.getStationDataByDate(this.selection.station, this.selection.node, date, date2)
      .subscribe(
        data => {
          this.measurementData = data;
          this.plotData(this.selectedCategory);
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
  }
}
