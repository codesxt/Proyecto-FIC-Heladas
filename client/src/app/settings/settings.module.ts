import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SettingsComponent } from './settings.component';

import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    SettingsRoutingModule,
    FormsModule,
    CommonModule
  ],
  declarations: [
    SettingsComponent
  ]
})
export class SettingsModule { }
