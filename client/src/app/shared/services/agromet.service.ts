import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AgrometService {
  baseURL: string = environment.apiUrl;
  constructor(
    private http: Http,
    private authenticationService : AuthenticationService
  ) { }

  getEmaHistory(emaId: number, from: string, to?: string): any{
    let headers = new Headers({  });
    let options = new RequestOptions({
      headers: headers
    });
    let url = this.baseURL+'/api/v1/agromet/history/'+emaId;
    url += '?from=' + from;
    if(to){
      url += '&to='+to;
    }
    return this.http.get(url, options).map(
      (response: Response) => response.json()
    );
  }

  getDayPrediction(stationId: string): any{
    let headers = new Headers({  });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseURL+'/consulta/index.php?id_est='+stationId, { id_est: stationId }, options).map(
      (response: Response) => response.json()
    );
  }

  getHistory(stationId: string, predictionHour: number, year: number, month: number): any{
    let headers = new Headers({  });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseURL+'/monitor/acciones.php?acc=1&id_est='+stationId+"&id_hor="+predictionHour+"&anno="+year+"&mes="+month, {
      acc: 1,
      id_est: stationId,
      id_hor: predictionHour,
      anno: year,
      mes: month
    }, options).map(
      (response: Response) => response.json()
    );
  }

  getHistoryV2(stationID: number, fromDate: string, toDate?: string): any{
    let headers = new Headers({  });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('from', fromDate);
    if(toDate){
      params.append('to', toDate);
    }
    let options = new RequestOptions({
      headers : headers,
      params  : params
    });
    let url = this.baseURL+'/api/v1/agromet/history/'+stationID;
    return this.http.get(url, options).map(
      (response: Response) => response.json()
    );
  }

  getStations(): any{
    let headers = new Headers({  });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseURL+'/monitor/acciones.php?acc=2', { acc: 2 }, options).map(
      (response: Response) => response.json()
    );
  }

  getRegions(): any{
    let headers = new Headers({  });
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({
      headers: headers
    });
    let url = this.baseURL+'/api/v1/agromet/regions';
    return this.http.get(url, options).map(
      (response: Response) => response.json()
    );
  }

  getCities(region: number): any{
    let headers = new Headers({  });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('region', region+"");
    let options = new RequestOptions({
      headers: headers,
      params: params
    });
    let url = this.baseURL+'/api/v1/agromet/cities';
    return this.http.get(url, options).map(
      (response: Response) => response.json()
    );
  }

  getStationsV2(region: number, city: number): any{
    let headers = new Headers({  });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('region', region+"");
    params.append('city', city+"");
    let options = new RequestOptions({
      headers: headers,
      params: params
    });
    let url = this.baseURL+'/api/v1/agromet/emas';
    return this.http.get(url, options).map(
      (response: Response) => response.json()
    );
  }

  createAgrometStation(stationData: any){
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseURL + '/api/v1/agrometstations', stationData, options).map(
      (response: Response) => response.json()
    );
  }

  getAgrometStations(pageNumber: number = 0, pageSize: number = 1): any{
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
    return this.http.get(this.baseURL+'/api/v1/agrometstations', options).map(
      (response: Response) => response.json()
    );
  }

  getAgrometPublicStations(pageNumber: number = 0, pageSize: number = 1): any{
    let headers = new Headers({ });
    let params = new URLSearchParams();
    params.append('page[number]', pageNumber+"");
    params.append('page[size]', pageSize+"");
    let options = new RequestOptions({
      headers: headers,
      params: params
    });
    return this.http.get(this.baseURL+'/api/v1/agrometpublicstations', options).map(
      (response: Response) => response.json()
    );
  }

  getAgrometStation(stationId: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseURL+'/api/v1/agrometstations/' + stationId, options).map(
      (response: Response) => response.json()
    );
  }

  updateAgrometStation(stationId: string, stationData: any): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.patch(this.baseURL+'/api/v1/agrometstations/' + stationId, stationData, options).map(
      (response: Response) => response.json()
    );
  }

  deleteAgrometStation(stationId: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.delete(this.baseURL+'/api/v1/agrometstations/' + stationId, options).map(
      (response: Response) => response.json()
    );
  }

  backupAgrometData(stationID: number, fromDate: string, toDate?: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('from', fromDate);
    if(toDate){
      params.append('to', toDate);
    }
    let options = new RequestOptions({
      headers : headers,
      params  : params
    });
    let url = this.baseURL+'/api/v1/agrometdata/'+stationID;
    return this.http.put(url, {}, options).map(
      (response: Response) => response.json()
    );
  }

  getAgrometDataCount(stationID: number, fromDate: string, toDate?: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('from', fromDate);
    if(toDate){
      params.append('to', toDate);
    }
    let options = new RequestOptions({
      headers : headers,
      params  : params
    });
    let url = this.baseURL+'/api/v1/agrometdata/count/'+stationID;
    return this.http.get(url, options).map(
      (response: Response) => response.json()
    );
  }

  removeAgrometData(stationID: number, fromDate: string, toDate?: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('from', fromDate);
    if(toDate){
      params.append('to', toDate);
    }
    let options = new RequestOptions({
      headers : headers,
      params  : params
    });
    let url = this.baseURL+'/api/v1/agrometdata/'+stationID;
    return this.http.delete(url, options).map(
      (response: Response) => response.json()
    );
  }

  // Endpoints para gestionar las predicciones almacenadas en el sistema
  // (Versión nueva de las predicciones que no depende del sistema anterior)
  getLastPrediction (stationID: string) {
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    let options = new RequestOptions({
      headers : headers,
      params  : params
    });
    let url = this.baseURL+'/api/v1/last-station-prediction/'+stationID;
    return this.http.get(url, options).map(
      (response: Response) => response.json()
    );
  }

  getPredictionHistory(stationID: string, fromDate: string, toDate?: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('from', fromDate);
    if(toDate){
      params.append('to', toDate);
    }
    let options = new RequestOptions({
      headers : headers,
      params  : params
    });
    let url = this.baseURL+'/api/v1/agromet-prediction-history/'+stationID;
    return this.http.get(url, options).map(
      (response: Response) => response.json()
    );
  }

  getMeasurements(stationID: string, fromDate: string, toDate?: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('from', fromDate);
    if(toDate){
      params.append('to', toDate);
    }
    let options = new RequestOptions({
      headers : headers,
      params  : params
    });
    let url = this.baseURL+'/api/v1/agrometmeasurements/'+stationID;
    return this.http.get(url, options).map(
      (response: Response) => response.json()
    );
  }

  deleteMeasurements(stationID: string, fromDate: string, toDate?: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    params.append('from', fromDate);
    if(toDate){
      params.append('to', toDate);
    }
    let options = new RequestOptions({
      headers : headers,
      params  : params
    });
    let url = this.baseURL+'/api/v1/agrometmeasurements/'+stationID;
    return this.http.delete(url, options).map(
      (response: Response) => response.json()
    );
  }
}
