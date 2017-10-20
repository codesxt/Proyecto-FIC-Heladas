import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';

@Injectable()
export class AgrometService {
  baseURL: string = environment.apiUrl;
  constructor(
    private http: Http
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

  getStations(): any{
    let headers = new Headers({  });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseURL+'/monitor/acciones.php?acc=2', { acc: 2 }, options).map(
      (response: Response) => response.json()
    );
  }
}
