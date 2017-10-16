import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as JWT from 'jwt-decode';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class SubscriptionsService {
  baseURL: string = environment.apiUrl;
  constructor(
    private http: Http,
    private authenticationService: AuthenticationService
  ) { }

  getSubscriptions(): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseURL+'/api/v1/subscriptions', options).map(
      (response: Response) => response.json()
    );
  }

  subscribeToStation(stationId): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseURL+'/api/v1/subscriptions/'+stationId, {}, options).map(
      (response: Response) => response.json()
    );
  }

  unsubscribeToStation(stationId): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.delete(this.baseURL+'/api/v1/subscriptions/'+stationId, options).map(
      (response: Response) => response.json()
    );
  }
}
