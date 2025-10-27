import { Injectable } from '@angular/core';

//Solicitudes HTTP
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments'
import { ResponseApi } from '../Interfaces/response-api'; 

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {
  //URL
  private urlApi:string = environment.endpoint + "DashBoard/";
  
  constructor(private http:HttpClient){}

  resumen():Observable<ResponseApi>{
      return this.http.get<ResponseApi>(`${this.urlApi}Resumen`)
  }
}
