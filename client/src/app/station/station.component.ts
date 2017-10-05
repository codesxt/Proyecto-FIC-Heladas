import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FrostService } from '../shared/services/frost.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import * as moment from 'moment';
moment.locale('es-cl');

interface prediction {
	station: string;
  status: {
    id: number,
    name: string
  },
  prediction_time: string,
  probability?: string,
  probability_id?: string,
  prediction_date: string,
	next_prediction_time?: string
}

@Component({
  templateUrl: 'station.component.html'
})
export class StationComponent implements OnInit {
  stationId: string;
  prediction: prediction;
  predictionDate: Date;
  constructor(
    private frostService : FrostService,
    private route        : ActivatedRoute,
		private location     : Location
  ) { }

	setNextPredictionTime(){
		let now = new Date();
    let hour = now.getHours();
		if(hour < 15){
			this.prediction.next_prediction_time =  '15:00';
		}else if (hour < 18){
			this.prediction.next_prediction_time = '18:00';
		}else if (hour < 12){
			this.prediction.next_prediction_time = '21:00';
		}else{
			this.prediction.next_prediction_time = '';
		}
	}

  ngOnInit(){
    this.route.params.subscribe(params => {
       this.stationId = params['id'];
    });

    let now = new Date();
    let hour = now.getHours();

    if(hour < 15){
      console.log("Consultando Predicciones del Día Anterior");
      this.frostService.getDayBeforePrediction(this.stationId)
      .subscribe(
        data => {
          this.prediction = {
            station: data.estacion,
            status: {
              id: data.id_estado,
              name: data.nom_estado
            },
            prediction_time: data.horario_prediccion,
            prediction_date: data.fecha_pred
          };
          this.predictionDate = new Date();
					this.setNextPredictionTime();
        },
        error => {
          console.log(error);
        }
      )
    }else{
      console.log("Consultando Predicciones del Día Actual")
			this.frostService.getDayPrediction(this.stationId)
      .subscribe(
        data => {
          this.prediction = {
            station: data.estacion,
            status: {
              id: data.id_estado,
              name: data.nom_estado
            },
            prediction_time: data.horario_prediccion,
            prediction_date: data.fecha_pred
          };
          this.predictionDate = moment().add(1, 'days').toDate();
					this.setNextPredictionTime();
        },
        error => {
          console.log(error);
        }
      )
    }
  }

	goBack(){
		this.location.back();
	}
}
