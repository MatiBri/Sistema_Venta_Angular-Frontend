import { Injectable } from '@angular/core';

//Solicitudes HTTP
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments'
import { ResponseApi } from '../Interfaces/response-api';


@Injectable({
  providedIn: 'root'
})
export class RolService {
  private urlApi:string = environment.endpoint + "Rol/";
  
  constructor(private http:HttpClient){}

  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }
}
