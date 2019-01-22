import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class AgrometModelsService {
  baseURL: string = environment.apiUrl;
  constructor(
    private http: Http,
    private authenticationService : AuthenticationService
  ) { }

  getAll(){
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    headers.append('Content-Type', 'application/json');
    let params = new URLSearchParams();
    let options = new RequestOptions({
      headers : headers,
      params  : params
    });
    let url = this.baseURL+'/api/v1/agrometmodels';
    return this.http.get(url, options).map(
      (response: Response) => response.json()
    );
  }

  removeFile(filename: string): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let params = new URLSearchParams();
    let options = new RequestOptions({
      headers : headers,
      params  : params
    });
    return this.http.delete(this.baseURL+'/api/v1/agrometmodels/' + filename, options).map(
      (response: Response) => response.json()
    );
  }
}
