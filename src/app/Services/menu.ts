import { Injectable } from '@angular/core';

//Solicitudes HTTP
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; //Esto nos permite poder recibir las respuestas de las APIs
import { environment } from '../../environments/environments'
import { ResponseApi } from '../Interfaces/response-api'; 

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  //URL
  private urlApi:string = environment.endpoint + "Menu/";

  constructor(private http:HttpClient){}

  lista(idUsuario: number):Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista?idUsuario=${idUsuario}`) //Le pasamos el id del usuario que está en el localStorage
  }

  
}
