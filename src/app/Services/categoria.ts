import { Injectable } from '@angular/core';

//Solicitudes HTTP
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; //Esto nos permite poder recibir las respuestas de las APIs
import { environment } from '../../environments/environments'
import { ResponseApi } from '../Interfaces/response-api'; 

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  //URL
  private urlApi:string = environment.endpoint + "Categoria/";
  
  constructor(private http:HttpClient){}

  //Lista de Categorias
  lista():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`)
  }
}
