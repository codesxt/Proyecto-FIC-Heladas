import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FrostService } from '../shared/services/frost.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/bs-moment';
import { es } from 'ngx-bootstrap/locale';
defineLocale('es', es);

import * as moment from 'moment';
moment.locale('es-cl');

import {Observable} from "rxjs/Rx";

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
  templateUrl: 'station-history.component.html'
})
export class StationHistoryComponent implements OnInit {
  stationId: string;

	minDate   : Date = new Date(2013, 1, 1);
	maxDate   : Date = new Date();
	dateValue : Date = new Date();
	bsConfig  : Partial<BsDatepickerConfig>;

	history15 : any[];
	history18 : any[];
	history21 : any[];

	history   : any[] = [];

  constructor(
    private frostService : FrostService,
    private route        : ActivatedRoute,
		private location     : Location
  ) { }

  ngOnInit(){
    this.route.params.subscribe(params => {
       this.stationId = params['id'];
			 this.loadHistoryData();
    });


		this.bsConfig = new BsDatepickerConfig();
		this.bsConfig.locale = 'es';
		this.bsConfig.showWeekNumbers = false;
  }

	loadHistoryData(){
		// Get Predictions at 15:00
		this.frostService.getHistory(this.stationId, 15, this.dateValue.getFullYear(), this.dateValue.getMonth()+1)
		.subscribe(
			data => {
				this.history15 = data.data.map(
					val => {
						return {
							date: val.fecha_pred,
							prediction: val.nom_estado
						}
					}
				)
				// Get Predictions at 18:00
				this.frostService.getHistory(this.stationId, 18, this.dateValue.getFullYear(), this.dateValue.getMonth()+1)
				.subscribe(
					data => {
						this.history18 = data.data.map(
							val => {
								return {
									date: val.fecha_pred,
									prediction: val.nom_estado
								}
							}
						)
						// Get Predictions at 21:00
						this.frostService.getHistory(this.stationId, 21, this.dateValue.getFullYear(), this.dateValue.getMonth()+1)
						.subscribe(
							data => {
								this.history21 = data.data.map(
									val => {
										return {
											date: val.fecha_pred,
											prediction: val.nom_estado
										}
									}
								)
								this.mixArrays()
							},
							error => {

							}
						)
					},
					error => {

					}
				)
			},
			error => {

			}
		)
	}

	mixArrays(){
		let newArray = this.history15.map(
			item => {
				let p18 = this.history18.filter(
					otherItem => {
						return otherItem.date === item.date
					}
				)[0];
				let pred18 = (p18) ? p18.prediction : undefined;
				let p21 = this.history21.filter(
					otherItem => {
						return otherItem.date === item.date
					}
				)[0];
				let pred21 = (p21) ? p21.prediction : undefined;
				return {
					date   : item.date,
					pred15 : item.prediction,
					pred18 : pred18,
					pred21 : pred21
				}
			}
		)
		this.history = newArray;
	}

	dateChanged(){
		this.loadHistoryData();
	}

	goBack(){
		this.location.back();
	}
}
