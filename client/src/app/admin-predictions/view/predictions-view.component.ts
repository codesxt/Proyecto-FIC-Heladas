import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StationsService } from '../../shared/services/stations.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

// Dependencies of the datepicker
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { es } from 'ngx-bootstrap/locale';
defineLocale('es', es);

import * as moment from 'moment';
moment.locale('es-cl');

interface prediction {
	station: string;
  frost: boolean,
  prediction_time: string,
  prediction_date: string,
  probability?: string,
  probability_id?: string,
	next_prediction_time?: string
}

@Component({
  templateUrl: 'predictions-view.component.html'
})
export class PredictionsViewComponent implements OnInit {
  stationId: string;
  prediction: prediction;
  predictionDate: Date;
	history : any[] = [];

	// DatePicker Variables
	minDate   : Date = new Date(2013, 1, 1);
	maxDate   : Date = new Date();
	dateValue : Date = new Date();
	bsConfig  : Partial<BsDatepickerConfig>;

  constructor(
    private stationsService : StationsService,
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

		this.bsConfig = {
			locale: 'es',
			showWeekNumbers: false
		}

    let now = new Date();
    let hour = now.getHours();

    if(hour < 15){
      console.log("Consultando Predicciones del Día Anterior");
      this.stationsService.getStationDayBeforePrediction(this.stationId)
      .subscribe(
        data => {
          this.prediction = {
            station: data.data.station,
            frost: data.data.frost,
            prediction_time: data.data.time,
            prediction_date: data.data.date
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
			this.stationsService.getStationDayPrediction(this.stationId)
      .subscribe(
        data => {
					this.prediction = {
            station: data.data.station,
            frost: data.data.frost,
            prediction_time: data.data.time,
            prediction_date: data.data.date
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

	loadHistoryData(){
		this.stationsService.getStationPredictionHistory(this.stationId, this.dateValue.getFullYear(), this.dateValue.getMonth()+1)
		.subscribe(
			data => {
				console.log(data);
				this.history = data.data;
			},
			error => {

			}
		)
	}

	dateChanged(){
		this.loadHistoryData();
	}

	goBack(){
		this.location.back();
	}
}
