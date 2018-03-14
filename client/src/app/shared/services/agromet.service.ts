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
}
