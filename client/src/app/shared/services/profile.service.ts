import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as JWT from 'jwt-decode';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class ProfileService {
  baseURL: string = environment.apiUrl;
  constructor(
    private http: Http,
    private authenticationService: AuthenticationService
  ) { }

  getProfile(): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseURL+'/api/v1/profile', options).map(
      (response: Response) => response.json()
    );
  }

  updateProfile(user): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.patch(this.baseURL+'/api/v1/profile', user, options).map(
      (response: Response) => response.json()
    );
  }

  getSettings(): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.get(this.baseURL+'/api/v1/settings', options).map(
      (response: Response) => response.json()
    );
  }

  updateSettings(settings): any{
    let headers = new Headers({
      'Authorization': 'Bearer ' + this.authenticationService.getToken()
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http.patch(this.baseURL+'/api/v1/settings', settings, options).map(
      (response: Response) => response.json()
    );
  }
}
