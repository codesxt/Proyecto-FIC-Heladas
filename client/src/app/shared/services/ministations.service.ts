import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as JWT from 'jwt-decode';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class MiniStationsService {
  baseURL: string = environment.apiUrl;
  constructor(
    private http: Http,
    private authenticationService: AuthenticationService
  ) { }

  createControllerNode(data: any){
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.post(this.baseURL + '/api/v1/controller-nodes', data, options).map(
      (response: Response) => response.json()
    );
  }

  getControllerNodes(pageNumber: number = 0, pageSize: number = 1): any{
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
    return this.http.get(this.baseURL+'/api/v1/controller-nodes', options).map(
      (response: Response) => response.json()
    );
  }

  getControllerNode(id: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseURL+'/api/v1/controller-nodes/' + id, options).map(
      (response: Response) => response.json()
    );
  }

  updateControllerNode(id: string, data: any): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.patch(this.baseURL+'/api/v1/controller-nodes/' + id, data, options).map(
      (response: Response) => response.json()
    );
  }
}
