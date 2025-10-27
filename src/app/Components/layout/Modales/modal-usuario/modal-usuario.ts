import { Component, Inject } from '@angular/core';

// Formularios
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Material
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

// Angular
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Interfaces / Servicios / Utilidades
import { Usuario } from '../../../../Interfaces/usuario';
import { RolService } from '../../../../Services/rol';
import { UsuarioService } from '../../../../Services/usuario';
import { UtilidadService } from '../../../../Reutilizable/utilidad';

@Component({
  selector: 'app-modal-usuario',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule
  ],
  templateUrl: './modal-usuario.html',
  styleUrls: ['./modal-usuario.css']
})
export class ModalUsuarioComponent {

  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaRoles: any[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datosUsuario: Usuario,
    private fb: FormBuilder,
    //Inyeccion de servicios
    @Inject(RolService) private _rolServicio: RolService,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService

  ){

    //Campos del formulario
    this.formularioUsuario = this.fb.group({
      nombreCompleto : ["", Validators.required],
      correo : ["", Validators.required],
      idRol : ["", Validators.required],
      clave : ["", Validators.required],
      esActivo : ["1", Validators.required],
  });

  //Si tenemos informacion
  if(this.datosUsuario != null){
    this.tituloAccion = "Editar";
    this.botonAccion = "Actualizar";
  }

  //Obtener la lista de roles para pintar en el desplegable
  this._rolServicio.lista().subscribe({
    next: (data) => {
      if(data.status) this.listaRoles = data.value;
    },
    error: (e) => {
      
    }
  })

}

//Este método se ejecuta cuando el componente esta iniciando o esta cargado
  ngOnInit(): void {
    if(this.datosUsuario != null){
      //Información del formulario del usuario
      this.formularioUsuario.patchValue({
      nombreCompleto : this.datosUsuario.nombreCompleto,
      correo : this.datosUsuario.correo,
      idRol : this.datosUsuario.idRol,
      clave : this.datosUsuario.clave,
      esActivo : this.datosUsuario.esActivo.toString()
      });
    }
  }

  //Método para poder crear o editar un usuario
  guardarEditar_Usuario(){
    const _usuario : Usuario = {
      idUsuario: this.datosUsuario == null ? 0 : this.datosUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion : "",
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }

      //Servicio para guardar o editar un usuario
    if(this.datosUsuario == null){
      //Creamos un usuario
      this._usuarioServicio.guardar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("Usuario registrado con éxito", "Exito");
            //Después de creado el usuario, se cerrará el modal
            this.modalActual.close("true");
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo registrar el usuario", "Error");
          }          
        },
        error: (e) => {
          this._utilidadServicio.mostrarAlerta("Hubo un error", "Error");
        }
    })
    
  }else{
    this._usuarioServicio.editar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue editado", "Exito");
            //Después de creado el usuario, se cerrará el modal
            this.modalActual.close("true");
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo editar el usuario", "Error");
          }          
        },
        error: (e) => {
          this._utilidadServicio.mostrarAlerta("Hubo un error", "Error");
        }
    })
  }

  }
}