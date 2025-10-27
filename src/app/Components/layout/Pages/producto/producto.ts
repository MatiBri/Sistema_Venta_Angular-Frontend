// src/app/Components/layout/Pages/usuario/usuario.ts
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material & CDK
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

// Servicios / componentes
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto';
import { Producto } from '../../../../Interfaces/producto';
import { ProductoService } from '../../../../Services/producto';
import { UtilidadService } from '../../../../Reutilizable/utilidad';

// Utiles
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from "@angular/forms";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-producto',
  imports: [
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './producto.html',
  styleUrls: ['./producto.css']
})
export class ProductoComponent implements OnInit, AfterViewInit{

  //Variables de columnas para las tablas
    columnasTabla : string[] = ['nombre', 'categoria', 'stock', 'precio', 'estado', 'acciones'];
    dataInicio: Producto[] = []; //Array que va a contener la información de los usuarios. Por defecto es un array vacío
    dataListaProductos = new MatTableDataSource(this.dataInicio); //Fuente de datos para la tabla
    @ViewChild(MatPaginator) paginacionTabla!: MatPaginator; //Variable para la paginación de la tabla. "!" omite valores nulos

  constructor(
      private dialog: MatDialog,
      private _productoServicio: ProductoService,
      private _utilidadServicio: UtilidadService
    ){}

    obtenerProductos(){
      this._productoServicio.lista().subscribe({
        next: (data) => {
          if(data.status)
            this.dataListaProductos.data = data.value; //Asignamos la información a la fuente de datos de la tabla
          else
            this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops!");
        },
        error: (e) => {
          console.log(e);
        }
      });
    }

    ngOnInit(): void {
      this.obtenerProductos();
    }

    ngAfterViewInit(): void {
      this.dataListaProductos.paginator = this.paginacionTabla; //Creamos la paginación a la tabla
    }

    aplicarFiltroTabla(event: Event){
      const filterValue = (event.target as HTMLInputElement).value; //Obtenemos el valor del input
      this.dataListaProductos.filter = filterValue.trim().toLowerCase(); //Aplicamos el filtro a la tabla
    }

    nuevoProducto(){
        this.dialog.open(ModalProductoComponent, {
          disableClose: true, //No se puede cerrar el modal dando click fuera de él
        }).afterClosed().subscribe(resultado => {
          if(resultado === "true"){
            this.obtenerProductos(); //Actualizo la lista
          }
        });
      }

    editarProducto(producto: Producto){
        this.dialog.open(ModalProductoComponent, {
          disableClose: true,
          data: producto //Pasamos la información del producto al modal
        }).afterClosed().subscribe(resultado => {
          if(resultado === "true"){
            this.obtenerProductos(); //Actualizo la lista
          }
     });
    }

    eliminarProducto(producto: Producto){
        Swal.fire({
          title: '¿Desea eliminar el producto?',
          text: `Usuario: ${producto.nombre}`,
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar',
          showCancelButton: true,
          cancelButtonColor: '#d33',
          cancelButtonText: 'No, volver',
        }).then((resultado) => {
          if(resultado.isConfirmed){
            this._productoServicio.eliminar(producto.idProducto).subscribe({
              next: (data) => {
                if(data.status){
                  this._utilidadServicio.mostrarAlerta("El producto fue eliminado", "Listo!");
                  this.obtenerProductos(); //Actualizo la lista
                }else{
                  this._utilidadServicio.mostrarAlerta("No se pudo eliminar el producto", "Error");
                }
              },
              error: (e) => {
                  
              }
            })
          }
        })
      }

}
