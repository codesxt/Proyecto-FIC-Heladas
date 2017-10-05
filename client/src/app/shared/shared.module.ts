import { NgModule, ModuleWithProviders } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { PredictionTranslatePipe } from './pipes/prediction-translate';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { RoleTranslatePipe } from './pipes/role-translate';

@NgModule({
  imports: [
    MomentModule,
    Ng2PageScrollModule
  ],
  providers: [

  ],
  declarations: [
    PredictionTranslatePipe,
    RoleTranslatePipe
  ],
  exports: [
    MomentModule,
    Ng2PageScrollModule,
    PredictionTranslatePipe,
    RoleTranslatePipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [

      ]
    };
  }
}
