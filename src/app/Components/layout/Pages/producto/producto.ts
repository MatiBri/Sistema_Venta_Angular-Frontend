import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto';
import { Producto } from '../../../../Interfaces/producto';
import { ProductoService } from '../../../../Services/producto';
import { UtilidadService } from '../../../../Reutilizable/utilidad';

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

    columnasTabla : string[] = ['nombre', 'categoria', 'stock', 'precio', 'estado', 'acciones'];
    dataInicio: Producto[] = [];
    dataListaProductos = new MatTableDataSource(this.dataInicio);
    @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
      private dialog: MatDialog,
      private _productoServicio: ProductoService,
      private _utilidadServicio: UtilidadService
    ){}

    obtenerProductos(){
      this._productoServicio.lista().subscribe({
        next: (data) => {
          if(data.status)
            this.dataListaProductos.data = data.value;
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
      this.dataListaProductos.paginator = this.paginacionTabla;
    }

    aplicarFiltroTabla(event: Event){
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataListaProductos.filter = filterValue.trim().toLowerCase();
    }

    nuevoProducto(){
        this.dialog.open(ModalProductoComponent, {
          disableClose: true,
        }).afterClosed().subscribe(resultado => {
          if(resultado === "true"){
            this.obtenerProductos();
          }
        });
      }

    editarProducto(producto: Producto){
        this.dialog.open(ModalProductoComponent, {
          disableClose: true,
          data: producto
        }).afterClosed().subscribe(resultado => {
          if(resultado === "true"){
            this.obtenerProductos();
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
                  this.obtenerProductos();
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
