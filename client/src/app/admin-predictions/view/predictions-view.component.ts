import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StationsService } from '../../shared/services/stations.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationsService } from 'angular2-notifications'

// Dependencies of the datepicker
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { es } from 'ngx-bootstrap/locale';
defineLocale('es', es);

import * as moment from 'moment';
moment.locale('es-cl');

import { AgrometService } from '../../shared/services/agromet.service';
import * as _ from 'lodash';

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
	nextPrediction: string = ''

	// DatePicker Variables
	minDate   : Date = new Date(2013, 1, 1);
	maxDate   : Date = new Date();
	dateValue : Date = new Date();
	dateValue2: Date = new Date();
	bsConfig  : Partial<BsDatepickerConfig>;

	station   : any = {};

  constructor(
    private stationsService : StationsService,
    private route        		: ActivatedRoute,
		private location     		: Location,
		private agrometService 	: AgrometService,
		private localeService   : BsLocaleService,
		private notificationsService : NotificationsService
  ) { }

  ngOnInit(){
    this.route.params.subscribe(params => {
       this.stationId = params['id'];
    });

		this.bsConfig = new BsDatepickerConfig();
		this.bsConfig.showWeekNumbers = false;
		this.localeService.use('es');

    let now = new Date()
    let hour = now.getHours()
		if (hour < 15) {
			this.nextPrediction = '15:00 hrs.'
		} else if (hour < 18) {
			this.nextPrediction = '18:00 hrs.'
		} else if (hour < 21) {
			this.nextPrediction = '21:00 hrs.'
		} else {
			this.nextPrediction = 'Mañana a las 15:00 hrs.'
		}

		this.agrometService.getAgrometStation(this.stationId)
		.subscribe(
			data => {
				this.station = data.attributes
				this.getLastPrediction()
				this.loadHistoryData()
			},
			error => {
				console.log(error)
			}
		)
  }

	getLastPrediction () {
		this.agrometService.getLastPrediction(this.stationId)
		.subscribe(
			data => {
				this.prediction = data
				this.predictionDate = moment(data.date).add(1, 'day').toDate()
			},
			error => {
				console.log(error)
				this.notificationsService.error(
					'Error',
					'No se obtuvo la predicción para la estación ' + this.station.name
				)
			}
		)
	}

	loadHistoryData(){
		let from = moment(this.dateValue).format('YYYY-MM-DD')
    let to = moment(this.dateValue2).format('YYYY-MM-DD')
		this.agrometService.getPredictionHistory(this.stationId, from, to)
		.subscribe(
			data => {
				this.history = data.data
			},
			error => {
				console.log(error)
			}
		)
	}

	dateChanged(){
		this.loadHistoryData();
		console.log(this.dateValue, this.dateValue2)
	}

	goBack(){
		this.location.back();
	}
}
