import { NgModule, ModuleWithProviders } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { PredictionTranslatePipe } from './pipes/prediction-translate';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

@NgModule({
  imports: [
    MomentModule,
    Ng2PageScrollModule
  ],
  providers: [

  ],
  declarations: [
    PredictionTranslatePipe
  ],
  exports: [
    MomentModule,
    Ng2PageScrollModule,
    PredictionTranslatePipe
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
