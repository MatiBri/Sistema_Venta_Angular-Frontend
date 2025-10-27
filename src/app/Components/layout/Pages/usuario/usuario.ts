// src/app/Components/layout/Pages/usuario/usuario.ts
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material & CDK
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// Servicios / componentes
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario';
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario';
import { UtilidadService } from '../../../../Reutilizable/utilidad';

// Utiles
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  //Variables de columnas para las tablas
  columnasTabla : string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'acciones'];
  dataInicio: Usuario[] = []; //Array que va a contener la información de los usuarios. Por defecto es un array vacío
  dataListaUsuarios = new MatTableDataSource<Usuario>(this.dataInicio); //Fuente de datos para la tabla
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator; //Variable para la paginación de la tabla. "!" omite valores nulos

  constructor(
    private dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerUsuarios(){
    this._usuarioServicio.lista().subscribe({
    next: (data) => {
      if(data.status)
        this.dataListaUsuarios.data = data.value; //Asignamos la información a la fuente de datos de la tabla
      else
        this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
    },
    error: (e) => {
      console.log(e);
    }
  })
    
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla; //Creamos la paginación a la tabla
  }

  //Metodo para los filtros de la tabla cuando realizamos una búsqueda
  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value; //Obtenemos el valor del input
    this.dataListaUsuarios.filter = filterValue.trim().toLowerCase(); //Aplicamos el filtro a la tabla
    //trim() elimina los espacios en blanco
    //toLowerCase() convierte todo a minúsculas
  }

  //Abrir el modal cuando el usuario da click para crear un nuevo usuario
  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true, //No se puede cerrar el modal dando click fuera de él
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerUsuarios(); //Actualizo la lista
      }
    });
  }

  editarUsuario(usuario: Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario //Pasamos la información del usuario al modal
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerUsuarios(); //Actualizo la lista
      }
    });
  }

  eliminarUsuario(usuario: Usuario){
    Swal.fire({
      title: '¿Desea eliminar el usuario?',
      text: `Usuario: ${usuario.nombreCompleto}`,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, volver',
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadServicio.mostrarAlerta("Usuario eliminado con éxito", "Listo!");
              this.obtenerUsuarios(); //Actualizo la lista
            }else{
              this._utilidadServicio.mostrarAlerta("No se pudo eliminar el usuario", "Error");
            }
          },
          error: (e) => {
              
          }
        })
      }
    })
  }
  
}
