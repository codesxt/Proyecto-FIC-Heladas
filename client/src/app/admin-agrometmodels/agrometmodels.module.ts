import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AgrometModelsComponent } from './agrometmodels.component';
import { AgrometModelsRoutingModule } from './agrometmodels-routing.module';

import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { NgUploaderModule } from 'ngx-uploader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgrometModelsRoutingModule,
    SharedModule,
    NgbModule,
    AgmCoreModule,
    NgUploaderModule
  ],
  declarations: [
    AgrometModelsComponent,
  ]
})
export class AgrometModelsModule { }
