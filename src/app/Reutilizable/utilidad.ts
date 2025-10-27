import { Injectable } from '@angular/core';

//Importaciones
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../Interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {


  constructor(private _snackBar: MatSnackBar){}

  //Método que devuelve un mensaje de alerta
  mostrarAlerta(mensaje:string, tipo: string){

    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000 //Representa 3 segundos
    })
  }

  guardarSesionUsuario(usuarioSesion: Sesion){
    localStorage.setItem("usuario", JSON.stringify(usuarioSesion));  //Esto nos va a permitir guardar informacion en memoria del navegador del usuario
  }

  obtenerSesionUsuario() {
    const dataCadena = localStorage.getItem("usuario");

    const usuario = JSON.parse(dataCadena!); //El signo de admiración le dice a TypeScript que estamos esperando un valor que no es nulo
    return usuario;
  }

  eliminarSesionUsuario(){

    localStorage.removeItem("usuario");
  }

}
