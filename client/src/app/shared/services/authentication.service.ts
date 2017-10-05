import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as JWT from 'jwt-decode';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthenticationService {
  baseURL: string = environment.apiUrl;
  constructor(
    private http: Http
  ) { }

  logout(){
    localStorage.removeItem('heladas-token');
  }

  isLoggedIn(): boolean {
    var token = this.getToken();

    if(token){
      let payload: any = JWT(token);
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  register(user: any) {
    return this.http.post(this.baseURL+'/api/v1/register', user).map(
      (response: Response) => response.json()
    );
  }

  login(credentials: any){
    return this.http.post(this.baseURL+'/api/v1/login', credentials).map(
      (response: Response) => response.json()
    );
  }

  getCurrentUser(){
    if(this.isLoggedIn()){
      let token = this.getToken();
      let payload: any = JWT(token);
      return {
        id : payload._id,
        email : payload.email,
        name: payload.name,
        role: payload.role
      }
    }
  }

  saveToken(token: string){
    localStorage.setItem('heladas-token', token);
  }

  getToken() : string{
    return localStorage.getItem('heladas-token');
  }
}
