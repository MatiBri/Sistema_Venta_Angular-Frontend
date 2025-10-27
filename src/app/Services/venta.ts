import { Injectable } from '@angular/core';

//Solicitudes HTTP
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; //Esto nos permite poder recibir las respuestas de las APIs
import { environment } from '../../environments/environments'
import { ResponseApi } from '../Interfaces/response-api'; 
import { Venta } from '../Interfaces/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  //URL
  private urlApi:string = environment.endpoint + "Venta/";
  
  constructor(private http:HttpClient){}

  registrar(request:Venta):Observable<ResponseApi>{
        return this.http.post<ResponseApi>(`${this.urlApi}Registrar`, request)
  }
  
  historial(buscarPor: string, numeroVenta: string, fechaInicio: string, fechaFin: string):Observable<ResponseApi>{
    //Url para poder ejecutar el método Historial en Swagger
    //http://localhost:5042/api/Venta/Historial?buscarPor=&numeroVenta=&fechaInicio=&fechaFin=
        return this.http.get<ResponseApi>(`${this.urlApi}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }

  reporte(fechaInicio: string, fechaFin: string):Observable<ResponseApi>{
        return this.http.get<ResponseApi>(`${this.urlApi}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
  }
}
