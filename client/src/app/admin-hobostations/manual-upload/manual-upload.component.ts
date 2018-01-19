import { Component, OnInit, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { HoboStationsService } from '../../shared/services/hobostations.service';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-hobostations-upload',
  templateUrl: './manual-upload.component.html'
})
export class AdminHoboStationsManualUploadComponent implements OnInit {
  // Variables para la subida de archivos
  uploadUrl : string = environment.hoboUpload;
  options: UploaderOptions;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;

  stations : any = [];
  meta     : any = [];

  total    : number = 1;
  page     : number = 1;
  pageSize : number = 10;
  stationForm: FormGroup;
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private router               : Router,
    private stationsService      : HoboStationsService,
    private formBuilder          : FormBuilder
  ) {  }

  ngOnInit() {
    this.stationForm = this.formBuilder.group({
      station: ['', Validators.required]
    })
    //this.router.navigate(['/admin-hobostations/list']);
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    this.loadStations();
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.uploadUrl,
        method: 'POST',
        data: { station: 'station1' }
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
      // Terminó la subida
      //this.getData();
    }
  }

  loadStations(){
    this.stationsService.getStations(this.page-1, this.pageSize)
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
}
