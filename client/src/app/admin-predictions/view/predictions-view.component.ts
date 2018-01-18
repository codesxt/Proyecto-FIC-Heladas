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

	// DatePicker Variables
	minDate   : Date = new Date(2013, 1, 1);
	maxDate   : Date = new Date();
	dateValue : Date = new Date();
	bsConfig  : Partial<BsDatepickerConfig>;

	station   : any = {};

	dailyMinimum : any[] = [];

  constructor(
    private stationsService : StationsService,
    private route        		: ActivatedRoute,
		private location     		: Location,
		private agrometService 	: AgrometService
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

		this.bsConfig = new BsDatepickerConfig();
		this.bsConfig.locale = 'es';
		this.bsConfig.showWeekNumbers = false;

    let now = new Date();
    let hour = now.getHours();

		this.stationsService.getStation(this.stationId)
		.subscribe(
			data => {
				this.station = data.attributes;
				this.getMinimumTemperatures();
			},
			error => {
				console.log(error);
			}
		)

    if(hour < 15){
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
				this.history = data.data;
			},
			error => {

			}
		)
	}

	getMinimumTemperatures(){
		if(this.station.idEMA){
			let startDate = moment(this.dateValue).date(2).hour(0).minute(0);
			let endDate   = moment(startDate).add(1, 'month').subtract(1, 'minute');
			if(moment().isBefore(endDate)){
				// Cambiar fecha de término
				endDate = moment().add(1, 'day').hour(23).minute(59);
			}
			this.agrometService.getEmaHistory(this.station.idEMA, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'))
			.subscribe(
				data => {
					let minimumTemperatures = [];
					// Los resultados de la obtención de mediciones de agromet
					// se agrupan por fechas
					var results = _.groupBy(data.data, (item) => {
						return moment.utc(item.date).format('YYYY-MM-DD');
					})

					// Se crea un arreglo con la lista de fechas para las que se realizaron
					// predicciones
					let predictionDates = [];
					for(let h of this.history){
						predictionDates.push(h.date);
					}

					// Se itera para revisar la temperatura mínima correspondiente a cada día
					_.forEach(results, (value, key) => {
						// value es un array con las mediciones de cada uno de los días.
						// Se debe ignorar el día si la fecha no está en
						// los días en que se realizaron predicciones
						if(predictionDates.indexOf(moment(value[0].date).format('YYYY-MM-DD')) == -1){
							return;
						}
						let minValue = null;
						for(let v of value){
							// Se prueba cada uno de los valores de temperatura.
							// Si es un número válido, se compara con la temperatura mínima
							let candidate = parseFloat(v.temperatureMin);
							if(!isNaN(candidate)){
								// El valor de temperatura es un número válido;
								if(minValue == null){
									minValue = candidate;
								}else if(candidate < minValue){
									minValue = candidate;
								}
							}
						}
						minimumTemperatures.push(minValue);
					});
					this.dailyMinimum = minimumTemperatures;
				},
				error => {
					console.log(error);
				}
			)
		}
	}

	dateChanged(){
		this.dailyMinimum = null;
		this.loadHistoryData();
		this.getMinimumTemperatures();
	}

	goBack(){
		this.location.back();
	}
}
