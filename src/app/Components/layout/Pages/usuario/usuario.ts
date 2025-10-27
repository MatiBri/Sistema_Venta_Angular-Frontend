import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario';
import { Usuario } from '../../../../Interfaces/usuario';
import { UsuarioService } from '../../../../Services/usuario';
import { UtilidadService } from '../../../../Reutilizable/utilidad';

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

  columnasTabla : string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'acciones'];
  dataInicio: Usuario[] = [];
  dataListaUsuarios = new MatTableDataSource<Usuario>(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerUsuarios(){
    this._usuarioServicio.lista().subscribe({
    next: (data) => {
      if(data.status)
        this.dataListaUsuarios.data = data.value;
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
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLowerCase();
  }

  nuevoUsuario(){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerUsuarios();
      }
    });
  }

  editarUsuario(usuario: Usuario){
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true"){
        this.obtenerUsuarios();
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
              this.obtenerUsuarios();
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
