import { Component } from '@angular/core';

//Importaciones
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; //Para las redirecciones a otras paginas
import { Login } from '../../Interfaces/login';
import { UsuarioService } from '../../Services/usuario';
import { UtilidadService } from '../../Reutilizable/utilidad';
import { MatCardContent } from "@angular/material/card";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardContent, MatCardModule, MatButtonModule, MatInputModule, ReactiveFormsModule, MatIconModule, MatProgressBarModule, CommonModule],
  // providers: [UsuarioService, UtilidadService, FormBuilder, Router, HttpClient],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){
    this.formularioLogin = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['', [Validators.required]]
    });
  }
  
  iniciarSesion(){
    this.mostrarLoading = true; //Muestra el loading
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    }
    this._usuarioServicio.iniciarSesion(request).subscribe({
    next: (data) => {
      if(data.status){
        this._utilidadServicio.guardarSesionUsuario(data.value);
        this.router.navigate(['/pages']);
      }else{
        this._utilidadServicio.mostrarAlerta("No se encontraron coincidencias", "Oops!");
      }
    },
    complete: () => {
      this.mostrarLoading = false; //Oculta el loading
    },
    error: (e) => {
        this._utilidadServicio.mostrarAlerta("Hubo un error", "Oops!");
    }
  });


  }
}
