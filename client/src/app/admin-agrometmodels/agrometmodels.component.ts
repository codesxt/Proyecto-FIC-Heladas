import { Component, OnInit, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../shared/services/authentication.service';
import { AgrometModelsService } from '../shared/services/agrometmodels.service';
import { NotificationsService } from 'angular2-notifications';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-agrometmodels',
  templateUrl: './agrometmodels.component.html'
})
export class AgrometModelsComponent implements OnInit {
  items: any[] = []

  uploadUrl : string = environment.agrometModelsUpload;
  options: UploaderOptions;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  constructor(
    private notificationsService : NotificationsService,
    private authenticationService: AuthenticationService,
    private agrometModelsService : AgrometModelsService
  ) {  }

  ngOnInit() {
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;

    this.loadModels()
  }

  loadModels ( ) {
    this.agrometModelsService.getAll()
    .subscribe(
      response => {
        this.items = response.data
      },
      error => {
        console.log(error)
      }
    )
  }

  removeFile (filename) {
    let conf = confirm('¿Estás seguro de que quieres eliminar el archivo ' + filename + '?')
    if (conf) {
      this.agrometModelsService.removeFile(filename)
      .subscribe(
        data => {
          this.notificationsService.success('Archivo Eliminado', 'El archivo '+filename+' fue eliminado.')
          this.loadModels()
        }
      )
    }
  }

  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') { // when all files added in queue
      // uncomment this if you want to auto upload files when added
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.uploadUrl,
        method: 'POST',
        data: {  }
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
      this.loadModels()
    }
  }
}
