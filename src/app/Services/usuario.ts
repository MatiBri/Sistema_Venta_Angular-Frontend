import { Injectable } from '@angular/core';

//Solicitudes HTTP
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; //Esto nos permite poder recibir las respuestas de las APIs
import { environment } from '../../environments/environments'
import { ResponseApi } from '../Interfaces/response-api'; //Importamos la interfaz que permite recibir la respuesta de las solicitudes HTTP el cual creamos como response-api
import { Login } from '../Interfaces/login';
import { Usuario } from '../Interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //Creo las variables para armar las URL de la APi
  private urlApi:string = environment.endpoint + "Usuario/"; //http://localhost:5042/api/Usuarios/

  //Inyectamos el HttpClient en el constructor
  constructor(private http:HttpClient){}

  //Recibe un request del tipo Login
  iniciarSesion(request:Login):Observable<ResponseApi>{
    //Ejecuta el método iniciarSesion de la API. La URL sería /api/USuario/IniciarSesion en Swagger
    return this.http.post<ResponseApi>(`${this.urlApi}IniciarSesion`, request)
  }

  lista():Observable<ResponseApi>{
    //api/Producto/Lista en Swagger
    return this.http.get<ResponseApi>(`${this.urlApi}Lista`) //Esto tiene que coincidir con el nombre del método en el controlador de la API en Swagger
  }

  guardar(request:Usuario):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.urlApi}Guardar`, request)
  }

  editar(request:Usuario):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(`${this.urlApi}Editar`, request)
  }

  eliminar(id: number):Observable<ResponseApi>{
    //Esto es la construcción de la URL para eliminar un usuario
    //http://localhost:5042/api/Usuario/Eliminar/3 -> Ejemplo. Revisar Swagger
    return this.http.delete<ResponseApi>(`${this.urlApi}Eliminar/${id}`)
  }
}
