import { Injectable } from '@angular/core';

//Solicitudes HTTP
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; //Esto nos permite poder recibir las respuestas de las APIs
import { environment } from '../../environments/environments'
import { ResponseApi } from '../Interfaces/response-api'; 
import { Producto } from '../Interfaces/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  //URL
  private urlApi:string = environment.endpoint + "Producto/";
  
  constructor(private http:HttpClient){}

  lista():Observable<ResponseApi>{
      return this.http.get<ResponseApi>(`${this.urlApi}Lista`) //Esto tiene que coincidir con el nombre del método en el controlador de la API en Swagger
  }
  
  guardar(request:Producto):Observable<ResponseApi>{
      return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }
  
  editar(request:Producto):Observable<ResponseApi>{
      return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }
  
  eliminar(id: number):Observable<ResponseApi>{
      return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
