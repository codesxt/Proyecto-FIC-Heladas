import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as JWT from 'jwt-decode';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class StationsService {
  baseURL: string = environment.apiUrl;
  constructor(
    private http: Http,
    private authenticationService: AuthenticationService
  ) { }

  getEmaList(){
    return this.http.get(this.baseURL+'/api/v1/ema').map(
      (response: Response) => response.json()
    );
  }

  createStation(stationData: any){
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseURL + '/api/v1/stations', stationData, options).map(
      (response: Response) => response.json()
    );
  }

  getStations(pageNumber: number = 0, pageSize: number = 1): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let params = new URLSearchParams();
    params.append('page[number]', pageNumber+"");
    params.append('page[size]', pageSize+"");
    let options = new RequestOptions({
      headers: headers,
      params: params
    });
    return this.http.get(this.baseURL+'/api/v1/stations', options).map(
      (response: Response) => response.json()
    );
  }

  getPublicStations(pageNumber: number = 0, pageSize: number = 1): any{
    let headers = new Headers({ });
    let params = new URLSearchParams();
    params.append('page[number]', pageNumber+"");
    params.append('page[size]', pageSize+"");
    let options = new RequestOptions({
      headers: headers,
      params: params
    });
    return this.http.get(this.baseURL+'/api/v1/public-stations', options).map(
      (response: Response) => response.json()
    );
  }

  getStation(stationId: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseURL+'/api/v1/stations/' + stationId, options).map(
      (response: Response) => response.json()
    );
  }

  updateStation(stationId: string, stationData: any): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.patch(this.baseURL+'/api/v1/stations/' + stationId, stationData, options).map(
      (response: Response) => response.json()
    );
  }

  deleteStation(stationId: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.delete(this.baseURL+'/api/v1/stations/' + stationId, options).map(
      (response: Response) => response.json()
    );
  }

  getStationDayPrediction(stationId: string){
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseURL+'/api/v1/day-prediction/' + stationId, options).map(
      (response: Response) => response.json()
    );
  }

  getStationDayBeforePrediction(stationId: string){
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseURL+'/api/v1/day-before-prediction/' + stationId, options).map(
      (response: Response) => response.json()
    );
  }

  getStationPredictionHistory(stationId: string, year: number, month: number){
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let params = new URLSearchParams();
    params.append('year', year+"");
    params.append('month', month+"");
    let options = new RequestOptions({
      headers: headers,
      params: params
    });
    return this.http.get(this.baseURL+'/api/v1/predictions-history/' + stationId, options).map(
      (response: Response) => response.json()
    );
  }
}
